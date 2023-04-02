const express = require('express');
const router = express.Router();
const upload = require('../utils/multer');

const BlogController = require('../controllers/BlogController');

// [ Blog ] /v1/blog
router.get('/', BlogController.index);
router.get('/:id', BlogController.show);
router.post('/', upload.single('image') , BlogController.store);
router.put('/:id', upload.single('image') , BlogController.update);


module.exports = router;