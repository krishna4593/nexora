const Student = require('../models/Student');
const Department = require('../models/Department');
const Sequence = require('../models/Sequence');

const verifyDepartment = async (departmentId, organizationId) => {
  const department = await Department.findOne({ _id: departmentId, organization: organizationId });
  if (!department) {
    const err = new Error('Invalid department or department does not belong to your organization');
    err.name = 'ValidationError';
    throw err;
  }
  return department;
};

const generateStudentId = async (organizationId, admissionYear) => {
  const counterName = `student_${admissionYear}`;
  
  const seq = await Sequence.findOneAndUpdate(
    { organization: organizationId, counterName },
    { $inc: { sequence: 1 } },
    { new: true, upsert: true }
  );

  const paddedSequence = seq.sequence.toString().padStart(3, '0');
  return `STU-${admissionYear}-${paddedSequence}`;
};

exports.createStudent = async (studentData, organizationId) => {
  // 1. Verify Department
  if (!studentData.department) {
    throw new Error('Department is required');
  }
  await verifyDepartment(studentData.department, organizationId);

  // 2. Check Admission Number uniqueness
  const admissionNumber = studentData.admissionNumber ? studentData.admissionNumber.trim().toUpperCase() : undefined;
  if (!admissionNumber) {
    throw new Error('Admission Number is required');
  }
  const existingAdm = await Student.findOne({ organization: organizationId, admissionNumber });
  if (existingAdm) {
    const err = new Error('A student with this Admission Number already exists in your organization');
    err.code = 11000;
    throw err;
  }

  // 3. Check Email uniqueness (if provided)
  if (studentData.email) {
    const email = studentData.email.trim().toLowerCase();
    const existingEmail = await Student.findOne({ organization: organizationId, email });
    if (existingEmail) {
      const err = new Error('A student with this email already exists in your organization');
      err.code = 11000;
      throw err;
    }
  }

  // 4. Generate Student ID
  const studentId = await generateStudentId(organizationId, studentData.admissionYear);

  // 5. Create Student
  const student = await Student.create({
    ...studentData,
    admissionNumber,
    studentId,
    organization: organizationId
  });

  return student.populate('department', 'name code');
};

exports.getStudents = async (organizationId, queryParams) => {
  const { 
    page = 1, 
    limit = 10, 
    search, 
    department, 
    semester, 
    academicYear, 
    admissionYear, 
    status 
  } = queryParams;
  
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = Math.min(parseInt(limit, 10) || 10, 50);
  const skip = (pageNum - 1) * limitNum;
  
  const query = { organization: organizationId };
  
  if (search) {
    query.$or = [
      { studentId: { $regex: search, $options: 'i' } },
      { admissionNumber: { $regex: search, $options: 'i' } },
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } }
    ];
  }
  
  if (department && department !== 'all') query.department = department;
  if (semester && semester !== 'all') query.semester = Number(semester);
  if (academicYear && academicYear !== 'all') query.academicYear = academicYear;
  if (admissionYear && admissionYear !== 'all') query.admissionYear = Number(admissionYear);

  if (status === 'active') {
    query.isActive = true;
  } else if (status === 'inactive') {
    query.isActive = false;
  }

  const total = await Student.countDocuments(query);
  const students = await Student.find(query)
    .populate('department', 'name code')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);
    
  return {
    data: students,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum)
    }
  };
};

exports.getStudentById = async (id, organizationId) => {
  const student = await Student.findOne({ _id: id, organization: organizationId })
    .populate('department', 'name code');
    
  if (!student) {
    const err = new Error('Student not found');
    err.name = 'CastError';
    throw err;
  }
  return student;
};

exports.updateStudent = async (id, organizationId, updateData) => {
  // Disallow immutable fields
  delete updateData.organization;
  delete updateData.organizationId;
  delete updateData.studentId;
  delete updateData.admissionNumber;

  const studentToUpdate = await Student.findOne({ _id: id, organization: organizationId });
  if (!studentToUpdate) {
    const err = new Error('Student not found');
    err.name = 'CastError';
    throw err;
  }

  // Re-verify department if changing
  if (updateData.department && updateData.department !== studentToUpdate.department.toString()) {
    await verifyDepartment(updateData.department, organizationId);
  }
  
  // Check Email uniqueness if changing
  if (updateData.email && updateData.email !== studentToUpdate.email) {
    const email = updateData.email.trim().toLowerCase();
    const existingEmail = await Student.findOne({ organization: organizationId, email, _id: { $ne: id } });
    if (existingEmail) {
      const err = new Error('A student with this email already exists in your organization');
      err.code = 11000;
      throw err;
    }
  }

  const student = await Student.findOneAndUpdate(
    { _id: id, organization: organizationId },
    updateData,
    { new: true, runValidators: true }
  ).populate('department', 'name code');

  return student;
};

exports.updateStudentStatus = async (id, organizationId, isActive) => {
  if (typeof isActive !== 'boolean') {
    throw new Error('isActive must be a boolean');
  }

  const student = await Student.findOneAndUpdate(
    { _id: id, organization: organizationId },
    { isActive },
    { new: true, runValidators: true }
  ).populate('department', 'name code');

  if (!student) {
    const err = new Error('Student not found');
    err.name = 'CastError';
    throw err;
  }

  return student;
};

exports.deleteStudent = async (id, organizationId) => {
  const student = await Student.findOne({ _id: id, organization: organizationId });
  
  if (!student) {
    const err = new Error('Student not found');
    err.name = 'CastError';
    throw err;
  }

  // Future check: see if student has enrollments or attendance records
  // e.g. const enrollmentCount = await Enrollment.countDocuments({ student: id })

  await student.deleteOne();
  return { success: true, message: 'Student deleted successfully' };
};
