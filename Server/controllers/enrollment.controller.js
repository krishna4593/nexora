const enrollmentService = require('../services/enrollment.service');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all enrollments for organization
// @route   GET /api/enrollments
// @access  Private
exports.getEnrollments = asyncHandler(async (req, res) => {
  const organizationId = req.user.organization;
  
  if (!organizationId) {
    return res.status(403).json({ success: false, message: 'User does not belong to an organization' });
  }

  const result = await enrollmentService.getEnrollments(organizationId, req.query);
  
  res.status(200).json({
    success: true,
    ...result
  });
});

// @desc    Get single enrollment
// @route   GET /api/enrollments/:id
// @access  Private
exports.getEnrollmentById = asyncHandler(async (req, res) => {
  const organizationId = req.user.organization;
  
  if (!organizationId) {
    return res.status(403).json({ success: false, message: 'User does not belong to an organization' });
  }

  const enrollment = await enrollmentService.getEnrollmentById(req.params.id, organizationId);
  
  res.status(200).json({
    success: true,
    data: enrollment
  });
});

// @desc    Create new enrollment
// @route   POST /api/enrollments
// @access  Private
exports.createEnrollment = asyncHandler(async (req, res) => {
  const organizationId = req.user.organization;
  
  if (!organizationId) {
    return res.status(403).json({ success: false, message: 'User does not belong to an organization' });
  }

  const enrollment = await enrollmentService.createEnrollment(req.body, organizationId);
  
  res.status(201).json({
    success: true,
    data: enrollment
  });
});

// @desc    Update enrollment status
// @route   PATCH /api/enrollments/:id/status
// @access  Private
exports.updateEnrollmentStatus = asyncHandler(async (req, res) => {
  const organizationId = req.user.organization;
  
  if (!organizationId) {
    return res.status(403).json({ success: false, message: 'User does not belong to an organization' });
  }

  const enrollment = await enrollmentService.updateEnrollmentStatus(
    req.params.id, 
    organizationId, 
    req.body.status
  );
  
  res.status(200).json({
    success: true,
    data: enrollment
  });
});

// @desc    Delete enrollment
// @route   DELETE /api/enrollments/:id
// @access  Private
exports.deleteEnrollment = asyncHandler(async (req, res) => {
  const organizationId = req.user.organization;
  
  if (!organizationId) {
    return res.status(403).json({ success: false, message: 'User does not belong to an organization' });
  }

  await enrollmentService.deleteEnrollment(req.params.id, organizationId);
  
  res.status(200).json({
    success: true,
    data: {}
  });
});
