const facultyService = require('../services/faculty.service');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all faculty for organization
// @route   GET /api/faculty
// @access  Private
exports.getFaculty = asyncHandler(async (req, res) => {
  const organizationId = req.user.organization;
  
  if (!organizationId) {
    return res.status(403).json({ success: false, message: 'User does not belong to an organization' });
  }

  const result = await facultyService.getFaculty(organizationId, req.query);
  
  res.status(200).json({
    success: true,
    ...result
  });
});

// @desc    Get single faculty member
// @route   GET /api/faculty/:id
// @access  Private
exports.getFacultyById = asyncHandler(async (req, res) => {
  const organizationId = req.user.organization;
  
  if (!organizationId) {
    return res.status(403).json({ success: false, message: 'User does not belong to an organization' });
  }

  const faculty = await facultyService.getFacultyById(req.params.id, organizationId);
  
  res.status(200).json({
    success: true,
    data: faculty
  });
});

// @desc    Create new faculty
// @route   POST /api/faculty
// @access  Private
exports.createFaculty = asyncHandler(async (req, res) => {
  const organizationId = req.user.organization;
  
  if (!organizationId) {
    return res.status(403).json({ success: false, message: 'User does not belong to an organization' });
  }

  const faculty = await facultyService.createFaculty(req.body, organizationId);
  
  res.status(201).json({
    success: true,
    data: faculty
  });
});

// @desc    Update faculty
// @route   PATCH /api/faculty/:id
// @access  Private
exports.updateFaculty = asyncHandler(async (req, res) => {
  const organizationId = req.user.organization;
  
  if (!organizationId) {
    return res.status(403).json({ success: false, message: 'User does not belong to an organization' });
  }

  const faculty = await facultyService.updateFaculty(req.params.id, organizationId, req.body);
  
  res.status(200).json({
    success: true,
    data: faculty
  });
});

// @desc    Update faculty status
// @route   PATCH /api/faculty/:id/status
// @access  Private
exports.updateFacultyStatus = asyncHandler(async (req, res) => {
  const organizationId = req.user.organization;
  
  if (!organizationId) {
    return res.status(403).json({ success: false, message: 'User does not belong to an organization' });
  }

  const faculty = await facultyService.updateFacultyStatus(
    req.params.id, 
    organizationId, 
    req.body.isActive
  );
  
  res.status(200).json({
    success: true,
    data: faculty
  });
});

// @desc    Delete faculty
// @route   DELETE /api/faculty/:id
// @access  Private
exports.deleteFaculty = asyncHandler(async (req, res) => {
  const organizationId = req.user.organization;
  
  if (!organizationId) {
    return res.status(403).json({ success: false, message: 'User does not belong to an organization' });
  }

  await facultyService.deleteFaculty(req.params.id, organizationId);
  
  res.status(200).json({
    success: true,
    data: {}
  });
});
