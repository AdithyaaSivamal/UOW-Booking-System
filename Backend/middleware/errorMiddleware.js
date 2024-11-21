// middleware/errMiddleware.js

module.exports = (err, req, res, next) => {
  console.error('Error stack trace:', err.stack); // Log detailed error stack trace
  res.status(500).json({ message: 'Server error' }); // Respond with a generic server error message
};
