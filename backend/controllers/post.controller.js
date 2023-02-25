const fs = require('fs');
const db = require("../models");
const Post = db.posts;
const User = db.users;
const Op = db.Sequelize.Op;

// Create post
exports.createPost = (req, res) => {

    if (!req.body.text) {
        res.status(400).json({
            message: "Content can not be empty !"
        })
    }
    // Prepare post datas
    let post = {
        user: { name: req.auth.name },
        userId: req.auth.userId,
        ...req.body
    }
    if (req.file) {
        // If there is an image, set imageUrl
        post.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    }
    // Then create post in db
    Post.create(post)
        .then(data => {
            post = { ...post, ...data.dataValues }
            console.log(post);
            res.status(201).json(post);
        })
        .catch(err => {
            res.status(500).json({
                message:
                    err.message || "Some error occured while creating the Post."
            });
        });
};

// Read posts
exports.getPosts = (req, res) => {

    Post.findAll({
        include: {
            model: User,
            attributes: ['name']
        }
    })
        .then(data => {

            res.status(200).json(data);
        })
        .catch(err => {
            res.status(500).json({
                message:
                    err.message || "Some error occured whilr retrieving posts."
            });
        });
};

exports.getPost = (req, res) => {
    const id = req.params.id
    Post.findByPk(id)
        .then(data => {
            if (data) {
                res.status(200).json(data);
            } else {
                res.status(404).json({
                    message: "Cannot find Post with id = ${id}."
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                message: "Error retrieving Post with id=" + id
            });
        });
};

// Update a post
exports.updatePost = (req, res) => {
    // Verify if the post is user's post or the user is admin
    if (req.auth.userId === parseInt(req.body.userId) || req.auth.isAdmin) {

        let post = {
            id: req.params.id,
            user: { name: req.body.name },
            userId: req.body.userId,
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
        Post.update(post, {
            where: { id: post.id }
        })
            .then(num => {
                console.log(post);
                console.log(num);
                if (num == 1) {
                    console.log(post);
                    res.status(201).json(post);
                } else {
                    res.status(400).json({
                        message: "Cannot update Post with id=${id}. Maybe Post was not found or req.body is empty !"
                    });
                }
            })
            .catch(err => {
                res.status(500).json({
                    message: "Error updating Post with id=" + id
                });
            });
    };
};

// Delete a post
exports.deletePost = (req, res) => {
    // // get userid of the post to delete
    const id = req.params.id;
    Post.findByPk(id)
        .then(data => {

            if ((data.userId === req.auth.userId) || req.auth.isAdmin === 1) {
                if (data.imageUrl) {
                    const filename = data.imageUrl.split('/images/')[1]
                    fs.unlink(`images/${filename}`, (error) => {
                        if (error) {
                            console.log(error);
                        }
                        else {
                            console.log("Image deleted successfully");
                        }
                    })
                }
                Post.destroy({
                    where: { id: id }
                })
                    .then(num => {
                        if (num == 1) {
                            res.send({
                                message: "Tutorial was deleted successfully!"
                            });
                        } else {
                            res.send({
                                message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`
                            });
                        }
                    })
                    .catch(err => {
                        res.status(500).send({
                            message: "Could not delete Tutorial with id=" + id
                        });
                    });
            }
        })
};