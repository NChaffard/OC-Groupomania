// Import dependancies
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
// Connexion to database
const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
  });


// Signup
exports.signup = (req, res, next) => {
  // Hash the password
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      // Prepare query
      let insertQuery = 'INSERT INTO ?? (??,??,??) VALUES (?,?,?)';
      let query = mysql.format(insertQuery,["users", "email", "name", "password", req.body.email, req.body.name, hash]);
      // Then save the user in database
      pool.query(query,(err, response) => {
        if (err) {
          // If user already exists, stop the query and show error message
           return res.status(400).json({message: "User already exists !!"});
        }
        // If the user is created, validate the query and show validation message
        res.status(201).json({message: "User created successfully !!"})});
    })
    .catch(error => res.status(500).json({ error }));
};

// Login
exports.login = (req, res, next) => {
// Find user in database with his email
let selectQuery = 'SELECT * FROM ?? WHERE ?? = ?';
let query = mysql.format(selectQuery, ["users", "email", req.body.email]);
pool.query(query, (err, data) => {
  if(err) {
    console.error(err);
    return;
  }
  if (!data[0]) {
    // Error if user doesn't exist
    return res.status(401).json({ error: 'User not found !' });
  }
    // Create user with data from query
    const user = data[0];
    // Then compare password from user with password from database
    bcrypt.compare(req.body.password, user.password)
      .then(valid => {
        if (!valid) {
          // If passwords don't match return error
          return res.status(401).json({ error: 'Wrong password !' });
        }
        // If passwords match, return id and a token from id
        res.status(200).json({
          userId: user.id,
          token: jwt.sign(
            { userId: user.id},
            process.env.TOKEN_SECRET,
            { expiresIn: '24h'}
          )
      });
    })
      .catch(error => res.status(500).json({ error })); 

})
};
// Update
exports.update = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
  .then(hash => {
    // Prepare query
    let updateQuery = "UPDATE ?? SET ?? = ?, ?? = ?, ?? = ? WHERE ?? = ?";
    let query = mysql.format(updateQuery, ["users","email", req.body.email, "name", req.body.name, "password", hash, "id", req.body.userId]);
    pool.query(query,(err, response) => {
      if(err) {
          // If user doesn't exist, stop the query and show error message
          return res.status(400).json({message: "User doesn't exist !!"});
        }
      // If the user is updated, validate the query and show validation message
      res.status(201).json({message: "User updated successfully !!"});
    });
  });
};
// Delete
exports.delete = (req, res, next) => {
  // Prepare query
  let deleteQuery = "DELETE from ?? WHERE ?? = ?";
  let query = mysql.format(deleteQuery, ["users", "id", req.body.userId]);
  pool.query(query,(err, response) => {
    if(err) {
      console.error(err);
      return;
    }
    res.status(200).json({ message: 'User deleted successfully !'});
  })
};