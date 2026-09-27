const studentService = require('../services/student.service');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all students for organization
// @route   GET /api/students
// @access  Private
exports.getStudents = asyncHandler(async (req, res) => {
  const organizationId = req.user.organization;
  
  if (!organizationId) {
    return res.status(403).json({ success: false, message: 'User does not belong to an organization' });
  }

  const result = await studentService.getStudents(organizationId, req.query);
  
  res.status(200).json({
    success: true,
    ...result
  });
});

// @desc    Get single student
// @route   GET /api/students/:id
// @access  Private
exports.getStudentById = asyncHandler(async (req, res) => {
  const organizationId = req.user.organization;
  
  if (!organizationId) {
    return res.status(403).json({ success: false, message: 'User does not belong to an organization' });
  }

  const student = await studentService.getStudentById(req.params.id, organizationId);
  
  res.status(200).json({
    success: true,
    data: student
  });
});

// @desc    Create new student
// @route   POST /api/students
// @access  Private
exports.createStudent = asyncHandler(async (req, res) => {
  const organizationId = req.user.organization;
  
  if (!organizationId) {
    return res.status(403).json({ success: false, message: 'User does not belong to an organization' });
  }

  const student = await studentService.createStudent(req.body, organizationId);
  
  res.status(201).json({
    success: true,
    data: student
  });
});

// @desc    Update student
// @route   PATCH /api/students/:id
// @access  Private
exports.updateStudent = asyncHandler(async (req, res) => {
  const organizationId = req.user.organization;
  
  if (!organizationId) {
    return res.status(403).json({ success: false, message: 'User does not belong to an organization' });
  }

  const student = await studentService.updateStudent(req.params.id, organizationId, req.body);
  
  res.status(200).json({
    success: true,
    data: student
  });
});

// @desc    Update student status
// @route   PATCH /api/students/:id/status
// @access  Private
exports.updateStudentStatus = asyncHandler(async (req, res) => {
  const organizationId = req.user.organization;
  
  if (!organizationId) {
    return res.status(403).json({ success: false, message: 'User does not belong to an organization' });
  }

  const student = await studentService.updateStudentStatus(
    req.params.id, 
    organizationId, 
    req.body.isActive
  );
  
  res.status(200).json({
    success: true,
    data: student
  });
});

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private
exports.deleteStudent = asyncHandler(async (req, res) => {
  const organizationId = req.user.organization;
  
  if (!organizationId) {
    return res.status(403).json({ success: false, message: 'User does not belong to an organization' });
  }

  await studentService.deleteStudent(req.params.id, organizationId);
  
  res.status(200).json({
    success: true,
    data: {}
  });
});
