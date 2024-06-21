<<<<<<< HEAD:backend/controllers/user.controller.js
// Import dependancies
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
db = require("../models");
const User = db.users;



// Signup
exports.signup = (req, res) => {
  // Hash the password
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      // Fill the user with req.body and the hash of the password
      User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      })
        .then((data) => {
          res.status(201).json({
            userId: data.dataValues.id,
            name: data.dataValues.name,
            isAdmin: data.dataValues.isAdmin,
            token: jwt.sign(
              {
                name: data.dataValues.name,
                userId: data.dataValues.id,
                isAdmin: data.dataValues.isAdmin
              },
              process.env.TOKEN_SECRET,
              { expiresIn: '24h' }
            )
          });
        })
        .catch(() => { res.status(400).json({ error: "L'utilisateur existe déja !!" }) });
    })
    .catch((error) => res.status(500).json({ error }));
};

// Login
exports.login = (req, res) => {
  // Find user in database with his email
  // dbQuery("select", { "email": req.body.email })
  User.findOne({ where: { email: req.body.email } })
    .then((response) => {
      if (response == '') {
        res.status(400).json({ error: "L'email n'existe pas!!" })
      }
      else {
        const user = response;
        // Then compare password from user with password from database
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {
            if (!valid) {
              // If passwords don't match return error
              return res.status(401).json({ error: 'Mot de passe érroné !' });
            }
            // If passwords match, return id and a token from id
            res.status(200).json({
              userId: user.id,
              isAdmin: user.isAdmin,
              token: jwt.sign(
                {
                  name: user.name,
                  userId: user.id,
                  isAdmin: user.isAdmin
                },
                process.env.TOKEN_SECRET,
                { expiresIn: '1h' }
              )
            }
            );
          })
      }
    })
    .catch(error => res.status(500).json({ error }));
};
// Get the user
exports.me = (req, res) => {

  User.findByPk(req.auth.userId)
    .then((response) => {

      delete response.dataValues.password
      res.status(200).json(response)

    })
    .catch((error) => {
      res.status(400).json({ message: " error: " + error })
    });

=======
// Import dependancies
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const mysql = require('mysql');
const db = require('../utils/db');

// -------------------Database Functions-----------------------------------------------
// queryType accept string, args is an object containing arguments for the query
async function dbQuery(queryType, args) {
  return await db.dbQuery(queryType, table = 'users', args);
}
// ----------------Ends of functions---------------------------------------


// Signup
exports.signup = (req, res) => {
  // Hash the password
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      // Fill the user with req.body and the hash of the password
      let user = {
        ...req.body,
        password: hash
      }
      // Create user in db
      dbQuery("create", user)
        .then((response) => {
          // Then get the user id from response
          const id = response.insertId;
          dbQuery("select", { "id": id })
            .then((response) => {
              user.name = response[0].name
              res.status(201).json({
                userId: id,
                isAdmin: 0,
                token: jwt.sign(
                  {
                    name: user.name,
                    userId: id,
                    isAdmin: 0
                  },
                  process.env.TOKEN_SECRET,
                  { expiresIn: '1h' }
                )
              })
            })
        })
        .catch(() => { res.status(400).json({ error: "L'utilisateur existe déja !!" }) });
    })
    .catch((error) => res.status(500).json({ error }));
};

// Login
exports.login = (req, res) => {
  // Find user in database with his email
  dbQuery("select", { "email": req.body.email })
    .then((response) => {
      if (response == '') {
        res.status(400).json({ error: "L'email n'existe pas!!" })
      }
      else {
        const user = response[0];
        // Then compare password from user with password from database
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {
            if (!valid) {
              // If passwords don't match return error
              return res.status(401).json({ error: 'Mot de passe érroné !' });
            }
            // If passwords match, return id and a token from id
            res.status(200).json({
              userId: user.id,
              isAdmin: user.isAdmin,
              token: jwt.sign(
                {
                  name: user.name,
                  userId: user.id,
                  isAdmin: user.isAdmin
                },
                process.env.TOKEN_SECRET,
                { expiresIn: '1h' }
              )
            }
            );
          })
      }
    })
    .catch(error => res.status(500).json({ error }));
};
// Get the user
exports.me = (req, res) => {
  ;
  dbQuery("select", { "id": req.auth.userId })
    .then((response) => {

      delete response[0].password
      delete response[0].isAdmin
      let user = {
        ...response[0]
      }
      res.status(200).json(user)

    })
    .catch((error) => {
      res.status(400).json({ message: " error: " + error })
    });

>>>>>>> ec06faa30b148f9b55262b048edc1834eadf5d62:backend/controllers/user.js
};