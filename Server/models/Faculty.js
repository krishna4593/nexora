const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: [true, 'Employee ID is required'],
    trim: true,
    uppercase: true,
    maxlength: [50, 'Employee ID cannot exceed 50 characters']
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    maxlength: [20, 'Phone cannot exceed 20 characters']
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: [true, 'Department is required']
  },
  designation: {
    type: String,
    required: [true, 'Designation is required'],
    trim: true,
    maxlength: [100, 'Designation cannot exceed 100 characters']
  },
  qualification: {
    type: String,
    required: [true, 'Qualification is required'],
    trim: true,
    maxlength: [100, 'Qualification cannot exceed 100 characters']
  },
  joiningDate: {
    type: Date,
    required: [true, 'Joining date is required']
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

// Indexes for multi-tenancy and fast queries
facultySchema.index({ organization: 1, employeeId: 1 }, { unique: true });
facultySchema.index({ organization: 1, email: 1 }, { unique: true });
facultySchema.index({ organization: 1, department: 1 });

module.exports = mongoose.model('Faculty', facultySchema);
