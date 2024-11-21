// controllers/bookingController.js

const Booking = require('../models/Booking');
const Room = require('../models/Room');
const cron = require('node-cron');

// Cron job to automatically expire past bookings every hour
cron.schedule('0 * * * *', async () => {
    const currentDateTime = new Date();
    try {
        const expiredBookings = await Booking.find({
            status: 'booked',
            bookingDate: { $lte: currentDateTime },
            timeSlot: { $lte: getCurrentTimeSlot(currentDateTime) }
        });

        for (let booking of expiredBookings) {
            booking.status = 'expired';
            await booking.save();
        }
    } catch (error) {
        console.error("Error updating expired bookings:", error);
    }
});

// Helper to generate the current time slot string based on the hour
function getCurrentTimeSlot(currentDate) {
    const hour = currentDate.getHours();
    const nextHour = hour + 1;
    return `${String(hour).padStart(2, '0')}:00-${String(nextHour).padStart(2, '0')}:00`;
}

// Create a new booking
exports.createBooking = async (req, res) => {
  const { roomId, bookingDate, timeSlot } = req.body;
  const userId = req.user.userId;

  try {
    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    const existingBooking = await Booking.findOne({
      room: roomId,
      bookingDate: new Date(bookingDate),
      timeSlot,
      status: 'booked',
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'Room is already booked for this time slot' });
    }

    const newBooking = new Booking({
      user: userId,
      room: roomId,
      bookingDate: new Date(bookingDate),
      timeSlot,
    });

    await newBooking.save();
    res.status(201).json({ message: 'Booking confirmed', booking: newBooking });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Retrieve booking details
exports.getBookingDetails = async (req, res) => {
  const { bookingId } = req.params;
  const userId = req.user.userId;

  try {
    const booking = await Booking.findById(bookingId)
      .populate('room')
      .populate('user', 'username email');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (booking.user._id.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.status(200).json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Server error in getBookingDetails()' });
  }
};

// Retrieve bookings for a specific room and date
exports.getBookingsByRoomAndDate = async (req, res) => {
    const { roomId, bookingDate } = req.query;

    if (!roomId || !bookingDate) {
        return res.status(400).json({ message: 'roomId and bookingDate are required' });
    }

    try {
        const startOfDay = new Date(`${bookingDate}T00:00:00.000Z`);
        const endOfDay = new Date(`${bookingDate}T23:59:59.999Z`);

        const bookings = await Booking.find({
            room: roomId,
            bookingDate: { $gte: startOfDay, $lte: endOfDay }
        })
        .populate('user', 'username email')
        .populate('room', 'roomNumber location');

        res.status(200).json(bookings);
    } catch (error) {
        console.error('Error fetching bookings by room and date:', error.message);
        res.status(500).json({ message: 'Server error in getBookingsByRoomAndDate()' });
    }
};

// Cancel a booking
exports.cancelBooking = async (req, res) => {
  const { bookingId } = req.params;
  const userId = req.user.userId;

  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (booking.user.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    booking.status = 'canceled';
    await booking.save();
    res.status(200).json({ message: 'Booking canceled successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Retrieve all bookings for a user, excluding expired
exports.getUserBookings = async (req, res) => {
    const userId = req.user.userId;

    try {
        const bookings = await Booking.find({ user: userId, status: { $ne: 'expired' } })
            .populate('room')
            .sort({ bookingDate: -1 });

        res.status(200).json(bookings);
    } catch (err) {
        res.status(500).json({ message: 'Server error in getUserBookings()' });
    }
};

// Retrieve bookings for a room on a specific date
exports.getRoomBookings = async (req, res) => {
    const { roomId, bookingDate } = req.query;

    if (!roomId || !bookingDate) {
        return res.status(400).json({ message: 'roomId and bookingDate are required' });
    }

    try {
        const startOfDay = new Date(bookingDate);
        startOfDay.setUTCHours(0, 0, 0, 0);

        const endOfDay = new Date(bookingDate);
        endOfDay.setUTCHours(23, 59, 59, 999);

        const bookings = await Booking.find({
            room: roomId,
            bookingDate: { $gte: startOfDay, $lte: endOfDay },
            status: 'booked'
        }).populate('user').populate('room');

        res.status(200).json(bookings);
    } catch (error) {
        console.error('Error fetching room bookings:', error);
        res.status(500).json({ message: 'Server error in getRoomBookings()' });
    }
};

// Retrieve all bookings
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('room')
            .populate('user', 'username email')
            .sort({ bookingDate: -1 });

        res.status(200).json(bookings);
    } catch (error) {
        console.error('Error fetching all bookings:', error);
        res.status(500).json({ message: 'Server error in getAllBookings()' });
    }
};
