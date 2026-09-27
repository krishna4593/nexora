const mongoose = require('mongoose');

const attendanceRecordSchema = new mongoose.Schema({
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AttendanceSession',
    required: [true, 'Session is required'],
    immutable: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'Student is required'],
    immutable: true
  },
  enrollment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Enrollment',
    required: [true, 'Enrollment is required'],
    immutable: true
  },
  status: {
    type: String,
    enum: ['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'],
    required: true
  },
  markedAt: {
    type: Date,
    default: Date.now
  },
  markedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  remarks: {
    type: String,
    trim: true,
    maxlength: 200
  }
}, {
  timestamps: true
});

// A student can only have ONE attendance record per session
attendanceRecordSchema.index(
  { session: 1, student: 1 }, 
  { unique: true, message: 'Student already has an attendance record for this session.' }
);

attendanceRecordSchema.index({ student: 1, status: 1 });
attendanceRecordSchema.index({ enrollment: 1 });

module.exports = mongoose.model('AttendanceRecord', attendanceRecordSchema);
