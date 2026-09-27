const attendanceService = require('../services/attendance.service');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all attendance sessions
// @route   GET /api/attendance/sessions
// @access  Private
exports.getSessions = asyncHandler(async (req, res) => {
  const organizationId = req.user.organization;
  
  if (!organizationId) {
    return res.status(403).json({ success: false, message: 'User does not belong to an organization' });
  }

  const result = await attendanceService.getSessions(organizationId, req.query);
  
  res.status(200).json({
    success: true,
    ...result
  });
});

// @desc    Get single attendance session with summary
// @route   GET /api/attendance/sessions/:id
// @access  Private
exports.getSessionById = asyncHandler(async (req, res) => {
  const organizationId = req.user.organization;
  
  if (!organizationId) {
    return res.status(403).json({ success: false, message: 'User does not belong to an organization' });
  }

  const session = await attendanceService.getSessionById(req.params.id, organizationId);
  
  res.status(200).json({
    success: true,
    data: session
  });
});

// @desc    Create new attendance session
// @route   POST /api/attendance/sessions
// @access  Private
exports.createSession = asyncHandler(async (req, res) => {
  const organizationId = req.user.organization;
  const adminId = req.user.id;
  
  if (!organizationId) {
    return res.status(403).json({ success: false, message: 'User does not belong to an organization' });
  }

  const session = await attendanceService.createSession(req.body, organizationId, adminId);
  
  res.status(201).json({
    success: true,
    data: session
  });
});

// @desc    Get session records (or eligible students if not marked yet)
// @route   GET /api/attendance/sessions/:id/records
// @access  Private
exports.getSessionRecords = asyncHandler(async (req, res) => {
  const organizationId = req.user.organization;
  
  if (!organizationId) {
    return res.status(403).json({ success: false, message: 'User does not belong to an organization' });
  }

  const records = await attendanceService.getSessionRecords(req.params.id, organizationId);
  
  res.status(200).json({
    success: true,
    data: records
  });
});

// @desc    Bulk mark attendance
// @route   POST /api/attendance/sessions/:id/records/bulk
// @access  Private
exports.bulkMarkAttendance = asyncHandler(async (req, res) => {
  const organizationId = req.user.organization;
  const adminId = req.user.id;
  
  if (!organizationId) {
    return res.status(403).json({ success: false, message: 'User does not belong to an organization' });
  }

  if (!req.body.records || !Array.isArray(req.body.records)) {
    return res.status(400).json({ success: false, message: 'Records array is required' });
  }

  const records = await attendanceService.bulkMarkAttendance(req.params.id, req.body.records, organizationId, adminId);
  
  res.status(200).json({
    success: true,
    data: records
  });
});

// @desc    Update session status (e.g. mark as COMPLETED)
// @route   PATCH /api/attendance/sessions/:id/status
// @access  Private
exports.updateSessionStatus = asyncHandler(async (req, res) => {
  const organizationId = req.user.organization;
  
  if (!organizationId) {
    return res.status(403).json({ success: false, message: 'User does not belong to an organization' });
  }

  if (!req.body.status) {
    return res.status(400).json({ success: false, message: 'Status is required' });
  }

  const session = await attendanceService.updateSessionStatus(req.params.id, req.body.status, organizationId);
  
  res.status(200).json({
    success: true,
    data: session
  });
});

// @desc    Get student attendance report
// @route   GET /api/attendance/reports/student/:studentId
// @access  Private
exports.getStudentReport = asyncHandler(async (req, res) => {
  const organizationId = req.user.organization;
  if (!organizationId) {
    return res.status(403).json({ success: false, message: 'User does not belong to an organization' });
  }

  const report = await attendanceService.getStudentReport(req.params.studentId, organizationId, req.query);
  
  res.status(200).json({
    success: true,
    data: report
  });
});

// @desc    Get course attendance report
// @route   GET /api/attendance/reports/course/:courseId
// @access  Private
exports.getCourseReport = asyncHandler(async (req, res) => {
  const organizationId = req.user.organization;
  if (!organizationId) {
    return res.status(403).json({ success: false, message: 'User does not belong to an organization' });
  }

  const report = await attendanceService.getCourseReport(req.params.courseId, organizationId, req.query);
  
  res.status(200).json({
    success: true,
    data: report
  });
});
