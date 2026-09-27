const Notice = require('../models/Notice');
const Department = require('../models/Department');

exports.createNotice = async (noticeData, organizationId, authorId) => {
  const { title, content, category, priority, audience, department, publishAt, expiresAt, isPublished } = noticeData;

  // If audience is DEPARTMENT, verify the department exists and belongs to the same org
  if (audience === 'DEPARTMENT') {
    if (!department) {
      throw new Error('Department is required when audience is set to DEPARTMENT');
    }
    const deptExists = await Department.findOne({ _id: department, organization: organizationId });
    if (!deptExists) {
      throw new Error('Invalid department selected or department does not belong to your organization');
    }
  }

  const notice = await Notice.create({
    title,
    content,
    category,
    priority: priority || 'NORMAL',
    audience,
    department: audience === 'DEPARTMENT' ? department : undefined,
    author: authorId,
    organization: organizationId,
    publishAt: publishAt ? new Date(publishAt) : new Date(),
    expiresAt: expiresAt ? new Date(expiresAt) : undefined,
    isPublished: isPublished || false,
    isActive: true
  });

  return notice.populate([
    { path: 'author', select: 'firstName lastName email' },
    { path: 'department', select: 'name code' }
  ]);
};

exports.getNotices = async (organizationId, queryParams) => {
  const {
    page = 1,
    limit = 10,
    search,
    category,
    priority,
    audience,
    department,
    publicationStatus,
    activeStatus,
    date
  } = queryParams;

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = Math.min(parseInt(limit, 10) || 10, 50);
  const skip = (pageNum - 1) * limitNum;

  const query = { organization: organizationId };

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } }
    ];
  }

  if (category && category !== 'all') query.category = category;
  if (priority && priority !== 'all') query.priority = priority;
  if (audience && audience !== 'all') query.audience = audience;
  if (department && department !== 'all') query.department = department;

  if (activeStatus === 'active') query.isActive = true;
  if (activeStatus === 'inactive') query.isActive = false;

  const now = new Date();

  // publicationStatus: 'all', 'published', 'draft', 'expired'
  if (publicationStatus === 'published') {
    query.isPublished = true;
    query.$or = [
      { expiresAt: { $exists: false } },
      { expiresAt: null },
      { expiresAt: { $gt: now } }
    ];
  } else if (publicationStatus === 'draft') {
    query.isPublished = false;
  } else if (publicationStatus === 'expired') {
    query.isPublished = true;
    query.expiresAt = { $lte: now };
  }

  if (date) {
    const d = new Date(date);
    query.publishAt = {
      $gte: new Date(d.setUTCHours(0, 0, 0, 0)),
      $lte: new Date(d.setUTCHours(23, 59, 59, 999))
    };
  }

  const notices = await Notice.find(query)
    .populate('author', 'firstName lastName')
    .populate('department', 'name code')
    .sort({ publishAt: -1, createdAt: -1 })
    .skip(skip)
    .limit(limitNum)
    .lean();

  const total = await Notice.countDocuments(query);

  // Compute computedStatus for frontend convenience
  const data = notices.map(notice => {
    let computedStatus = 'DRAFT';
    if (notice.isPublished) {
      if (notice.expiresAt && new Date(notice.expiresAt) <= now) {
        computedStatus = 'EXPIRED';
      } else {
        computedStatus = 'PUBLISHED';
      }
    }
    if (!notice.isActive) computedStatus = 'INACTIVE';
    return { ...notice, computedStatus };
  });

  return {
    data,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum)
    }
  };
};

exports.getNoticeById = async (id, organizationId) => {
  const notice = await Notice.findOne({ _id: id, organization: organizationId })
    .populate('author', 'firstName lastName email')
    .populate('department', 'name code')
    .lean();

  if (!notice) {
    const err = new Error('Notice not found');
    err.name = 'CastError'; // For standard 404 response
    throw err;
  }

  let computedStatus = 'DRAFT';
  if (notice.isPublished) {
    if (notice.expiresAt && new Date(notice.expiresAt) <= new Date()) {
      computedStatus = 'EXPIRED';
    } else {
      computedStatus = 'PUBLISHED';
    }
  }
  if (!notice.isActive) computedStatus = 'INACTIVE';
  
  notice.computedStatus = computedStatus;

  return notice;
};

exports.updateNotice = async (id, updateData, organizationId) => {
  const notice = await Notice.findOne({ _id: id, organization: organizationId });
  if (!notice) {
    const err = new Error('Notice not found');
    err.name = 'CastError';
    throw err;
  }

  // Prevent changing sensitive server-controlled fields
  const safeUpdates = ['title', 'content', 'category', 'priority', 'audience', 'department', 'publishAt', 'expiresAt'];
  
  for (const field of safeUpdates) {
    if (updateData[field] !== undefined) {
      notice[field] = updateData[field];
    }
  }

  if (notice.audience === 'DEPARTMENT') {
    if (!notice.department) {
      throw new Error('Department is required when audience is set to DEPARTMENT');
    }
    const deptExists = await Department.findOne({ _id: notice.department, organization: organizationId });
    if (!deptExists) {
      throw new Error('Invalid department selected or department does not belong to your organization');
    }
  } else {
    notice.department = undefined;
  }

  if (notice.expiresAt && notice.publishAt && new Date(notice.expiresAt) <= new Date(notice.publishAt)) {
    throw new Error('Expiry date must be after publish date');
  }

  await notice.save();
  return notice.populate([
    { path: 'author', select: 'firstName lastName email' },
    { path: 'department', select: 'name code' }
  ]);
};

exports.publishNotice = async (id, organizationId) => {
  const notice = await Notice.findOneAndUpdate(
    { _id: id, organization: organizationId },
    { isPublished: true, publishAt: new Date() },
    { new: true, runValidators: true }
  ).populate('author department');

  if (!notice) {
    const err = new Error('Notice not found');
    err.name = 'CastError';
    throw err;
  }
  return notice;
};

exports.unpublishNotice = async (id, organizationId) => {
  const notice = await Notice.findOneAndUpdate(
    { _id: id, organization: organizationId },
    { isPublished: false },
    { new: true, runValidators: true }
  ).populate('author department');

  if (!notice) {
    const err = new Error('Notice not found');
    err.name = 'CastError';
    throw err;
  }
  return notice;
};

exports.toggleNoticeStatus = async (id, organizationId) => {
  const notice = await Notice.findOne({ _id: id, organization: organizationId });
  if (!notice) {
    const err = new Error('Notice not found');
    err.name = 'CastError';
    throw err;
  }

  notice.isActive = !notice.isActive;
  await notice.save();
  return notice;
};

exports.deleteNotice = async (id, organizationId) => {
  const notice = await Notice.findOneAndDelete({ _id: id, organization: organizationId });
  if (!notice) {
    const err = new Error('Notice not found');
    err.name = 'CastError';
    throw err;
  }
  return notice;
};
