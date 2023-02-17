// Import dependancies
const express = require('express');
const fs = require('fs');
const path = require('path');
// Load environment variables
const dotenv = require('dotenv').config();
// Import Routes
const postRoutes = require('./routes/post');
const userRoutes = require('./routes/user');
// initialize app
const app = express();

// Create images folder if it doesn't exist
const imagesFolder = './images';

try {
  if (!fs.existsSync(imagesFolder)) {
    fs.mkdirSync(imagesFolder);
  }
} catch (err) {
  console.error(err);
}

// Set headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.ORIGIN_REQ_ADDRESS);
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});
// Set object body in req with json data 
app.use(express.json());
// Add Routes
// static for images
app.use('/images', express.static(path.join(__dirname, 'images')));
// routes for the api
app.use('/api/auth', userRoutes);
app.use('/api/post', postRoutes);

module.exports = app;