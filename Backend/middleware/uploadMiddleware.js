// middleware/uploadMiddleware.js

const multer = require('multer');

// Configure multer to use memory storage (stores files as buffers)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = upload; // Export the middleware for use in routes
