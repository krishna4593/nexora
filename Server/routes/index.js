const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.routes');
const organizationRoutes = require('./organization.routes');
const departmentRoutes = require('./department.routes');
const facultyRoutes = require('./faculty.routes');
const courseRoutes = require('./course.routes');
const studentRoutes = require('./student.routes');
const enrollmentRoutes = require('./enrollment.routes');
const attendanceRoutes = require('./attendance.routes');
const noticeRoutes = require('./notice.routes');

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Enterprise Intelligence Platform API is running'
  });
});

router.use('/auth', authRoutes);
router.use('/organizations', organizationRoutes);
router.use('/departments', departmentRoutes);
router.use('/faculty', facultyRoutes);
router.use('/courses', courseRoutes);
router.use('/students', studentRoutes);
router.use('/enrollments', enrollmentRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/notices', noticeRoutes);

module.exports = router;
