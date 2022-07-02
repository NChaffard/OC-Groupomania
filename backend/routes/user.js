// Import dependancies
const express = require('express');
const router = express.Router();
// Import middlewares
const auth = require('../middleware/auth');
// Import user controller
const userCtrl = require('../controllers/user');
// Create routes
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.put('/update', auth, userCtrl.update);
router.delete('/delete', auth, userCtrl.delete);

module.exports = router;