const Course = require('../models/Course');
const Department = require('../models/Department');
const Faculty = require('../models/Faculty');

const verifyDepartment = async (departmentId, organizationId) => {
  const department = await Department.findOne({ _id: departmentId, organization: organizationId });
  if (!department) {
    const err = new Error('Invalid department or department does not belong to your organization');
    err.name = 'ValidationError';
    throw err;
  }
  return department;
};

const verifyFaculty = async (facultyId, departmentId, organizationId) => {
  const faculty = await Faculty.findOne({ _id: facultyId, organization: organizationId });
  if (!faculty) {
    const err = new Error('Invalid faculty member or faculty does not belong to your organization');
    err.name = 'ValidationError';
    throw err;
  }
  
  // Faculty department must match the course's department
  if (faculty.department.toString() !== departmentId.toString()) {
    const err = new Error('Assigned faculty must belong to the selected department');
    err.name = 'ValidationError';
    throw err;
  }
  
  return faculty;
};

exports.createCourse = async (courseData, organizationId) => {
  const courseCode = courseData.courseCode ? courseData.courseCode.trim().toUpperCase() : undefined;

  // 1. Verify Department
  if (!courseData.department) {
    throw new Error('Department is required');
  }
  await verifyDepartment(courseData.department, organizationId);

  // 2. Verify Faculty if assigned
  if (courseData.assignedFaculty) {
    await verifyFaculty(courseData.assignedFaculty, courseData.department, organizationId);
  }

  // 3. Check duplicate courseCode in organization
  if (courseCode) {
    const existingCourse = await Course.findOne({ organization: organizationId, courseCode });
    if (existingCourse) {
      const err = new Error('A course with this Course Code already exists in your organization');
      err.code = 11000;
      throw err;
    }
  }

  const course = await Course.create({
    ...courseData,
    courseCode,
    organization: organizationId
  });

  return course.populate([
    { path: 'department', select: 'name code' },
    { path: 'assignedFaculty', select: 'firstName lastName employeeId' }
  ]);
};

exports.getCourses = async (organizationId, queryParams) => {
  const { 
    page = 1, 
    limit = 10, 
    search, 
    department, 
    semester, 
    courseType, 
    academicYear, 
    faculty, 
    status 
  } = queryParams;
  
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = Math.min(parseInt(limit, 10) || 10, 50);
  const skip = (pageNum - 1) * limitNum;
  
  const query = { organization: organizationId };
  
  if (search) {
    query.$or = [
      { courseCode: { $regex: search, $options: 'i' } },
      { name: { $regex: search, $options: 'i' } }
    ];
  }
  
  if (department && department !== 'all') query.department = department;
  if (semester && semester !== 'all') query.semester = Number(semester);
  if (courseType && courseType !== 'all') query.courseType = courseType;
  if (academicYear && academicYear !== 'all') query.academicYear = academicYear;
  if (faculty && faculty !== 'all') {
    if (faculty === 'unassigned') {
      query.assignedFaculty = { $exists: false };
    } else {
      query.assignedFaculty = faculty;
    }
  }

  if (status === 'active') {
    query.isActive = true;
  } else if (status === 'inactive') {
    query.isActive = false;
  }

  const total = await Course.countDocuments(query);
  const courses = await Course.find(query)
    .populate('department', 'name code')
    .populate('assignedFaculty', 'firstName lastName employeeId')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);
    
  return {
    data: courses,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum)
    }
  };
};

exports.getCourseById = async (id, organizationId) => {
  const course = await Course.findOne({ _id: id, organization: organizationId })
    .populate('department', 'name code')
    .populate('assignedFaculty', 'firstName lastName employeeId email phone designation');
    
  if (!course) {
    const err = new Error('Course not found');
    err.name = 'CastError';
    throw err;
  }
  return course;
};

exports.updateCourse = async (id, organizationId, updateData) => {
  // Disallow organization/courseCode changes
  if (updateData.organization || updateData.organizationId) {
    delete updateData.organization;
    delete updateData.organizationId;
  }
  if (updateData.courseCode) {
    delete updateData.courseCode;
  }

  const courseToUpdate = await Course.findOne({ _id: id, organization: organizationId });
  if (!courseToUpdate) {
    const err = new Error('Course not found');
    err.name = 'CastError';
    throw err;
  }

  const targetDepartmentId = updateData.department || courseToUpdate.department;
  const targetFacultyId = updateData.assignedFaculty !== undefined ? updateData.assignedFaculty : courseToUpdate.assignedFaculty;

  // Re-verify department if changing
  if (updateData.department) {
    await verifyDepartment(updateData.department, organizationId);
  }

  // Re-verify faculty if changing or department is changing
  if (targetFacultyId && targetFacultyId !== "") {
    await verifyFaculty(targetFacultyId, targetDepartmentId, organizationId);
  }

  const course = await Course.findOneAndUpdate(
    { _id: id, organization: organizationId },
    updateData,
    { new: true, runValidators: true }
  )
    .populate('department', 'name code')
    .populate('assignedFaculty', 'firstName lastName employeeId');

  return course;
};

exports.updateCourseStatus = async (id, organizationId, isActive) => {
  if (typeof isActive !== 'boolean') {
    throw new Error('isActive must be a boolean');
  }

  const course = await Course.findOneAndUpdate(
    { _id: id, organization: organizationId },
    { isActive },
    { new: true, runValidators: true }
  )
    .populate('department', 'name code')
    .populate('assignedFaculty', 'firstName lastName employeeId');

  if (!course) {
    const err = new Error('Course not found');
    err.name = 'CastError';
    throw err;
  }

  return course;
};

exports.deleteCourse = async (id, organizationId) => {
  const course = await Course.findOne({ _id: id, organization: organizationId });
  
  if (!course) {
    const err = new Error('Course not found');
    err.name = 'CastError';
    throw err;
  }

  // Future check: see if students are enrolled in this course
  // e.g. const enrollmentCount = await Enrollment.countDocuments({ course: id })

  await course.deleteOne();
  return { success: true, message: 'Course deleted successfully' };
};
