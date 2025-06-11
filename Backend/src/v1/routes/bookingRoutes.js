const express = require('express');
const { authenticateToken } = require('../middlewares/MWauthentication');
const { bookSession, deleteBooking, getMyBookings } = require('../controllers/bookingController');

const router = express.Router();

router.post('/booking', authenticateToken, bookSession);
router.delete('/deleteBooking/:bookingID', authenticateToken, deleteBooking);
router.get('/myBookings', authenticateToken, getMyBookings);

module.exports = router;
