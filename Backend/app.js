// app.js

require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const roomRoutes = require('./routes/roomRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const cors = require('cors');

const app = express();

// Middleware for CORS
app.use(cors());

// Middleware for Secure HTTP Headers
app.use(helmet());

// Connect to the database
connectDB();

// Middleware for parsing JSON
app.use(express.json());

// Security Headers - Custom Additions
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff'); 
    res.setHeader('X-Frame-Options', 'DENY'); 
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'self'; script-src 'self'; style-src 'self';"
    ); // CSP settings
    res.setHeader('Referrer-Policy', 'no-referrer'); 
    res.setHeader('X-XSS-Protection', '1; mode=block'); 
    next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);

// Error Middleware
app.use(require('./middleware/errorMiddleware'));

// Confirmation Route
app.get('/', (req, res) => {
    const message = `Server is running! (Version 1.0.0, Time: ${new Date().toISOString()})`;
    res.send(message);
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Global error handler:", err.stack);
    res.status(500).send('Something went wrong!');
});

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

