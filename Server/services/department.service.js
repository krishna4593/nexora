const Department = require('../models/Department');

exports.createDepartment = async (departmentData, organizationId) => {
  const code = departmentData.code ? departmentData.code.trim().toUpperCase() : undefined;
  
  // Check for duplicate code within organization
  const existing = await Department.findOne({ organization: organizationId, code });
  if (existing) {
    const err = new Error('A department with this code already exists in your organization');
    err.code = 11000;
    throw err;
  }

  const department = await Department.create({
    ...departmentData,
    code,
    organization: organizationId
  });

  return department;
};

exports.getDepartments = async (organizationId, queryParams) => {
  const { page = 1, limit = 10, search, status } = queryParams;
  
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = Math.min(parseInt(limit, 10) || 10, 50);
  const skip = (pageNum - 1) * limitNum;
  
  const query = { organization: organizationId };
  
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { code: { $regex: search, $options: 'i' } }
    ];
  }
  
  if (status === 'active') {
    query.isActive = true;
  } else if (status === 'inactive') {
    query.isActive = false;
  }
  // If 'all' or undefined, don't filter by isActive

  const total = await Department.countDocuments(query);
  const departments = await Department.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);
    
  return {
    data: departments,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum)
    }
  };
};

exports.getDepartmentById = async (id, organizationId) => {
  const department = await Department.findOne({ _id: id, organization: organizationId });
  if (!department) {
    const err = new Error('Department not found');
    err.name = 'CastError'; // will be caught as 404 in handler
    throw err;
  }
  return department;
};

exports.updateDepartment = async (id, organizationId, updateData) => {
  // Disallow changing organization
  if (updateData.organization || updateData.organizationId) {
    delete updateData.organization;
    delete updateData.organizationId;
  }

  const code = updateData.code ? updateData.code.trim().toUpperCase() : undefined;
  
  if (code) {
    const existing = await Department.findOne({ 
      organization: organizationId, 
      code,
      _id: { $ne: id }
    });
    
    if (existing) {
      const err = new Error('A department with this code already exists in your organization');
      err.code = 11000;
      throw err;
    }
    updateData.code = code;
  }

  const department = await Department.findOneAndUpdate(
    { _id: id, organization: organizationId },
    updateData,
    { new: true, runValidators: true }
  );

  if (!department) {
    const err = new Error('Department not found');
    err.name = 'CastError';
    throw err;
  }

  return department;
};

exports.updateDepartmentStatus = async (id, organizationId, isActive) => {
  if (typeof isActive !== 'boolean') {
    throw new Error('isActive must be a boolean');
  }

  const department = await Department.findOneAndUpdate(
    { _id: id, organization: organizationId },
    { isActive },
    { new: true, runValidators: true }
  );

  if (!department) {
    const err = new Error('Department not found');
    err.name = 'CastError';
    throw err;
  }

  return department;
};

exports.deleteDepartment = async (id, organizationId) => {
  const department = await Department.findOne({ _id: id, organization: organizationId });
  
  if (!department) {
    const err = new Error('Department not found');
    err.name = 'CastError';
    throw err;
  }

  // Future check: see if courses/faculty depend on this department
  // e.g. const facultyCount = await Faculty.countDocuments({ department: id })
  // if (facultyCount > 0) throw error 'Cannot delete because it has associated faculty'

  await department.deleteOne();
  return { success: true, message: 'Department deleted successfully' };
};
