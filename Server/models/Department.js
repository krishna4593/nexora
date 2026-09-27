const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Department name is required'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  code: {
    type: String,
    required: [true, 'Department code is required'],
    trim: true,
    uppercase: true,
    maxlength: [20, 'Code cannot be more than 20 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters'],
    default: ''
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: [true, 'Organization is required'],
    immutable: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Compound unique index on organization + code
departmentSchema.index({ organization: 1, code: 1 }, { unique: true });

module.exports = mongoose.model('Department', departmentSchema);
