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
  const port = normalizePort(process.env.PORT || '3000');
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
  