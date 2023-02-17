// Import dependancies
const express = require('express');
const router = express.Router();
// Import middlewares
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
// Import user controller
const postCtrl = require('../controllers/post');
// Create routes
router.post('/', auth, multer, postCtrl.createPost);
router.get('/:id', auth, postCtrl.getPosts);
router.get('/', auth, postCtrl.getPosts);
router.put('/:id', auth, multer, postCtrl.updatePost);
router.put('/:id/like', auth, multer, postCtrl.likePost);
router.delete('/:id', auth, postCtrl.deletePost);

module.exports = router;