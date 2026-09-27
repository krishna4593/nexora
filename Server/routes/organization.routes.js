const express = require('express');
const { createOrganization, getMyOrganization } = require('../controllers/organization.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// All organization routes require authentication
router.use(protect);

router.post('/', createOrganization);
router.get('/me', getMyOrganization);

module.exports = router;
