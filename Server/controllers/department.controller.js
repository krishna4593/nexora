const departmentService = require('../services/department.service');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all departments for organization
// @route   GET /api/departments
// @access  Private (Org Admin / Platform Admin)
exports.getDepartments = asyncHandler(async (req, res) => {
  const organizationId = req.user.organization;
  
  if (!organizationId) {
    return res.status(403).json({ success: false, message: 'User does not belong to an organization' });
  }

  const result = await departmentService.getDepartments(organizationId, req.query);
  
  res.status(200).json({
    success: true,
    ...result
  });
});

// @desc    Get single department
// @route   GET /api/departments/:id
// @access  Private
exports.getDepartment = asyncHandler(async (req, res) => {
  const organizationId = req.user.organization;
  
  if (!organizationId) {
    return res.status(403).json({ success: false, message: 'User does not belong to an organization' });
  }

  const department = await departmentService.getDepartmentById(req.params.id, organizationId);
  
  res.status(200).json({
    success: true,
    data: department
  });
});

// @desc    Create new department
// @route   POST /api/departments
// @access  Private
exports.createDepartment = asyncHandler(async (req, res) => {
  const organizationId = req.user.organization;
  
  if (!organizationId) {
    return res.status(403).json({ success: false, message: 'User does not belong to an organization' });
  }

  const department = await departmentService.createDepartment(req.body, organizationId);
  
  res.status(201).json({
    success: true,
    data: department
  });
});

// @desc    Update department
// @route   PATCH /api/departments/:id
// @access  Private
exports.updateDepartment = asyncHandler(async (req, res) => {
  const organizationId = req.user.organization;
  
  if (!organizationId) {
    return res.status(403).json({ success: false, message: 'User does not belong to an organization' });
  }

  const department = await departmentService.updateDepartment(req.params.id, organizationId, req.body);
  
  res.status(200).json({
    success: true,
    data: department
  });
});

// @desc    Update department status
// @route   PATCH /api/departments/:id/status
// @access  Private
exports.updateDepartmentStatus = asyncHandler(async (req, res) => {
  const organizationId = req.user.organization;
  
  if (!organizationId) {
    return res.status(403).json({ success: false, message: 'User does not belong to an organization' });
  }

  const department = await departmentService.updateDepartmentStatus(
    req.params.id, 
    organizationId, 
    req.body.isActive
  );
  
  res.status(200).json({
    success: true,
    data: department
  });
});

// @desc    Delete department
// @route   DELETE /api/departments/:id
// @access  Private
exports.deleteDepartment = asyncHandler(async (req, res) => {
  const organizationId = req.user.organization;
  
  if (!organizationId) {
    return res.status(403).json({ success: false, message: 'User does not belong to an organization' });
  }

  await departmentService.deleteDepartment(req.params.id, organizationId);
  
  res.status(200).json({
    success: true,
    data: {}
  });
});
