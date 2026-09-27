const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: [true, 'Student ID is required'],
    trim: true,
    uppercase: true
  },
  admissionNumber: {
    type: String,
    required: [true, 'Admission number is required'],
    trim: true,
    uppercase: true
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
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: ['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY']
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: [true, 'Department is required']
  },
  semester: {
    type: Number,
    required: [true, 'Semester is required'],
    min: [1, 'Semester must be at least 1'],
    max: [8, 'Semester cannot exceed 8']
  },
  academicYear: {
    type: String,
    required: [true, 'Academic year is required'],
    trim: true,
    match: [/^\d{4}-\d{2}$/, 'Academic year must be in format YYYY-YY (e.g. 2026-27)']
  },
  admissionYear: {
    type: Number,
    required: [true, 'Admission year is required'],
    min: [1900, 'Invalid admission year'],
    max: [2100, 'Invalid admission year']
  },
  guardianName: {
    type: String,
    required: [true, 'Guardian name is required'],
    trim: true
  },
  guardianPhone: {
    type: String,
    required: [true, 'Guardian phone is required'],
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  state: {
    type: String,
    trim: true
  },
  postalCode: {
    type: String,
    trim: true
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

// Compound unique indexes for ID fields per organization
studentSchema.index({ organization: 1, studentId: 1 }, { unique: true });
studentSchema.index({ organization: 1, admissionNumber: 1 }, { unique: true });

// Secondary indexes for filtering
studentSchema.index({ organization: 1, department: 1 });
studentSchema.index({ organization: 1, semester: 1 });
studentSchema.index({ organization: 1, admissionYear: 1 });
studentSchema.index({ organization: 1, email: 1 });
studentSchema.index({ organization: 1, isActive: 1 });

module.exports = mongoose.model('Student', studentSchema);
