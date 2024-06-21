<<<<<<< HEAD
// Import dependencies
const http = require('http');
// Load environment variables
const dotenv = require('dotenv').config();

const bcrypt = require('bcrypt');

// Import app
const app = require('./app');
// Import database models 
const db = require("./models");


// Database sync
db.sequelize.sync()
  .then(() => {
    console.log("Synced db.");
    // Check if admin user exists or create it
    bcrypt.hash(process.env.ADMIN_PASSWORD, 10)
      .then((adminPassword) => {
        db.users.findOrCreate({
          where: { name: "admin" },
          defaults: {
            name: process.env.ADMIN_USER,
            email: process.env.ADMIN_EMAIL,
            password: adminPassword,
            isAdmin: "1"
          }
        })
      })
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });


// Normalize port
const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

// Set port
const port = normalizePort(process.env.PORT || '3333');
app.set('port', port);

// Error handling
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};
// Create server
const server = http.createServer(app);
// If error, go to errorHandler
server.on('error', errorHandler);
// If server is on listening
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  // Show the port or the pipe the server is listening to
  console.log('Listening on ' + bind);
});
// The server listen the port we have specified
server.listen(port);
=======
// Import dependancies
const http = require('http');
// Load environment variables
const dotenv = require('dotenv').config();
// Import app
const app = require('./app');

// Normalize port
const normalizePort = val => {
    const port = parseInt(val, 10);
  
    if (isNaN(port)) {
      return val;
    }
    if (port >= 0) {
      return port;
    }
    return false;
  };
  
  // Set port
  const port = normalizePort(process.env.PORT || '3333');
  app.set('port', port);
  
  // Error handling
  const errorHandler = error => {
    if (error.syscall !== 'listen') {
      throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges.');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use.');
        process.exit(1);
        break;
      default:
        throw error;
    }
  };
  // Create server
  const server = http.createServer(app);
  // If error, go to errorHandler
  server.on('error', errorHandler);
  // If server is on listening
  server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    // Show the port or the pipe the server is listening to
    console.log('Listening on ' + bind);
  });
  // The server listen the port we have specified
  server.listen(port);
 
>>>>>>> ec06faa30b148f9b55262b048edc1834eadf5d62
