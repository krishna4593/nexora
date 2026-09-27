const express = require('express');
const {
  getDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  updateDepartmentStatus,
  deleteDepartment
} = require('../controllers/department.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getDepartments)
  .post(createDepartment);

router
  .route('/:id')
  .get(getDepartment)
  .patch(updateDepartment)
  .delete(deleteDepartment);

router.patch('/:id/status', updateDepartmentStatus);

module.exports = router;
