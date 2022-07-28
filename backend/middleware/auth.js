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
    const isAdmin = decodedToken.isAdmin;
    // Keep userId for later
    req.auth = { userId, isAdmin };

    if (req.body.userId && req.body.userId !== userId) {
      // If userId from the post is not the same as userId in the token, throw error
      throw 'Invalid user ID';
    } else {
      // Else go next
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};