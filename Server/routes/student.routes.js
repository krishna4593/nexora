const express = require('express');
const {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  updateStudentStatus,
  deleteStudent
} = require('../controllers/student.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getStudents)
  .post(createStudent);

router
  .route('/:id')
  .get(getStudentById)
  .patch(updateStudent)
  .delete(deleteStudent);

router.patch('/:id/status', updateStudentStatus);

module.exports = router;
