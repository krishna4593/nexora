const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseCode: {
    type: String,
    required: [true, 'Course Code is required'],
    trim: true,
    uppercase: true,
    maxlength: [20, 'Course Code cannot exceed 20 characters']
  },
  name: {
    type: String,
    required: [true, 'Course name is required'],
    trim: true,
    maxlength: [100, 'Course name cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: [true, 'Department is required']
  },
  credits: {
    type: Number,
    required: [true, 'Credits are required'],
    min: [1, 'Credits must be at least 1'],
    max: [10, 'Credits cannot exceed 10']
  },
  semester: {
    type: Number,
    required: [true, 'Semester is required'],
    min: [1, 'Semester must be at least 1'],
    max: [10, 'Semester cannot exceed 10']
  },
  academicYear: {
    type: String,
    required: [true, 'Academic year is required'],
    trim: true,
    match: [/^\d{4}-\d{2}$/, 'Academic year must be in format YYYY-YY (e.g. 2026-27)']
  },
  courseType: {
    type: String,
    required: [true, 'Course type is required'],
    enum: {
      values: ['CORE', 'ELECTIVE', 'LAB', 'PROJECT', 'GENERAL'],
      message: '{VALUE} is not a valid course type'
    }
  },
  assignedFaculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty'
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

// Compound unique index for course code per organization
courseSchema.index({ organization: 1, courseCode: 1 }, { unique: true });

// Secondary indexes for filtering
courseSchema.index({ organization: 1, department: 1 });
courseSchema.index({ organization: 1, assignedFaculty: 1 });
courseSchema.index({ organization: 1, semester: 1 });
courseSchema.index({ organization: 1, courseType: 1 });

module.exports = mongoose.model('Course', courseSchema);
