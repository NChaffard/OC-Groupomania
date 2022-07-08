// Import dependancies
const mysql = require('mysql');

// Connexion to database
const pool = require('./dbconnect');
module.exports = {
    dbQuery(queryType, args) {
        
        let queryBase;
        let query;
        if (queryType == 'select') {
            if (args.id == -1) {
                queryBase = 'SELECT * FROM ?? ORDER BY ??';
                query = mysql.format(queryBase, ["posts", "time_stamp"]);
            }
            else if (!isNaN(args.id) && args.userId && args.like){
                let jsonTarget;
                if( args.like == 1){
                    jsonTarget = "likes";
                }
                if ( args.like == -1){
                    jsonTarget = "dislikes";
                }
                const userId = '["'+args.userId+'"]';
                queryBase = 'SELECT * FROM ?? WHERE ?? = ? AND JSON_CONTAINS(??, ?,?)';
                query = mysql.format(queryBase, ["posts", "id", args.id, jsonTarget, userId, "$"]);
            } 
            else if (!isNaN(args.id)) {
                queryBase = 'SELECT * FROM ?? WHERE ?? = ?';
                query = mysql.format(queryBase, ["posts", "id", args.id]);
            }
            else { 
                return {status: 400, message: "The requested id is not valid !!"}; 
            }
        }
        if (queryType == 'create') {
            const JSON_ARRAY = {toSqlString: function() { return 'JSON_ARRAY()';}};
            queryBase = 'INSERT INTO ?? (??,??,??,??,??) VALUES (?,?,?,?,?)';
            query = mysql.format( queryBase,[ "posts","userId", "text", "likes", "dislikes", "imageUrl", args.userId, args.text, JSON_ARRAY, JSON_ARRAY, args.imageUrl ] );
        }
        if ( queryType == 'update' ) {
            if (args.id && args.likeId){
                // Delete like
                const likeId = '$['+args.likeId+']';
                queryBase = 'UPDATE ?? SET ??= JSON_REMOVE(??, ?) WHERE ?? = ?';
                query = mysql.format( queryBase,[ "posts","likes", "likes", likeId, "id", args.id]);
            }
           else if (args.dislikeId){
                // Delete dislike
                const dislikeId = '$['+args.dislikeId+']';
                queryBase = 'UPDATE ?? SET ??= JSON_REMOVE(??, ?) WHERE ?? = ?';
                query = mysql.format( queryBase,[ "posts","dislikes", "dislikes", dislikeId, "id", args.id]);
            }
           else if (args.like && args.userId) {
               const userId = args.userId.toString();
                if (args.like == 1){
                    // Add like
                    queryBase = 'UPDATE ?? SET ?? = JSON_ARRAY_APPEND(??, ?, ?) WHERE ?? = ?';
                    query = mysql.format( queryBase,[ "posts","likes", "likes","$", userId, "id", args.id ]);
                }
                if (args.like == -1){
                    // Add dislike
                    queryBase = 'UPDATE ?? SET ?? = JSON_ARRAY_APPEND(??, ?, ?) WHERE ?? = ?';
                    query = mysql.format( queryBase,[ "posts","dislikes", "dislikes","$",userId, "id", args.id ]);
                }
            }
            else if (args.id && args.text){
                queryBase = 'UPDATE ?? SET ?? = ? WHERE ?? = ?';
                query = mysql.format(queryBase, ["posts", "text", args.text, "id", args.id]);
            }
            else { 
                return {message: "The requested id is not valid !!"}; 
            }
        }
        if (queryType == 'delete') {
            queryBase = 'DELETE FROM ?? WHERE ?? = ?';
            query = mysql.format(queryBase, ["posts", "id", args.id]);
        }
        return new Promise((resolve, reject) => {
            pool.query(query,(err, response) => {
                if (err) {
                    reject('An error occured !!');
                }
                
                resolve (response);
            })     
        });
    }
}