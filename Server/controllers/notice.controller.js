const noticeService = require('../services/notice.service');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all notices
// @route   GET /api/notices
// @access  Private
exports.getNotices = asyncHandler(async (req, res) => {
  const organizationId = req.user.organization;
  if (!organizationId) {
    return res.status(403).json({ success: false, message: 'User does not belong to an organization' });
  }

  const result = await noticeService.getNotices(organizationId, req.query);
  
  res.status(200).json({
    success: true,
    ...result
  });
});

// @desc    Get single notice
// @route   GET /api/notices/:id
// @access  Private
exports.getNoticeById = asyncHandler(async (req, res) => {
  const organizationId = req.user.organization;
  if (!organizationId) {
    return res.status(403).json({ success: false, message: 'User does not belong to an organization' });
  }

  const notice = await noticeService.getNoticeById(req.params.id, organizationId);
  
  res.status(200).json({
    success: true,
    data: notice
  });
});

// @desc    Create new notice
// @route   POST /api/notices
// @access  Private
exports.createNotice = asyncHandler(async (req, res) => {
  const organizationId = req.user.organization;
  const adminId = req.user.id;
  
  if (!organizationId) {
    return res.status(403).json({ success: false, message: 'User does not belong to an organization' });
  }

  const notice = await noticeService.createNotice(req.body, organizationId, adminId);
  
  res.status(201).json({
    success: true,
    data: notice
  });
});

// @desc    Update notice
// @route   PATCH /api/notices/:id
// @access  Private
exports.updateNotice = asyncHandler(async (req, res) => {
  const organizationId = req.user.organization;
  
  if (!organizationId) {
    return res.status(403).json({ success: false, message: 'User does not belong to an organization' });
  }

  const notice = await noticeService.updateNotice(req.params.id, req.body, organizationId);
  
  res.status(200).json({
    success: true,
    data: notice
  });
});

// @desc    Publish notice
// @route   PATCH /api/notices/:id/publish
// @access  Private
exports.publishNotice = asyncHandler(async (req, res) => {
  const organizationId = req.user.organization;
  
  if (!organizationId) {
    return res.status(403).json({ success: false, message: 'User does not belong to an organization' });
  }

  const notice = await noticeService.publishNotice(req.params.id, organizationId);
  
  res.status(200).json({
    success: true,
    data: notice
  });
});

// @desc    Unpublish notice
// @route   PATCH /api/notices/:id/unpublish
// @access  Private
exports.unpublishNotice = asyncHandler(async (req, res) => {
  const organizationId = req.user.organization;
  
  if (!organizationId) {
    return res.status(403).json({ success: false, message: 'User does not belong to an organization' });
  }

  const notice = await noticeService.unpublishNotice(req.params.id, organizationId);
  
  res.status(200).json({
    success: true,
    data: notice
  });
});

// @desc    Toggle notice active status
// @route   PATCH /api/notices/:id/status
// @access  Private
exports.toggleNoticeStatus = asyncHandler(async (req, res) => {
  const organizationId = req.user.organization;
  
  if (!organizationId) {
    return res.status(403).json({ success: false, message: 'User does not belong to an organization' });
  }

  const notice = await noticeService.toggleNoticeStatus(req.params.id, organizationId);
  
  res.status(200).json({
    success: true,
    data: notice
  });
});

// @desc    Delete notice
// @route   DELETE /api/notices/:id
// @access  Private
exports.deleteNotice = asyncHandler(async (req, res) => {
  const organizationId = req.user.organization;
  
  if (!organizationId) {
    return res.status(403).json({ success: false, message: 'User does not belong to an organization' });
  }

  await noticeService.deleteNotice(req.params.id, organizationId);
  
  res.status(200).json({
    success: true,
    data: {}
  });
});
