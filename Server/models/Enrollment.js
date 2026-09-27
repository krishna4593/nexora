const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'Student is required']
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course is required']
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: [true, 'Organization is required'],
    immutable: true
  },
  academicYear: {
    type: String,
    required: [true, 'Academic year is required'],
    trim: true,
    match: [/^\d{4}-\d{2}$/, 'Academic year must be in format YYYY-YY (e.g. 2026-27)']
  },
  semester: {
    type: Number,
    required: [true, 'Semester is required'],
    min: [1, 'Semester must be at least 1'],
    max: [8, 'Semester cannot exceed 8']
  },
  status: {
    type: String,
    enum: ['ENROLLED', 'DROPPED', 'COMPLETED'],
    default: 'ENROLLED'
  },
  enrolledAt: {
    type: Date,
    default: Date.now
  },
  droppedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Compound unique index: A student can only be enrolled in a specific course once per academic year and semester.
enrollmentSchema.index(
  { organization: 1, student: 1, course: 1, academicYear: 1, semester: 1 }, 
  { unique: true, message: 'Student is already enrolled in this course for this semester.' }
);

// Secondary indexes for efficient querying
enrollmentSchema.index({ organization: 1, student: 1 });
enrollmentSchema.index({ organization: 1, course: 1 });
enrollmentSchema.index({ organization: 1, status: 1 });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
