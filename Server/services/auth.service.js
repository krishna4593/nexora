const User = require('../models/User');
const { generateAccessToken, generateRefreshToken } = require('../utils/token');

exports.registerUser = async (userData) => {
  const { name, email, password } = userData;
  
  const userExists = await User.findOne({ email });
  if (userExists) {
    const error = new Error('User already exists');
    error.statusCode = 400;
    throw error;
  }

  const user = await User.create({
    name,
    email,
    password,
    role: 'PLATFORM_ADMIN' // Force role to PLATFORM_ADMIN for now
  });

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    organization: user.organization
  };
};

exports.loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  if (!user.isActive) {
    const error = new Error('User account is inactive');
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      organization: user.organization
    },
    accessToken,
    refreshToken
  };
};

exports.refreshUserToken = async (refreshToken) => {
  if (!refreshToken) {
    const error = new Error('No refresh token provided');
    error.statusCode = 401;
    throw error;
  }

  const user = await User.findOne({ refreshToken });
  if (!user || !user.isActive) {
    const error = new Error('Invalid or expired refresh token');
    error.statusCode = 401;
    throw error;
  }

  const accessToken = generateAccessToken(user._id);
  return {
    accessToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      organization: user.organization
    }
  };
};

exports.logoutUser = async (userId, refreshToken) => {
  if (userId) {
    const user = await User.findById(userId);
    if (user) {
      user.refreshToken = undefined;
      await user.save({ validateBeforeSave: false });
    }
  } else if (refreshToken) {
    const user = await User.findOne({ refreshToken });
    if (user) {
      user.refreshToken = undefined;
      await user.save({ validateBeforeSave: false });
    }
  }
};
