const Organization = require('../models/Organization');
const User = require('../models/User');
const crypto = require('crypto');

/**
 * Generates a unique referral code.
 * @param {string} type 
 * @returns {string} 
 */
const generateReferralCode = async (type) => {
  let isUnique = false;
  let code = '';
  
  while (!isUnique) {
    const randomString = crypto.randomBytes(3).toString('hex').toUpperCase(); // 6 chars
    code = `${type}-${randomString}`;
    const existingOrg = await Organization.findOne({ referralCode: code });
    if (!existingOrg) {
      isUnique = true;
    }
  }
  
  return code;
};

const createOrganization = async (userId, data) => {
  const { name, type, enabledFeatures = [] } = data;

  // 1. Check if user exists and already has an organization
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  if (user.role !== 'PLATFORM_ADMIN') {
    const error = new Error('Only PLATFORM_ADMIN can create an organization');
    error.statusCode = 403;
    throw error;
  }

  if (user.organization) {
    const error = new Error('Admin already has an associated organization');
    error.statusCode = 400;
    throw error;
  }

  // 2. Validate name (simple validation, Mongoose handles the rest)
  if (!name || name.trim() === '') {
    const error = new Error('Organization name is required');
    error.statusCode = 400;
    throw error;
  }

  // 3. Validate type
  if (type !== 'COLLEGE') {
    const error = new Error('Invalid organization type. Only COLLEGE is supported currently.');
    error.statusCode = 400;
    throw error;
  }

  // 4. Validate features and ensure ERP is enabled
  // DECISION: Automatically adding ERP. It's the core module, and ensuring it's always present is cleaner
  // than rejecting the request if the client forgets to include it.
  const features = new Set(enabledFeatures);
  features.add('ERP');
  
  const validFeatures = ['ERP', 'RAG', 'QUEUE', 'CAMERA', 'SCHEDULING', 'ANALYTICS'];
  for (const feature of features) {
    if (!validFeatures.includes(feature)) {
      const error = new Error(`Invalid feature identifier: ${feature}`);
      error.statusCode = 400;
      throw error;
    }
  }

  // 5. Generate Referral Code
  const referralCode = await generateReferralCode(type);

  // 6. Create Organization
  const organization = await Organization.create({
    name: name.trim(),
    type,
    admin: userId,
    enabledFeatures: Array.from(features),
    referralCode
  });

  // 7. Update user
  user.organization = organization._id;
  await user.save();

  return organization;
};

const getOrganizationByAdmin = async (userId) => {
  const user = await User.findById(userId).populate('organization');
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  return user.organization;
};

module.exports = {
  createOrganization,
  getOrganizationByAdmin
};
