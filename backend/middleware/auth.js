// Import dependancies
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // Get token from header and remove bearer from it
    const token = req.headers.authorization.split(' ')[1];
    // Decode token with token secret 
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    // Get the userId from decoded token
    const userId = decodedToken.userId;
    // Keep userId for later if we want to delete a sauce
    req.auth = { userId };
    
    if (req.body.userId) {
      if (req.body.userId !== userId) {
        // If userId is not the same as one in the token, throw error
        throw 'Invalid user ID';
      } else {
        // Else go next
        next();
      }
    } else {
      throw 'Invalid user ID';
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};