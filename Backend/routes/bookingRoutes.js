// routes/bookingRoutes.js

const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authMiddleware } = require('../middleware/authMiddleware');

// routes
router.get('/byRoomAndDate', authMiddleware, bookingController.getBookingsByRoomAndDate);
router.get('/all', authMiddleware, bookingController.getAllBookings);
router.post('/', authMiddleware, bookingController.createBooking);
router.get('/', authMiddleware, bookingController.getUserBookings);
router.get('/:bookingId', authMiddleware, bookingController.getBookingDetails);
router.get('/room', authMiddleware, bookingController.getRoomBookings);
router.delete('/:bookingId', authMiddleware, bookingController.cancelBooking);


module.exports = router;
