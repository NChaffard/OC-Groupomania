// Import dependancies
const multer = require('multer');

// MIME_TYPES dictionary
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};
// Get destination folder for images
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  // Modify images filename to be unique
  filename: (req, file, callback) => {
    // Replace space in filename with underscore and transform in lower case
    const filename = file.originalname.toLowerCase().split(' ').join('_');
    // Remove extension from filename
    const name = filename.split('.')[0];
    // Get extension from mimetype dictionnary
    const extension = MIME_TYPES[file.mimetype];
    // Add timestamp and extension to filename
    // Return filename
    callback(null, name + Date.now() + '.' + extension);
  }
});
// Export middleware with destination and filename for a single image file 
module.exports = multer({storage}).single('image');