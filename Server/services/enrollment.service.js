const Enrollment = require('../models/Enrollment');
const Student = require('../models/Student');
const Course = require('../models/Course');

exports.createEnrollment = async (enrollmentData, organizationId) => {
  const { student: studentId, course: courseId, academicYear, semester } = enrollmentData;

  // 1. Verify Student
  const student = await Student.findOne({ _id: studentId, organization: organizationId });
  if (!student) {
    throw new Error('Student not found or does not belong to your organization');
  }
  if (!student.isActive) {
    throw new Error('Cannot enroll an inactive student');
  }

  // 2. Verify Course
  const course = await Course.findOne({ _id: courseId, organization: organizationId });
  if (!course) {
    throw new Error('Course not found or does not belong to your organization');
  }
  if (!course.isActive) {
    throw new Error('Cannot enroll in an inactive course');
  }

  // 3. Department Consistency
  // Student and Course must belong to the same department
  if (student.department.toString() !== course.department.toString()) {
    throw new Error('Student and course must belong to the same department');
  }

  // 4. Duplicate Check
  const existingEnrollment = await Enrollment.findOne({
    organization: organizationId,
    student: studentId,
    course: courseId,
    academicYear,
    semester
  });
  
  if (existingEnrollment) {
    const err = new Error('Student is already enrolled in this course for this semester.');
    err.code = 11000;
    throw err;
  }

  // 5. Create
  const enrollment = await Enrollment.create({
    student: studentId,
    course: courseId,
    academicYear,
    semester,
    organization: organizationId,
    status: 'ENROLLED',
    enrolledAt: new Date()
  });

  return enrollment.populate([
    { path: 'student', select: 'firstName lastName studentId admissionNumber' },
    { path: 'course', select: 'name courseCode department credits', populate: { path: 'department', select: 'name code' } }
  ]);
};

exports.getEnrollments = async (organizationId, queryParams) => {
  const { 
    page = 1, 
    limit = 10, 
    search, 
    student, 
    course,
    department, 
    semester, 
    academicYear, 
    status 
  } = queryParams;
  
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = Math.min(parseInt(limit, 10) || 10, 50);
  const skip = (pageNum - 1) * limitNum;
  
  const query = { organization: organizationId };
  
  if (student) query.student = student;
  if (course) query.course = course;
  if (semester && semester !== 'all') query.semester = Number(semester);
  if (academicYear && academicYear !== 'all') query.academicYear = academicYear;
  if (status && status !== 'all') query.status = status;

  // We can't directly query the Enrollment collection by department if it's not stored there.
  // Instead, if department is provided, we might need to find courses matching that department first.
  if (department && department !== 'all') {
    const coursesInDept = await Course.find({ department, organization: organizationId }).select('_id');
    const courseIds = coursesInDept.map(c => c._id);
    // Merge with existing course query if present
    if (query.course) {
      if (!courseIds.some(id => id.toString() === query.course.toString())) {
        // The specified course is not in the specified department, so return empty
        query.course = null; // Forces empty result
      }
    } else {
      query.course = { $in: courseIds };
    }
  }

  // Handle Search on populated fields (Student name/ID, Course name/Code)
  let enrollments = await Enrollment.find(query)
    .populate({ 
      path: 'student', 
      select: 'firstName lastName studentId admissionNumber department',
    })
    .populate({ 
      path: 'course', 
      select: 'name courseCode department',
      populate: { path: 'department', select: 'name code' }
    })
    .sort({ createdAt: -1 });

  // In-memory search filter because we cannot easily run $regex across populated collections in a single query
  // For production, consider storing searchable denormalized data or using Aggregation Pipeline.
  if (search) {
    const s = search.toLowerCase();
    enrollments = enrollments.filter(e => {
      const studentMatch = 
        e.student?.firstName?.toLowerCase().includes(s) ||
        e.student?.lastName?.toLowerCase().includes(s) ||
        e.student?.studentId?.toLowerCase().includes(s) ||
        e.student?.admissionNumber?.toLowerCase().includes(s);
        
      const courseMatch = 
        e.course?.name?.toLowerCase().includes(s) ||
        e.course?.courseCode?.toLowerCase().includes(s);
        
      return studentMatch || courseMatch;
    });
  }

  const total = enrollments.length;
  const paginatedData = enrollments.slice(skip, skip + limitNum);

  return {
    data: paginatedData,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum)
    }
  };
};

exports.getEnrollmentById = async (id, organizationId) => {
  const enrollment = await Enrollment.findOne({ _id: id, organization: organizationId })
    .populate('student', 'firstName lastName studentId admissionNumber email phone gender')
    .populate({ 
      path: 'course', 
      select: 'name courseCode description credits semester courseType',
      populate: { path: 'department', select: 'name code' }
    });
    
  if (!enrollment) {
    const err = new Error('Enrollment not found');
    err.name = 'CastError';
    throw err;
  }
  return enrollment;
};

exports.updateEnrollmentStatus = async (id, organizationId, status) => {
  const validStatuses = ['ENROLLED', 'DROPPED', 'COMPLETED'];
  if (!validStatuses.includes(status)) {
    throw new Error('Invalid status');
  }

  const enrollment = await Enrollment.findOne({ _id: id, organization: organizationId });
  if (!enrollment) {
    const err = new Error('Enrollment not found');
    err.name = 'CastError';
    throw err;
  }

  // Handle droppedAt
  if (status === 'DROPPED' && enrollment.status !== 'DROPPED') {
    enrollment.droppedAt = new Date();
  } else if (status === 'ENROLLED' && enrollment.status === 'DROPPED') {
    enrollment.droppedAt = undefined;
  }

  enrollment.status = status;
  await enrollment.save();

  return enrollment.populate([
    { path: 'student', select: 'firstName lastName studentId admissionNumber' },
    { path: 'course', select: 'name courseCode department credits', populate: { path: 'department', select: 'name code' } }
  ]);
};

exports.deleteEnrollment = async (id, organizationId) => {
  const enrollment = await Enrollment.findOne({ _id: id, organization: organizationId });
  
  if (!enrollment) {
    const err = new Error('Enrollment not found');
    err.name = 'CastError';
    throw err;
  }

  await enrollment.deleteOne();
  return { success: true, message: 'Enrollment deleted successfully' };
};
