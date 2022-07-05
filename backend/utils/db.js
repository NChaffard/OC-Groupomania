// Import dependancies
const mysql = require('mysql');

// Connexion to database
const pool = require('./dbconnect');

exports.select =  function (id = -1) {
    let selectQuery;
    let query;
    if (id ===  -1) {
        // Prepare query
        selectQuery = 'SELECT * FROM ?? ORDER BY ??';
        query = mysql.format(selectQuery, ["posts", "time_stamp"]);
    }
    else if (!isNaN(id)) {
        // Prepare query
        selectQuery = 'SELECT * FROM ?? WHERE ?? = ?';
        query = mysql.format(selectQuery, ["posts", "id", id]);
    } else { return {status: 400, message: "The requested id is not valid !!"}; }

    return new Promise((resolve, reject) => {
        pool.query(query,(err, response) => {
            if (err) {
                reject('An error occured !!');
            }
            if (response == '') {
                reject('id does not exist !');
                
            }
            resolve (response);
        })     
    });
};

exports.create = function (userId, text){
    // Prepare query
    let insertQuery = 'INSERT INTO ?? (??,??) VALUES (?,?)';
    let query = mysql.format(insertQuery,["posts", "userId", "text", userId, text]);
    // Then save the user in database

    return new Promise((resolve, reject) => {
        pool.query(query,(err, response) => {
            if (err) {
                reject('An error occured !!');
            }
            resolve(response);
        });
    });

}

exports.update = function ( id, text) {
    // Prepare query
    let updateQuery = 'UPDATE ?? SET ?? = ? WHERE ?? = ?';
    let query = mysql.format(updateQuery, ["posts", "text", text, "id", id]);
    // Then update post in database
    return new Promise((resolve, reject) => {
        pool.query(query,(err, response) => {
            if (err) { 
                reject('An error occured !!');
            }
            resolve(response);
        });

    });
}

exports.delete = function (id) {
    // Prepare query
    let deleteQuery = 'DELETE FROM ?? WHERE ?? = ?';
    let query = mysql.format(deleteQuery, ["posts", "id", id]);
    // Then delete post in database
    return new Promise((resolve, reject) => {
        pool.query(query,(err, response) => {
            if (err) { 
                reject('An error occured !!');
            }
            resolve(response);
        });
    });
}