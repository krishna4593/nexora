const Faculty = require('../models/Faculty');
const Department = require('../models/Department');

const verifyDepartment = async (departmentId, organizationId) => {
  const department = await Department.findOne({ _id: departmentId, organization: organizationId });
  if (!department) {
    const err = new Error('Invalid department or department does not belong to your organization');
    err.name = 'ValidationError';
    throw err;
  }
  return department;
};

exports.createFaculty = async (facultyData, organizationId) => {
  // Normalize fields
  const employeeId = facultyData.employeeId ? facultyData.employeeId.trim().toUpperCase() : undefined;
  const email = facultyData.email ? facultyData.email.trim().toLowerCase() : undefined;

  // Check department validity
  if (facultyData.department) {
    await verifyDepartment(facultyData.department, organizationId);
  }

  // Check uniqueness inside organization
  if (employeeId) {
    const existingEmp = await Faculty.findOne({ organization: organizationId, employeeId });
    if (existingEmp) {
      const err = new Error('A faculty member with this Employee ID already exists in your organization');
      err.code = 11000;
      throw err;
    }
  }

  if (email) {
    const existingEmail = await Faculty.findOne({ organization: organizationId, email });
    if (existingEmail) {
      const err = new Error('A faculty member with this Email already exists in your organization');
      err.code = 11000;
      throw err;
    }
  }

  const faculty = await Faculty.create({
    ...facultyData,
    employeeId,
    email,
    organization: organizationId
  });

  return faculty.populate('department', 'name code');
};

exports.getFaculty = async (organizationId, queryParams) => {
  const { page = 1, limit = 10, search, department, designation, status } = queryParams;
  
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = Math.min(parseInt(limit, 10) || 10, 50);
  const skip = (pageNum - 1) * limitNum;
  
  const query = { organization: organizationId };
  
  if (search) {
    query.$or = [
      { employeeId: { $regex: search, $options: 'i' } },
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }
  
  if (department && department !== 'all') {
    query.department = department;
  }
  
  if (designation && designation !== 'all') {
    query.designation = designation;
  }

  if (status === 'active') {
    query.isActive = true;
  } else if (status === 'inactive') {
    query.isActive = false;
  }

  const total = await Faculty.countDocuments(query);
  const facultyMembers = await Faculty.find(query)
    .populate('department', 'name code')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);
    
  return {
    data: facultyMembers,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum)
    }
  };
};

exports.getFacultyById = async (id, organizationId) => {
  const faculty = await Faculty.findOne({ _id: id, organization: organizationId })
    .populate('department', 'name code');
    
  if (!faculty) {
    const err = new Error('Faculty member not found');
    err.name = 'CastError';
    throw err;
  }
  return faculty;
};

exports.updateFaculty = async (id, organizationId, updateData) => {
  // Disallow organization/employeeId changes
  if (updateData.organization || updateData.organizationId) {
    delete updateData.organization;
    delete updateData.organizationId;
  }
  if (updateData.employeeId) {
    delete updateData.employeeId;
  }

  // Check department if it's being updated
  if (updateData.department) {
    await verifyDepartment(updateData.department, organizationId);
  }

  const email = updateData.email ? updateData.email.trim().toLowerCase() : undefined;
  
  if (email) {
    const existingEmail = await Faculty.findOne({ 
      organization: organizationId, 
      email,
      _id: { $ne: id }
    });
    
    if (existingEmail) {
      const err = new Error('A faculty member with this Email already exists in your organization');
      err.code = 11000;
      throw err;
    }
    updateData.email = email;
  }

  const faculty = await Faculty.findOneAndUpdate(
    { _id: id, organization: organizationId },
    updateData,
    { new: true, runValidators: true }
  ).populate('department', 'name code');

  if (!faculty) {
    const err = new Error('Faculty member not found');
    err.name = 'CastError';
    throw err;
  }

  return faculty;
};

exports.updateFacultyStatus = async (id, organizationId, isActive) => {
  if (typeof isActive !== 'boolean') {
    throw new Error('isActive must be a boolean');
  }

  const faculty = await Faculty.findOneAndUpdate(
    { _id: id, organization: organizationId },
    { isActive },
    { new: true, runValidators: true }
  ).populate('department', 'name code');

  if (!faculty) {
    const err = new Error('Faculty member not found');
    err.name = 'CastError';
    throw err;
  }

  return faculty;
};

exports.deleteFaculty = async (id, organizationId) => {
  const faculty = await Faculty.findOne({ _id: id, organization: organizationId });
  
  if (!faculty) {
    const err = new Error('Faculty member not found');
    err.name = 'CastError';
    throw err;
  }

  // Future check: see if courses/timetable depend on this faculty
  // e.g. const courseCount = await Course.countDocuments({ assignedFaculty: id })

  await faculty.deleteOne();
  return { success: true, message: 'Faculty deleted successfully' };
};
