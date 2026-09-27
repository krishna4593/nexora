const express = require('express');
const {
  getEnrollments,
  getEnrollmentById,
  createEnrollment,
  updateEnrollmentStatus,
  deleteEnrollment
} = require('../controllers/enrollment.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getEnrollments)
  .post(createEnrollment);

router
  .route('/:id')
  .get(getEnrollmentById)
  .delete(deleteEnrollment);

router.patch('/:id/status', updateEnrollmentStatus);

module.exports = router;
