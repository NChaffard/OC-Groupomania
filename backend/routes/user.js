// Import dependancies
const express = require('express');
const router = express.Router();
// Import middlewares
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
// Import user controller
const userCtrl = require('../controllers/user');
// Create routes
router.post('/signup', multer, userCtrl.signup);
router.post('/login', multer, userCtrl.login);
router.get('/me', auth, userCtrl.me);

module.exports = router;