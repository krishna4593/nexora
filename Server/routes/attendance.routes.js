const express = require('express');
const {
  getSessions,
  getSessionById,
  createSession,
  getSessionRecords,
  bulkMarkAttendance,
  updateSessionStatus
} = require('../controllers/attendance.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

// Session Routes
router
  .route('/sessions')
  .get(getSessions)
  .post(createSession);

router
  .route('/sessions/:id')
  .get(getSessionById);

router.patch('/sessions/:id/status', updateSessionStatus);

// Record Routes
router
  .route('/sessions/:id/records')
  .get(getSessionRecords);

router.post('/sessions/:id/records/bulk', bulkMarkAttendance);

// Report Routes
const { getStudentReport, getCourseReport } = require('../controllers/attendance.controller');

router.get('/reports/student/:studentId', getStudentReport);
router.get('/reports/course/:courseId', getCourseReport);

module.exports = router;
