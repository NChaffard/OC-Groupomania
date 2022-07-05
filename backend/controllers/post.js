// Import dependancies
const mysql = require('mysql');
const fs = require('fs');
const db = require('../utils/db');

// -------------------Database Functions-----------------------------------------------
async function create(userId, text){
    await db.create(userId, text);    
}

async function select(id = -1){
    return await db.select(id);      
}

async function update(id, text){
    await db.update(id, text);
}

async function deleteOne(id){
    await db.delete(id);
}

// ----------------Ends of functions---------------------------------------

// Create post
exports.createPost = (req, res, next) => {
    create(req.body.userId, req.body.text).then(()=>{res.status(201).json({message: "Post created successfully !!"});}).catch((error)=>{res.status(400).json({message: " error: " + error})});
};

// Read posts
exports.getPosts = (req, res, next) => {
    // If req.params.id doesn't exists, return all posts   
    select(req.params.id).then((response)=>{res.status(200).json(response)}).catch((error)=>{res.status(400).json({message: " error: " + error})});
};

// Update a post
exports.updatePost = (req, res, next) => {
    // // get userid of the post to update
    select(req.params.id)
    .then((response)=>{
        res.status(200);
        // Verify if the user who wants to modify the post is the one who created it
        if ( response[0].userId === req.auth.userId){
            update(req.params.id, req.body.text).then(()=>{res.status(201).json({message: "Post updated successfully !!"});}).catch((error)=>{res.status(400).json({message: " error: " + error})});
        } else {
            res.status(400).json({ message: 'Unauthorized request !'});
        }
    })
    .catch((error)=>{res.status(400).json({ message: " error: " + error })
    });
};

// Delete a post
exports.deletePost = (req, res, next) => {
    // // get userid of the post to delete
    select(req.params.id)
    .then((response)=>{
        res.status(200);
        // Verify if the user who wants to modify the post is the one who created it
        if ( response[0].userId === req.auth.userId){
            deleteOne(req.params.id).then(()=>{res.status(201).json({message: "Post deleted successfully !!"});}).catch((error)=>{res.status(400).json({message: " error: " + error})});
        } else {
            res.status(400).json({ message: 'Unauthorized request !'});
        }
    })
    .catch((error)=>{res.status(400).json({ message: " error: " + error })
    });
};