const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); 
const multer = require('multer');

const storage = multer.memoryStorage();
const upload_img = multer({ storage });

// Public routes
router.get('/', roomController.getAllRooms);
router.get('/:roomId', roomController.getRoomDetails);
router.get('/:roomId/image', roomController.getRoomImage); 
router.put('/:roomId/image', authMiddleware, adminMiddleware, upload_img.single('image'), roomController.updateRoomImage);


// Admin routes
router.post('/', authMiddleware, adminMiddleware, upload.single('image'), roomController.createRoom);
router.put('/:roomId', authMiddleware, adminMiddleware, roomController.updateRoom);
router.delete('/:roomId', authMiddleware, adminMiddleware, roomController.deleteRoom);
router.put('/:roomId/promotional-code', authMiddleware, adminMiddleware, roomController.updateRoomPromotionalCode);

module.exports = router;

