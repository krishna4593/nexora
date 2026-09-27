const express = require('express');
const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  updateCourseStatus,
  deleteCourse
} = require('../controllers/course.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getCourses)
  .post(createCourse);

router
  .route('/:id')
  .get(getCourseById)
  .patch(updateCourse)
  .delete(deleteCourse);

router.patch('/:id/status', updateCourseStatus);

module.exports = router;
