// app.js

require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const roomRoutes = require('./routes/roomRoutes');
const bookingRoutes = require('./routes/bookingRoutes')
const cors = require('cors');

const app = express();
app.use(cors());

// Connect to the database
connectDB();

// Middleware
app.use(express.json());
app.use(require('./middleware/errorMiddleware'));
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);

// Global Error Handler
app.use(require('./middleware/errorMiddleware'));

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Confirmation
app.get('/', (req, res) => {
  const message = `Server is running! (Version 1.0.0, Time: ${new Date().toISOString()})`;
  res.send(message);
});

app.use((err, req, res, next) => {
    console.error("Global error handler:", err.stack);
    res.status(500).send('Something went wrong!');
});


