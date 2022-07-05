// Import dependancies
const express = require('express');
const router = express.Router();
// Import middlewares
const auth = require('../middleware/auth');
// const multer = require('../middleware/multer-config');
// Import user controller
const postCtrl = require('../controllers/post');
// Create routes
router.post('/', auth,postCtrl.createPost);
router.get('/:id', auth,postCtrl.getPosts);
router.get('/', auth,postCtrl.getPosts);
router.put('/:id', auth,postCtrl.updatePost);
router.delete('/:id', auth,postCtrl.deletePost);

module.exports = router;