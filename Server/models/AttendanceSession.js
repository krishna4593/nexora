const mongoose = require('mongoose');

const attendanceSessionSchema = new mongoose.Schema({
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: [true, 'Organization is required'],
    immutable: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course is required']
  },
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty',
    required: [true, 'Faculty is required']
  },
  date: {
    type: Date,
    required: [true, 'Date is required']
  },
  startTime: {
    type: String,
    required: [true, 'Start time is required'],
    match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Time must be in HH:MM format']
  },
  endTime: {
    type: String,
    match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Time must be in HH:MM format']
  },
  topic: {
    type: String,
    trim: true,
    maxlength: 200
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  status: {
    type: String,
    enum: ['OPEN', 'COMPLETED', 'CANCELLED'],
    default: 'OPEN'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  }
}, {
  timestamps: true
});

// Prevent duplicate sessions for the same course, date and start time in an organization
attendanceSessionSchema.index(
  { organization: 1, course: 1, date: 1, startTime: 1 }, 
  { unique: true, message: 'An attendance session already exists for this course on this date and time.' }
);

attendanceSessionSchema.index({ organization: 1, course: 1, status: 1 });
attendanceSessionSchema.index({ organization: 1, faculty: 1 });

module.exports = mongoose.model('AttendanceSession', attendanceSessionSchema);
