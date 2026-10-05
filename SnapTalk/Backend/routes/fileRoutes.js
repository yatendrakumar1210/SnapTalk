const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { upload, handleFileUpload } = require('../controllers/fileController');

router.use(authMiddleware);

router.post('/upload', upload.single('file'), handleFileUpload);

module.exports = router;
