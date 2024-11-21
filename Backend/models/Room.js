// models/Room.js

const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  capacity: {
    type: Number,
    required: true
  },
  amenities: [
    {
      type: String
    }
  ],
  isAvailable: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: () => new Date()
  },
  price: {
	type: Number,
	required: true
  },
  promotionalCode: {
	type: String
  },
  image: { 
	type: Buffer 
  }, 
  imageType: { 
	type: String 
  }
});

roomSchema.virtual('imageUrl').get(function() {
  if (this.image != null && this.imageType != null) {
    return `data:${this.imageType};base64,${this.image.toString('base64')}`;
  }
});

module.exports = mongoose.model('Room', roomSchema);

