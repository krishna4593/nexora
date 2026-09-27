const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Organization name is required'],
    trim: true,
    minlength: [2, 'Organization name must be at least 2 characters'],
    maxlength: [100, 'Organization name cannot exceed 100 characters']
  },
  type: {
    type: String,
    enum: {
      values: ['COLLEGE'],
      message: '{VALUE} is not a supported organization type'
    },
    required: [true, 'Organization type is required']
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Organization must have an admin']
  },
  enabledFeatures: [{
    type: String,
    enum: {
      values: ['ERP', 'RAG', 'QUEUE', 'CAMERA', 'SCHEDULING', 'ANALYTICS'],
      message: '{VALUE} is not a valid feature identifier'
    }
  }],
  referralCode: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Organization', organizationSchema);
