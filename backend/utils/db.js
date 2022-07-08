// Import dependancies
const mysql = require('mysql');

// Connexion to database
const pool = require('./dbconnect');
module.exports = {
    dbQuery(queryType, table, args) {
        let queryBase;
        let query;
        if (queryType == 'select') {
            if (table == "users"){
                if (args.email){
                    queryBase = 'SELECT * FROM ?? WHERE ?? = ?';
                    query = mysql.format(queryBase, [table, "email", args.email]);
                }
                else {
                    return {status: 400, message: "The requested email is not valid !!"}; 
                }
            }
            else if (table == "posts"){
        
                if (args.id == -1) {
                    queryBase = 'SELECT * FROM ?? ORDER BY ??';
                    query = mysql.format(queryBase, [table, "time_stamp"]);
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
                    query = mysql.format(queryBase, [table, "id", args.id, jsonTarget, userId, "$"]);
                } 
                else if (!isNaN(args.id)) {
                    queryBase = 'SELECT * FROM ?? WHERE ?? = ?';
                    query = mysql.format(queryBase, [table, "id", args.id]);              
                }
                else { 
                    return {status: 400, message: "The requested id is not valid !!"}; 
                }
            }
            else {
                return {status: 400, message: "The requested table is not valid !!"}; 
            }
        }
        if (queryType == 'create') {
            if (table == 'users'){
                queryBase = 'INSERT INTO ?? (??,??,??) VALUES (?,?,?)';
                query = mysql.format(queryBase,[table, "email", "name", "password", args.email, args.name, args.password]);    
            }
            else if (table == 'posts'){
                const JSON_ARRAY = {toSqlString: function() { return 'JSON_ARRAY()';}};
                queryBase = 'INSERT INTO ?? (??,??,??,??,??) VALUES (?,?,?,?,?)';
                query = mysql.format( queryBase,[ table,"userId", "text", "likes", "dislikes", "imageUrl", args.userId, args.text, JSON_ARRAY, JSON_ARRAY, args.imageUrl ] );
            }
            else {
                return {status: 400, message: "The requested table is not valid !!"}; 
            }
        }
        if ( queryType == 'update' ) {
            if (table == "posts"){
                if (args.id && args.likeId){
                    // Delete like
                    const likeId = '$['+args.likeId+']';
                    queryBase = 'UPDATE ?? SET ??= JSON_REMOVE(??, ?) WHERE ?? = ?';
                    query = mysql.format( queryBase,[ table,"likes", "likes", likeId, "id", args.id]);
                }
                else if (args.dislikeId){
                    // Delete dislike
                    const dislikeId = '$['+args.dislikeId+']';
                    queryBase = 'UPDATE ?? SET ??= JSON_REMOVE(??, ?) WHERE ?? = ?';
                    query = mysql.format( queryBase,[ table,"dislikes", "dislikes", dislikeId, "id", args.id]);
                }
                else if (args.like && args.userId) {
                const userId = args.userId.toString();
                    if (args.like == 1){
                        // Add like
                        queryBase = 'UPDATE ?? SET ?? = JSON_ARRAY_APPEND(??, ?, ?) WHERE ?? = ?';
                        query = mysql.format( queryBase,[ table,"likes", "likes","$", userId, "id", args.id ]);
                    }
                    if (args.like == -1){
                        // Add dislike
                        queryBase = 'UPDATE ?? SET ?? = JSON_ARRAY_APPEND(??, ?, ?) WHERE ?? = ?';
                        query = mysql.format( queryBase,[ table,"dislikes", "dislikes","$",userId, "id", args.id ]);
                    }
                }
                else if (args.id && args.text){
                    queryBase = 'UPDATE ?? SET ?? = ? WHERE ?? = ?';
                    query = mysql.format(queryBase, [table, "text", args.text, "id", args.id]);
                }
                else { 
                    return {message: "The requested id is not valid !!"}; 
                }
            }
            else if (table == "users"){
                queryBase = "UPDATE ?? SET ?? = ?, ?? = ?, ?? = ? WHERE ?? = ?";
                query = mysql.format(queryBase, [table, "email", args.email, "name", args.name, "password", args.password, "id", args.id]);
            }
            else {
                return {status: 400, message: "The requested table is not valid !!"}; 
            }
        }
        if (queryType == 'delete') {
            if (table == "posts") {
                queryBase = 'DELETE FROM ?? WHERE ?? = ?';
                query = mysql.format(queryBase, [table, "id", args.id]);
            }
            else if (table == "users"){
                queryBase = "DELETE FROM ?? WHERE ?? = ?";
                query = mysql.format(queryBase, [table, "id", args.id]);
            }
            else {
                return {status: 400, message: "The requested table is not valid !!"}; 
            }
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