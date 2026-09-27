const asyncHandler = require('../utils/asyncHandler');
const authService = require('../services/auth.service');
const { setAuthCookies, clearAuthCookies } = require('../utils/token');

// @desc    Register a new admin
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide name, email, and password');
  }

  try {
    const user = await authService.registerUser({ name, email, password });
    res.status(201).json({
      success: true,
      message: 'Admin registered successfully',
      data: { user }
    });
  } catch (error) {
    res.status(error.statusCode || 500);
    throw error;
  }
});

// @desc    Login user & get tokens
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  try {
    const { user, accessToken, refreshToken } = await authService.loginUser(email, password);
    
    setAuthCookies(res, accessToken, refreshToken);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      data: { user }
    });
  } catch (error) {
    res.status(error.statusCode || 500);
    throw error;
  }
});

// @desc    Refresh token
// @route   POST /api/auth/refresh
// @access  Public
exports.refresh = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  
  const jwt = require('jsonwebtoken');
  try {
    // Validate JWT first
    if (!refreshToken) {
      res.status(401);
      throw new Error('No refresh token provided');
    }
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    const { accessToken } = await authService.refreshUserToken(refreshToken);
    
    // We only update the access token cookie here
    setAuthCookies(res, accessToken, undefined);

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: {}
    });
  } catch (error) {
    clearAuthCookies(res);
    res.status(401).json({
      success: false,
      message: 'Invalid or expired refresh token'
    });
  }
});

// @desc    Logout user / clear cookies
// @route   POST /api/auth/logout
// @access  Public / Private (we accept it either way)
exports.logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  const userId = req.user ? req.user._id : null;
  
  await authService.logoutUser(userId, refreshToken);
  
  clearAuthCookies(res);

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
    data: {}
  });
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      organization: req.user.organization
    }
  });
});
