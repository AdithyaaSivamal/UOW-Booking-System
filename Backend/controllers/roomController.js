// controllers/roomController.js

const Room = require('../models/Room');
const Booking = require('../models/Booking');

// Retrieve all rooms with optional filters
exports.getAllRooms = async (req, res) => {
  const { availability, location, capacity } = req.query;
  const query = {};

  if (availability !== undefined) query.isAvailable = availability === 'true';
  if (location) query.location = location;
  if (capacity) query.capacity = { $gte: capacity };

  try {
    const rooms = await Room.find(query);
    res.status(200).json(rooms);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Retrieve details for a single room
exports.getRoomDetails = async (req, res) => {
  const { roomId } = req.params;
  try {
    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.status(200).json(room);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new room
exports.createRoom = async (req, res) => {
  const { roomNumber, location, capacity, price, amenities } = req.body;
  try {
    const newRoom = new Room({
      roomNumber,
      location,
      capacity: parseInt(capacity),
      price: parseFloat(price),
      amenities: amenities ? amenities.split(',').map(item => item.trim()) : [],
    });

    if (req.file) {
      newRoom.image = req.file.buffer;
      newRoom.imageType = req.file.mimetype;
    }

    await newRoom.save();
    res.status(201).json({ message: 'Room created successfully', room: newRoom });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Room number already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Update room details
exports.updateRoom = async (req, res) => {
  const { roomId } = req.params;
  const updates = req.body;
  try {
    const room = await Room.findByIdAndUpdate(roomId, updates, { new: true });
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.status(200).json(room);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a room and associated bookings
exports.deleteRoom = async (req, res) => {
  const { roomId } = req.params;
  try {
    const room = await Room.findByIdAndDelete(roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    await Booking.deleteMany({ room: roomId });
    res.status(200).json({ message: 'Room and associated bookings deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update room's promotional code
exports.updateRoomPromotionalCode = async (req, res) => {
  const { roomId } = req.params;
  const { promotionalCode } = req.body;

  try {
    const room = await Room.findByIdAndUpdate(roomId, { promotionalCode }, { new: true });
    if (!room) return res.status(404).json({ message: 'Room not found' });

    res.status(200).json({ message: 'Promotional code updated successfully', room });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Retrieve room image in base64 format for front-end display
exports.getRoomImage = async (req, res) => {
  const { roomId } = req.params;
  try {
    const room = await Room.findById(roomId);
    if (!room || !room.image || !room.imageType) {
      return res.status(404).json({ message: 'Image not found' });
    }

    const base64Image = room.image.toString('base64');
    res.json({ imageUrl: `data:${room.imageType};base64,${base64Image}` });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update the room image
exports.updateRoomImage = async (req, res) => {
  const { roomId } = req.params;

  if (!req.file) return res.status(400).json({ message: 'Image file is required' });

  try {
    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    room.image = req.file.buffer;
    room.imageType = req.file.mimetype;
    await room.save();

    res.status(200).json({ message: 'Room image updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
