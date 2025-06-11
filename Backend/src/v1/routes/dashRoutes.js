const express = require('express');

const { admin } = require('../controllers/dashController');
const { authenticateToken, authorizeRoles } = require('../middlewares/MWauthentication')

const router = express.Router()

router.get('/admin', authenticateToken, authorizeRoles('admin'), admin);

module.exports = router;