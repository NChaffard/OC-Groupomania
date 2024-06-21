<<<<<<< HEAD
// Import dependancies
const express = require('express');
const router = express.Router();
// Import middlewares
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
// Import user controller
const userCtrl = require('../controllers/user.controller');
// Create routes
router.post('/signup', multer, userCtrl.signup);
router.post('/login', multer, userCtrl.login);
router.get('/me', auth, userCtrl.me);

=======
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

>>>>>>> ec06faa30b148f9b55262b048edc1834eadf5d62
module.exports = router;