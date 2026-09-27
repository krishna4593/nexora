const AttendanceSession = require('../models/AttendanceSession');
const AttendanceRecord = require('../models/AttendanceRecord');
const Course = require('../models/Course');
const Faculty = require('../models/Faculty');
const Enrollment = require('../models/Enrollment');
const mongoose = require('mongoose');

exports.createSession = async (sessionData, organizationId, adminId) => {
  const { course: courseId, faculty: facultyId, date, startTime, endTime, topic, notes } = sessionData;

  // 1. Verify Course
  const course = await Course.findOne({ _id: courseId, organization: organizationId });
  if (!course) {
    throw new Error('Course not found or does not belong to your organization');
  }
  if (!course.isActive) {
    throw new Error('Cannot create session for an inactive course');
  }

  // 2. Verify Faculty
  const faculty = await Faculty.findOne({ _id: facultyId, organization: organizationId });
  if (!faculty) {
    throw new Error('Faculty not found or does not belong to your organization');
  }
  if (!faculty.isActive) {
    throw new Error('Cannot assign an inactive faculty to a session');
  }

  // 3. Verify Faculty Department matches Course Department
  if (faculty.department.toString() !== course.department.toString()) {
    throw new Error('Faculty must belong to the same department as the course');
  }

  // 4. Timezone/Date normalization (store UTC start of day if just date, or preserve as ISO)
  // Assuming frontend sends YYYY-MM-DD
  const normalizedDate = new Date(date);
  
  // 5. Duplicate Check
  const existingSession = await AttendanceSession.findOne({
    organization: organizationId,
    course: courseId,
    date: normalizedDate,
    startTime
  });

  if (existingSession) {
    const err = new Error('An attendance session already exists for this course on this date and time.');
    err.code = 11000;
    throw err;
  }

  const session = await AttendanceSession.create({
    organization: organizationId,
    course: courseId,
    faculty: facultyId,
    date: normalizedDate,
    startTime,
    endTime,
    topic,
    notes,
    createdBy: adminId
  });

  return session.populate([
    { path: 'course', select: 'name courseCode department' },
    { path: 'faculty', select: 'firstName lastName employeeId' }
  ]);
};

exports.getSessions = async (organizationId, queryParams) => {
  const { 
    page = 1, 
    limit = 10, 
    course, 
    faculty, 
    department,
    date,
    fromDate,
    toDate,
    status 
  } = queryParams;

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = Math.min(parseInt(limit, 10) || 10, 50);
  const skip = (pageNum - 1) * limitNum;

  const query = { organization: organizationId };

  if (course && course !== 'all') query.course = course;
  if (faculty && faculty !== 'all') query.faculty = faculty;
  if (status && status !== 'all') query.status = status;
  
  if (date) {
    // Exact date match (assuming date is stored as exact 00:00:00 of that day)
    const d = new Date(date);
    query.date = { 
      $gte: new Date(d.setUTCHours(0,0,0,0)), 
      $lte: new Date(d.setUTCHours(23,59,59,999)) 
    };
  } else if (fromDate || toDate) {
    query.date = {};
    if (fromDate) query.date.$gte = new Date(fromDate);
    if (toDate) {
       const td = new Date(toDate);
       query.date.$lte = new Date(td.setUTCHours(23,59,59,999));
    }
  }

  if (department && department !== 'all') {
    const coursesInDept = await Course.find({ department, organization: organizationId }).select('_id');
    const courseIds = coursesInDept.map(c => c._id);
    if (query.course) {
      if (!courseIds.some(id => id.toString() === query.course.toString())) {
        query.course = null; 
      }
    } else {
      query.course = { $in: courseIds };
    }
  }

  // To display the attendance summary (42/48 present) efficiently on list view, we can aggregate
  // For now, to keep it simple and performant, we'll fetch sessions, then fetch record counts.
  
  const sessions = await AttendanceSession.find(query)
    .populate('course', 'name courseCode department')
    .populate('faculty', 'firstName lastName employeeId')
    .sort({ date: -1, startTime: -1 })
    .skip(skip)
    .limit(limitNum)
    .lean();

  const total = await AttendanceSession.countDocuments(query);

  // Attach summary
  for (let session of sessions) {
    const stats = await AttendanceRecord.aggregate([
      { $match: { session: session._id } },
      { $group: {
          _id: null,
          total: { $sum: 1 },
          present: { $sum: { $cond: [{ $eq: ["$status", "PRESENT"] }, 1, 0] } },
          late: { $sum: { $cond: [{ $eq: ["$status", "LATE"] }, 1, 0] } }
      }}
    ]);
    
    if (stats.length > 0) {
      session.attendanceSummary = {
        total: stats[0].total,
        present: stats[0].present,
        late: stats[0].late,
        attended: stats[0].present + stats[0].late
      };
    } else {
      session.attendanceSummary = { total: 0, present: 0, late: 0, attended: 0 };
    }
  }

  return {
    data: sessions,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum)
    }
  };
};

exports.getSessionById = async (id, organizationId) => {
  const session = await AttendanceSession.findOne({ _id: id, organization: organizationId })
    .populate('course', 'name courseCode department credits')
    .populate('faculty', 'firstName lastName employeeId')
    .lean();

  if (!session) {
    const err = new Error('Attendance session not found');
    err.name = 'CastError';
    throw err;
  }

  const records = await AttendanceRecord.find({ session: session._id }).lean();
  
  const summary = {
    totalStudents: records.length,
    present: 0,
    absent: 0,
    late: 0,
    excused: 0,
    attendancePercentage: 0
  };

  records.forEach(r => {
    if (r.status === 'PRESENT') summary.present++;
    if (r.status === 'ABSENT') summary.absent++;
    if (r.status === 'LATE') summary.late++;
    if (r.status === 'EXCUSED') summary.excused++;
  });

  const validDenominator = summary.present + summary.late + summary.absent; // EXCUSED not in denominator
  if (validDenominator > 0) {
    summary.attendancePercentage = ((summary.present + summary.late) / validDenominator) * 100;
  }

  session.summary = summary;
  return session;
};

exports.getSessionRecords = async (id, organizationId) => {
  const session = await AttendanceSession.findOne({ _id: id, organization: organizationId });
  if (!session) throw new Error('Session not found');

  // Find existing records
  const existingRecords = await AttendanceRecord.find({ session: session._id })
    .populate('student', 'firstName lastName studentId admissionNumber')
    .lean();

  if (existingRecords.length > 0) {
    return existingRecords;
  }

  // If no records exist yet, generate the sheet based on ENROLLED students
  const activeEnrollments = await Enrollment.find({
    course: session.course,
    organization: organizationId,
    status: 'ENROLLED'
  }).populate('student', 'firstName lastName studentId admissionNumber isActive').lean();

  // Return formatted array ready for the frontend (but not saved to DB yet)
  const initialRecords = activeEnrollments
    .filter(e => e.student.isActive) // Only active students
    .map(e => ({
      _id: `temp_${e.student._id}`, // Frontend needs a key
      isNew: true,
      session: session._id,
      student: e.student,
      enrollment: e._id,
      status: 'PRESENT', // default
      remarks: ''
    }));

  return initialRecords.sort((a, b) => a.student.firstName.localeCompare(b.student.firstName));
};

exports.bulkMarkAttendance = async (id, recordsData, organizationId, adminId) => {
  const session = await AttendanceSession.findOne({ _id: id, organization: organizationId });
  if (!session) throw new Error('Session not found');
  if (session.status === 'CANCELLED') throw new Error('Cannot mark attendance for a cancelled session');

  const sessionDB = await mongoose.startSession();
  sessionDB.startTransaction();

  try {
    const results = [];
    
    // We fetch all valid enrollments for this course to validate against
    const validEnrollments = await Enrollment.find({ 
      course: session.course, 
      organization: organizationId,
      status: 'ENROLLED' 
    }).session(sessionDB);
    const validEnrollmentIds = validEnrollments.map(e => e._id.toString());
    const validStudentIds = validEnrollments.map(e => e.student.toString());

    for (const record of recordsData) {
      if (!validStudentIds.includes(record.student.toString())) {
        throw new Error(`Student ${record.student} is not actively enrolled in this course.`);
      }
      if (!validEnrollmentIds.includes(record.enrollment.toString())) {
        throw new Error(`Invalid enrollment ID for student ${record.student}.`);
      }

      const existingRecord = await AttendanceRecord.findOne({
        session: session._id,
        student: record.student
      }).session(sessionDB);

      if (existingRecord) {
        // Update
        existingRecord.status = record.status;
        existingRecord.remarks = record.remarks;
        existingRecord.markedAt = new Date();
        existingRecord.markedBy = adminId;
        await existingRecord.save({ session: sessionDB });
        results.push(existingRecord);
      } else {
        // Create
        const newRecord = await AttendanceRecord.create([{
          session: session._id,
          student: record.student,
          enrollment: record.enrollment,
          status: record.status,
          remarks: record.remarks,
          markedBy: adminId
        }], { session: sessionDB });
        results.push(newRecord[0]);
      }
    }

    await sessionDB.commitTransaction();
    sessionDB.endSession();
    return results;

  } catch (error) {
    await sessionDB.abortTransaction();
    sessionDB.endSession();
    throw error;
  }
};

exports.updateSessionStatus = async (id, status, organizationId) => {
  const validStatuses = ['OPEN', 'COMPLETED', 'CANCELLED'];
  if (!validStatuses.includes(status)) {
    throw new Error('Invalid status');
  }

  const session = await AttendanceSession.findOne({ _id: id, organization: organizationId });
  if (!session) {
    const err = new Error('Attendance session not found');
    err.name = 'CastError';
    throw err;
  }

  session.status = status;
  await session.save();
  
  return session;
};

exports.getStudentReport = async (studentId, organizationId, queryParams) => {
  const { course, academicYear, semester, fromDate, toDate } = queryParams;

  // Verify student
  const student = await mongoose.model('Student').findOne({ _id: studentId, organization: organizationId });
  if (!student) throw new Error('Student not found');

  const matchQuery = { student: student._id };

  // Fetch all records for this student and populate session
  const records = await AttendanceRecord.find(matchQuery)
    .populate({
      path: 'session',
      match: { organization: organizationId }, // Ensure session matches org
      populate: { path: 'course', select: 'name courseCode department' }
    })
    .lean();

  // Filter records in memory (because session fields are populated)
  const validRecords = records.filter(r => {
    if (!r.session) return false;
    
    if (course && r.session.course._id.toString() !== course) return false;
    
    if (fromDate) {
      if (new Date(r.session.date) < new Date(fromDate)) return false;
    }
    if (toDate) {
      if (new Date(r.session.date) > new Date(new Date(toDate).setUTCHours(23,59,59,999))) return false;
    }
    
    return true;
  });

  // Calculate overall stats
  const overall = {
    totalSessions: validRecords.length,
    present: 0,
    absent: 0,
    late: 0,
    excused: 0,
    attendancePercentage: 0
  };

  const courseBreakdownMap = {};

  validRecords.forEach(r => {
    const status = r.status;
    const courseId = r.session.course._id.toString();
    const courseName = r.session.course.name;
    const courseCode = r.session.course.courseCode;

    if (!courseBreakdownMap[courseId]) {
      courseBreakdownMap[courseId] = {
        course: { id: courseId, name: courseName, code: courseCode },
        sessions: 0,
        present: 0,
        absent: 0,
        late: 0,
        excused: 0,
        percentage: 0
      };
    }

    const cStats = courseBreakdownMap[courseId];
    overall.totalSessions++;
    cStats.sessions++;

    if (status === 'PRESENT') { overall.present++; cStats.present++; }
    if (status === 'ABSENT') { overall.absent++; cStats.absent++; }
    if (status === 'LATE') { overall.late++; cStats.late++; }
    if (status === 'EXCUSED') { overall.excused++; cStats.excused++; }
  });

  // Calculate percentages
  const overallDenom = overall.present + overall.late + overall.absent;
  if (overallDenom > 0) overall.attendancePercentage = ((overall.present + overall.late) / overallDenom) * 100;

  const courseBreakdown = Object.values(courseBreakdownMap).map(c => {
    const cDenom = c.present + c.late + c.absent;
    if (cDenom > 0) c.percentage = ((c.present + c.late) / cDenom) * 100;
    return c;
  });

  return {
    student: {
      id: student._id,
      name: `${student.firstName} ${student.lastName}`,
      studentId: student.studentId
    },
    overall,
    courseBreakdown
  };
};

exports.getCourseReport = async (courseId, organizationId, queryParams) => {
  const { fromDate, toDate } = queryParams;

  const course = await Course.findOne({ _id: courseId, organization: organizationId });
  if (!course) throw new Error('Course not found');

  const sessionQuery = { course: course._id, organization: organizationId };
  if (fromDate || toDate) {
    sessionQuery.date = {};
    if (fromDate) sessionQuery.date.$gte = new Date(fromDate);
    if (toDate) sessionQuery.date.$lte = new Date(new Date(toDate).setUTCHours(23,59,59,999));
  }

  const sessions = await AttendanceSession.find(sessionQuery).populate('faculty', 'firstName lastName').sort({ date: -1 }).lean();
  
  const report = {
    course: { id: course._id, name: course.name, code: course.courseCode },
    totalSessions: sessions.length,
    averageAttendance: 0,
    recentSessions: []
  };

  let totalAttended = 0;
  let totalValid = 0;

  for (const session of sessions) {
    const records = await AttendanceRecord.find({ session: session._id }).lean();
    
    let present = 0, absent = 0, late = 0, excused = 0;
    records.forEach(r => {
      if (r.status === 'PRESENT') present++;
      if (r.status === 'ABSENT') absent++;
      if (r.status === 'LATE') late++;
      if (r.status === 'EXCUSED') excused++;
    });

    const attended = present + late;
    const valid = attended + absent;

    totalAttended += attended;
    totalValid += valid;

    let percentage = 0;
    if (valid > 0) percentage = (attended / valid) * 100;

    report.recentSessions.push({
      id: session._id,
      date: session.date,
      topic: session.topic,
      faculty: `${session.faculty?.firstName} ${session.faculty?.lastName}`,
      present,
      absent,
      late,
      percentage
    });
  }

  if (totalValid > 0) {
    report.averageAttendance = (totalAttended / totalValid) * 100;
  }

  return report;
};
