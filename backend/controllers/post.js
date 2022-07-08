// Import dependancies
const mysql = require('mysql');
const fs = require('fs');
const db = require('../utils/db');

// -------------------Database Functions-----------------------------------------------
async function dbQuery(queryType, args){
    return await db.dbQuery(queryType, table = 'posts', args);
}
// ----------------Ends of functions---------------------------------------

// Create post
exports.createPost = (req, res, next) => {
    dbQuery("create", { "userId": req.body.userId,
                        "text": req.body.text,
                        "imageUrl": req.body.imageUrl
                         })
    .then(()=>{res.status(201).json({message: "Post created successfully !!"});})
    .catch((error)=>{res.status(400).json({message: " error: " + error})
    });
};

// Read posts
exports.getPosts = (req, res, next) => {
    // If req.params.id doesn't exists, return all posts
    if ( req.params.id ){ id = req.params.id } else { id = -1; };   
    dbQuery("select",{ "id": id })
    .then((response)=>{
        if (response == ''){
            res.status(400).json({message: "This post doesn't exist !"})
        }
        else{
            res.status(200).json(response)
        }
    })
    .catch((error)=>{res.status(400).json({message: " error: " + error})
    });

};

// Update a post
exports.updatePost = (req, res, next) => {
    // // get userid of the post to update
    dbQuery("select",{ "id": req.params.id })
    .then((response)=>{
        res.status(200);
        // Verify if the user who wants to modify the post is the one who created it
        if ( response[0].userId === req.auth.userId){
            dbQuery("update",{"id": req.params.id,
                            "text": req.body.text})
            .then(()=>{res.status(201).json({message: "Post updated successfully !!"});}).catch((error)=>{res.status(400).json({message: " error: " + error})});
        } else {
            res.status(400).json({ message: 'Unauthorized request !'});
        }
    })
    .catch((error)=>{res.status(400).json({ message: " error: " + error })
    });
};

// Like or dislike sauce
exports.likePost = (req, res, next) => {
    // Create variables from req.body
    const userId = req.body.userId;
    const like = req.body.like;
  
    // Get the post
    dbQuery("select",{"id": req.params.id})
    // Delete userId from likes or dislikes if it exists
    .then(()=>{
        // Check the likes
       dbQuery("select",{"id": req.params.id, "userId": userId, "like": 1})
       .then((response)=>{
            // If the response is empty, there is no like
            if (response == ''){
                console.log("There is no like from this user");
            }
            // Else remove the like
            else{
                const likes =  JSON.parse(response[0].likes);
                console.log("There is a like from this user");

                for (let i = 0; i < likes.length; i++){
                    if (likes[i] == userId) {
                        dbQuery("update",{"id": req.params.id, "likeId": i.toString()})
                        .catch((error)=>{res.status(400).json({message: " error: " + error})
                        });
                    }
                }
            }
        })
       .catch((error)=>{res.status(400).json({ message: " error: " + error });
       });
        // Check the dislikes
       dbQuery("select",{"id": req.params.id, "userId": userId, "like": -1})
       .then((response)=>{
            // If the response is empty, there is no dislikes
            if (response == ''){
                console.log("There is no dislike from this user");
            }
            // Else remove the dislike
            else{
                console.log("There is a dislike from this user");
                const dislikes =  JSON.parse(response[0].dislikes);

                for (let i = 0; i < dislikes.length; i++){
                    if (dislikes[i] == userId) {
                        dbQuery("update",{"id": req.params.id, "dislikeId": i.toString()})
                        .catch((error)=>{res.status(400).json({message: " error: " + error})
                    });
                    }
                }
            }
        })
       .catch((error)=>{res.status(400).json({ message: " error: " + error });
       });
    })
    .then(()=>{
       dbQuery("update",{"id": req.params.id,"userId": userId, "like": req.body.like })
        .then(() => res.status(200).json({ message: 'Like or dislike added !'}))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

// Delete a post
exports.deletePost = (req, res, next) => {
    // // get userid of the post to delete
    dbQuery("select",{ "id" : req.params.id })
    .then((response)=>{
        res.status(200);
        // Verify if the user who wants to modify the post is the one who created it
        if ( response[0].userId === req.auth.userId){
            dbQuery("delete",{ "id" : req.params.id })
            .then(()=>{res.status(201).json({message: "Post deleted successfully !!"});})
            .catch((error)=>{res.status(400).json({message: " error: " + error})
            });
        } else {
            res.status(400).json({ message: 'Unauthorized request !'});
        }
    })
    .catch((error)=>{res.status(400).json({ message: " error: " + error })
    });
};