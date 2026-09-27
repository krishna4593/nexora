const express = require('express');
const {
  getNotices,
  getNoticeById,
  createNotice,
  updateNotice,
  publishNotice,
  unpublishNotice,
  toggleNoticeStatus,
  deleteNotice
} = require('../controllers/notice.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getNotices)
  .post(createNotice);

router
  .route('/:id')
  .get(getNoticeById)
  .patch(updateNotice)
  .delete(deleteNotice);

router.patch('/:id/publish', publishNotice);
router.patch('/:id/unpublish', unpublishNotice);
router.patch('/:id/status', toggleNoticeStatus);

module.exports = router;
