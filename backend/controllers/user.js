// Import dependancies
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const db = require('../utils/db');

// -------------------Database Functions-----------------------------------------------
async function dbQuery(queryType, args){
    return await db.dbQuery(queryType, table = 'users', args);
}
// ----------------Ends of functions---------------------------------------


// Signup
exports.signup = (req, res, next) => {
  // Hash the password
  bcrypt.hash(req.body.password, 10)
  .then((hash) => {
    dbQuery("create",{"email": req.body.email, "name": req.body.name, "password": hash})
    .then(() =>{res.status(201).json({message: "User created successfully !!"})})
    .catch(() => {res.status(400).json({error: "User already exists !!"})});
  })  
  .catch((error) => res.status(500).json({ error }));
};

// Login
exports.login = (req, res, next) => {
  // Find user in database with his email
  dbQuery("select", {"email": req.body.email})
  .then((response) => {
    if (response == ''){
      res.status(400).json({error: "Email not found!!"})
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
              { userId: user.id},
              process.env.TOKEN_SECRET,
              { expiresIn: '24h'}
            )
        });
      })
    }
  })
  .catch(error => res.status(500).json({ error }));       
};

// Update
exports.update = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
  .then((hash) => {
    dbQuery("update", { "email": req.body.email, "name": req.body.name, "password": hash, "id": req.body.userId})
      .then(()=>{res.status(201).json({message: "User updated successfully !!"});})
      .catch((error)=> {res.status(400).json({message: "User doesn't exist !!"});})
  })
  .catch(error => res.status(500).json({ error })); 
};

// Delete
exports.delete = (req, res, next) => {
  dbQuery("delete", { "id": req.body.userId})
  .then(() => {
    res.status(200).json({ message: 'User deleted successfully !'});
  })
  .catch((error) =>{res.status(400).json({error : error})});
};