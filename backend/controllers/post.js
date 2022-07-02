// Import dependancies
const mysql = require('mysql');
const fs = require('fs');
// Connexion to database
const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
  });

// Create post
exports.createPost = (req, res, next) => {
        // Prepare query
        let insertQuery = 'INSERT INTO ?? (??,??) VALUES (?,?)';
        let query = mysql.format(insertQuery,["posts", "userId", "text", req.body.userId, req.body.text]);
        // Then save the user in database
        pool.query(query,(err, response) => {
        if (err) {
            return res.status(400).json({message: "An error occurred !!"});
        }
        // If the post is created, validate the query and show validation message
        res.status(201).json({message: "Post created successfully !!"});
        });

};

// Get one post
exports.getOnePost = (req, res, next) => {
    // Prepare query
    let selectQuery = 'SELECT * FROM ?? WHERE ?? = ?';
    let query = mysql.format(selectQuery, ["posts", "id", req.params.id]);
    pool.query(query,(err, response) => {
        if(err) {
            return res.status(400).json({message: "An error occurred !!"});
        }
        if(response == ''){
            return res.status(400).json({message: "Post doesn't exist !!"});
        }
        res.status(200).json(response);
    });
};

// Get all posts
exports.getAllPosts = (req, res, next) => {
    // Prepare query
    let selectQuery = 'SELECT * FROM ?? ORDER BY ??';
    let query = mysql.format(selectQuery, ["posts", "time_stamp"]);
    pool.query(query,(err, response) => {
        if(err) {
            return res.status(400).json({message: "An error occurred !!"});
        }
        if (response == ''){
            return res.status(400).json({message: "There is no posts !!"});
        }
        res.status(200).json(response);
    });
};

// Update a post
exports.updatePost = (req, res, next) => {
    // get userid of the post to update
    let selectQuery = 'SELECT ?? FROM ?? WHERE ?? = ?';
    let uidQuery = mysql.format(selectQuery, ["userId", "posts", "id", req.params.id]);
    pool.query(uidQuery,(err, response) => {
        if (err) { return res.status(400).json({message: "An error occurred !!"}); }
        // Verify if the user who wants to modify the post is the one who created it
        if (response == ''){return res.status(400).json({message: "Post doesn't exist !!"});}
        if ( response[0].userId === req.auth.userId){
            // Prepare query
            let updateQuery = 'UPDATE ?? SET ?? = ? WHERE ?? = ?';
            let query = mysql.format(updateQuery, ["posts", "text", req.body.text, "id", req.params.id]);
            pool.query(query,(err, response) => {
                if (err) { return res.status(400).json({message: "An error occurred !!"}); }
                // If the post is updated, validate the query and show validation message
                res.status(201).json({message: "Post updated successfully !!"});
            });
        } else {
            res.status(400).json({ message: 'Unauthorized request !'});
        }
    });

};

// Delete a post
exports.deletePost = (req, res, next) => {
    // get userid of the post to update
    let selectQuery = 'SELECT ?? FROM ?? WHERE ?? = ?';
    let uidQuery = mysql.format(selectQuery, ["userId", "posts", "id", req.params.id]);
    pool.query(uidQuery,(err, response) => {
        if (err) { return res.status(400).json({message: "An error occurred !!"}); }
        // Verify if the user who wants to modify the post is the one who created it
        if ( response[0].userId === req.auth.userId){
            // Prepare query
            let deleteQuery = 'DELETE FROM ?? WHERE ?? = ?';
            let query = mysql.format(deleteQuery, ["posts", "id", req.params.id]);
            pool.query(query,(err, response) => {
                if (err){ return res.status(400).json({message: "An error occurred !!"}); }
                    // If the post is deleted, validate the query and show validation message
                    res.status(201).json({message: "Post deleted successfully !!"});
                });
        } else {
            res.status(400).json({ message: 'Unauthorized request !'});
        }     
    }); 
};