const express = require('express');
const {
  getFaculty,
  getFacultyById,
  createFaculty,
  updateFaculty,
  updateFacultyStatus,
  deleteFaculty
} = require('../controllers/faculty.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getFaculty)
  .post(createFaculty);

router
  .route('/:id')
  .get(getFacultyById)
  .patch(updateFaculty)
  .delete(deleteFaculty);

router.patch('/:id/status', updateFacultyStatus);

module.exports = router;
