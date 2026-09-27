const organizationService = require('../services/organization.service');

/**
 * @desc    Create a new organization
 * @route   POST /api/organizations
 * @access  Private (PLATFORM_ADMIN only)
 */
const createOrganization = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const organization = await organizationService.createOrganization(userId, req.body);

    res.status(201).json({
      success: true,
      message: 'Organization created successfully',
      data: organization
    });
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode);
    } else {
      res.status(400); // Default to bad request for mostly validation errors
    }
    next(error);
  }
};

/**
 * @desc    Get current admin's organization
 * @route   GET /api/organizations/me
 * @access  Private
 */
const getMyOrganization = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const organization = await organizationService.getOrganizationByAdmin(userId);

    if (!organization) {
      return res.status(200).json({
        success: true,
        data: {
          organization: null,
          onboardingRequired: true
        }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        organization,
        onboardingRequired: false
      }
    });
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode);
    }
    next(error);
  }
};

module.exports = {
  createOrganization,
  getMyOrganization
};
