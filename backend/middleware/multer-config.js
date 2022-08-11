// Import dependancies
const { MulterError } = require('multer');
const multer = require('multer');

// MIME_TYPES dictionary
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};
// Verify if mimetype is correct
const fileFilter = (req, file, callback) => {
  let fileOk = false;
  Object.entries(MIME_TYPES).map(mimeType => mimeType[0] === file.mimetype ?
    fileOk = true : null) ?
    fileOk ? callback(null, true) : callback(new Error('not an image')) :
    callback(new Error("Problem with the file"))
}
// Verify if the file is not too big, size unit is bytes
const limits = {
  fileSize: 10000000
}
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
// Prepare the upload request
const upload = multer({ limits, fileFilter: fileFilter, storage }).single('image');

module.exports = (req, res, next) => {
  // If there is a problem with the upload, return error
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.log(err.message)
      res.status(400).json({ error: err.message })
    } else if (err) {
      console.log(err.message)
      res.status(400).json({ error: err.message })
    } else {
      // else go to the next middleware
      next()
    }
  })
}