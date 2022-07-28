// Import dependancies
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const mysql = require('mysql');
const db = require('../utils/db');
const User = require('../models/user')

// -------------------Database Functions-----------------------------------------------
async function dbQuery(queryType, args) {
  return await db.dbQuery(queryType, table = 'users', args);
}
// ----------------Ends of functions---------------------------------------


// Signup
exports.signup = (req, res, next) => {
  // Creat an object user
  let user = new User;
  // Hash the password
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      // Fill the user with req.body and the hash of the password
      user = {
        ...req.body,
        password: hash
      }
      // Create user in db
      dbQuery("create", user)
        .then((response) => {
          // Then get the user id from response
          const id = response.insertId;

          res.status(201).json({
            userId: id,
            token: jwt.sign(
              { userId: id, isAdmin: 0 },
              process.env.TOKEN_SECRET,
              { expiresIn: '24h' }
            )
          })
        })
        .catch(() => { res.status(400).json({ error: "User already exists !!" }) });
    })
    .catch((error) => res.status(500).json({ error }));
};

// Login
exports.login = (req, res, next) => {
  // Find user in database with his email
  console.log(req.body)
  dbQuery("select", { "email": req.body.email })
    .then((response) => {
      if (response == '') {
        res.status(400).json({ error: "Email not found!!" })
      }
      else {
        const user = response[0];
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
                { userId: user.id, isAdmin: user.isAdmin },
                process.env.TOKEN_SECRET,
                { expiresIn: '24h' }
              )
            }
            );
          })
      }
    })
    .catch(error => res.status(500).json({ error }));
};
// Get the user
exports.me = (req, res, next) => {
  let user = new User;
  dbQuery("select", { "id": req.auth.userId })
    .then((response) => {

      delete response[0].password
      delete response[0].isAdmin
      user = {
        ...response[0]
      }
      res.status(200).json(user)

    })
    .catch((error) => {
      res.status(400).json({ message: " error: " + error })
    });

}
// Update
exports.update = (req, res, next) => {
  let user = new User;

  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      user = {
        ...req.body,
        id: req.auth.userId,
        password: hash
      }
      console.log(user)
      dbQuery("update", user)
        .then(() => { res.status(201).json(user) })
        .catch((error) => { res.status(400).json({ error: error }); })
    })
    .catch(error => res.status(500).json({ error }));
};

// Delete
exports.delete = (req, res, next) => {
  dbQuery("delete", { "id": req.auth.userId })
    .then(() => {
      res.status(200).json({ message: 'User deleted successfully !' });
    })
    .catch((error) => { res.status(400).json({ error: error }) });
};