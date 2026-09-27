const courseService = require('../services/course.service');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all courses for organization
// @route   GET /api/courses
// @access  Private
exports.getCourses = asyncHandler(async (req, res) => {
  const organizationId = req.user.organization;
  
  if (!organizationId) {
    return res.status(403).json({ success: false, message: 'User does not belong to an organization' });
  }

  const result = await courseService.getCourses(organizationId, req.query);
  
  res.status(200).json({
    success: true,
    ...result
  });
});

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Private
exports.getCourseById = asyncHandler(async (req, res) => {
  const organizationId = req.user.organization;
  
  if (!organizationId) {
    return res.status(403).json({ success: false, message: 'User does not belong to an organization' });
  }

  const course = await courseService.getCourseById(req.params.id, organizationId);
  
  res.status(200).json({
    success: true,
    data: course
  });
});

// @desc    Create new course
// @route   POST /api/courses
// @access  Private
exports.createCourse = asyncHandler(async (req, res) => {
  const organizationId = req.user.organization;
  
  if (!organizationId) {
    return res.status(403).json({ success: false, message: 'User does not belong to an organization' });
  }

  const course = await courseService.createCourse(req.body, organizationId);
  
  res.status(201).json({
    success: true,
    data: course
  });
});

// @desc    Update course
// @route   PATCH /api/courses/:id
// @access  Private
exports.updateCourse = asyncHandler(async (req, res) => {
  const organizationId = req.user.organization;
  
  if (!organizationId) {
    return res.status(403).json({ success: false, message: 'User does not belong to an organization' });
  }

  const course = await courseService.updateCourse(req.params.id, organizationId, req.body);
  
  res.status(200).json({
    success: true,
    data: course
  });
});

// @desc    Update course status
// @route   PATCH /api/courses/:id/status
// @access  Private
exports.updateCourseStatus = asyncHandler(async (req, res) => {
  const organizationId = req.user.organization;
  
  if (!organizationId) {
    return res.status(403).json({ success: false, message: 'User does not belong to an organization' });
  }

  const course = await courseService.updateCourseStatus(
    req.params.id, 
    organizationId, 
    req.body.isActive
  );
  
  res.status(200).json({
    success: true,
    data: course
  });
});

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private
exports.deleteCourse = asyncHandler(async (req, res) => {
  const organizationId = req.user.organization;
  
  if (!organizationId) {
    return res.status(403).json({ success: false, message: 'User does not belong to an organization' });
  }

  await courseService.deleteCourse(req.params.id, organizationId);
  
  res.status(200).json({
    success: true,
    data: {}
  });
});
