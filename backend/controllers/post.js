// Import dependancies
// const mysql = require('mysql');
const fs = require('fs');
const { request } = require('http');
const db = require('../utils/db');
const Post = require('../models/Post')

// -------------------Database Functions-----------------------------------------------
async function dbQuery(queryType, args) {
    return await db.dbQuery(queryType, table = 'posts', args);
}

// ----------------Ends of functions---------------------------------------

// Create post
exports.createPost = (req, res, next) => {
    let post = new Post;
    post = {
        name: req.auth.name,
        userId: req.auth.userId,
        likes: JSON.stringify([]),
        dislikes: JSON.stringify([]),
        ...req.body
    }
    if (req.file) {

        post.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    }
    dbQuery("create", post)
        .then((response) => {
            post.id = response.insertId;
            post.time_stamp = new Date();
            res.status(201).json(post);
        })
        .catch((error) => { res.status(400).json({ message: " error: " + error }) });
};

// Read posts
exports.getPosts = (req, res, next) => {
    let post = new Post;
    // If req.params.id doesn't exists, return all posts
    req.params.id ? id = req.params.id : id = -1
    dbQuery("select", { "id": id })
        .then((response) => {
            posts = response.map(r => post = { ...r })
            res.status(200).json(posts)
        })
        .catch((error) => {
            res.status(400).json({ message: " error: " + error })
        });
};
async function deleteImage(filename) {
    await fs.unlink(`images/${filename}`, (error) => {
        if (error) {
            console.log(error);
        }
        else {
            console.log("Image deleted successfully");
        }
    })
}

// Update a post
exports.updatePost = (req, res, next) => {
    // Create an object Post
    let post = new Post;

    // Fill it
    post = {
        id: req.params.id,
        name: req.body.name,
        userId: req.body.userId,
        likes: JSON.stringify(req.body.likes),
        dislikes: JSON.stringify(req.body.dislikes),
        ...req.body
    }
    post.id = parseInt(post.id)
    // If  there is a file transmitted in the form or the deleteImage input
    if (req.file || req.body.deleteImage) {
        // If there is a previous image in post delete it
        if (req.body.imageUrl) {
            const filename = req.body.imageUrl.split('/images/')[1]
            fs.unlink(`images/${filename}`, (error) => {
                if (error) {
                    console.log(error);
                }
                else {
                    console.log("Image deleted successfully");
                }
            })
        }
        // If there is a new image, get the url for the db
        if (req.file) {
            post.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`

        } else
        // Else the imageUrl is null
        {
            post.imageUrl = null
        }
    }
    // Update db
    dbQuery("update", post)
        // Then return post updated
        .then(() => { res.status(201).json(post) })
        .catch((error) => { res.status(400).json({ message: " error: " + error }) });
};

exports.likePost = (req, res, next) => {
    // Prepare variables
    const userId = req.auth.userId;
    const like = parseInt(req.body.like)
    // Create an object Post
    let post = new Post;

    // Get the post datas from db
    dbQuery("select", { "id": req.params.id })
        .then((response) => {
            // Then fill the post object with the response
            post = {
                ...response[0],
                likes: JSON.parse(response[0].likes),
                dislikes: JSON.parse(response[0].dislikes)
            }
            if ((post.likes = post.likes.filter(u => parseInt(u) !== userId)) && (post.dislikes = post.dislikes.filter(u => parseInt(u) !== userId))) {
                // if there is a like or a dislike, remove it from post
            } else {
                res.status(400).json({ message: " error: " + error })
            }
            if ((like === 1 && post.likes.push(userId)) || ((like === -1 && post.dislikes.push(userId)))) {
                // UserId pushed in like or dislike
            }
            post.likes = JSON.stringify(post.likes)
            post.dislikes = JSON.stringify(post.dislikes)
            dbQuery("update", post)
                .then(() => { res.status(201).json(post) })
                .catch((error) => { res.status(400).json({ message: " error: " + error }) });
        }).catch((error) => { res.status(400).json({ message: " error: " + error }) });
};

// Delete a post
exports.deletePost = (req, res, next) => {
    // // get userid of the post to delete
    dbQuery("select", { "id": req.params.id })
        .then((response) => {
            res.status(200);
            // Verify if the user who wants to modify the post is the one who created it
            if ((response[0].userId === req.auth.userId) || req.auth.isAdmin === 1) {
                if (response[0].imageUrl) {

                    const filename = response[0].imageUrl.split('/images/')[1]
                    fs.unlink(`images/${filename}`, (error) => {
                        if (error) {
                            console.log(error);
                        }
                        else {
                            console.log("Image deleted successfully");
                        }
                    })
                }

                dbQuery("delete", { "id": req.params.id })
                    .then(() => { res.status(201).json({ message: "Post deleted successfully !!" }); })
                    .catch((error) => {
                        res.status(400).json({ message: " error: " + error })
                    });
            } else {
                res.status(400).json({ message: 'Unauthorized request !' });
            }
        })
        .catch((error) => {
            res.status(400).json({ message: " error: " + error })
        });
};