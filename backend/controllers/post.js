// Import dependancies
// const mysql = require('mysql');
const fs = require('fs');
const db = require('../utils/db');

// -------------------Database Functions-----------------------------------------------
// queryType accept string, args is an object containing arguments for the query
async function dbQuery(queryType, args) {
    return await db.dbQuery(queryType, table = 'posts', args);
}

// ----------------Ends of functions---------------------------------------

// Create post
exports.createPost = (req, res) => {
    // Prepare post datas
    let post = {
        name: req.auth.name,
        userId: req.auth.userId,
        likes: JSON.stringify([]),
        created_at: new Date(),
        ...req.body
    }
    if (req.file) {
        // If there is an image, set imageUrl
        post.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    }
    // Then create post in db
    dbQuery("create", post)
        .then((response) => {
            post.id = response.insertId;
            res.status(201).json(post);
        })
        .catch((error) => { res.status(400).json({ message: " error: " + error }) });
};

// Read posts
exports.getPosts = (req, res) => {
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

// Update a post
exports.updatePost = (req, res) => {
    // Verify if the post is user's post or the user is admin
    if (req.auth.userId === parseInt(req.body.userId) || req.auth.isAdmin) {

        let post = {
            id: req.params.id,
            name: req.body.name,
            userId: req.body.userId,
            likes: JSON.stringify(req.body.likes),
            ...req.body
        }
        post.id = parseInt(post.id)
        post.userId = parseInt(post.userId)
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
    } else {
        res.status(400).json({ message: 'Unauthorized request !' });
    }
};

exports.likePost = (req, res) => {
    // Prepare variables
    const userId = req.auth.userId;
    const like = parseInt(req.body.like)

    // Get the post datas from db
    dbQuery("select", { "id": req.params.id })
        .then((response) => {
            // Then fill the post object with the response
            let post = {
                ...response[0],
                likes: JSON.parse(response[0].likes),
            }
            if (post.likes = post.likes.filter(u => parseInt(u) !== userId)) {
                // if there is a like, remove it from post
            } else {
                res.status(400).json({ message: " error: " + error })
            }
            if (like === 1) {
                // UserId pushed in like
                post.likes.push(userId)
            }
            // Stringify likes for the db update
            post.likes = JSON.stringify(post.likes)
            dbQuery("like", post)
                .then(() => { res.status(201).json(post) })
                .catch((error) => { res.status(400).json({ message: " error: " + error }) });
        }).catch((error) => { res.status(400).json({ message: " error: " + error }) });
};

// Delete a post
exports.deletePost = (req, res) => {
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