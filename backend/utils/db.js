// Import dependancies
const mysql = require('mysql');

// Connexion to database
const pool = require('./dbconnect');
module.exports = {
    // Query to dataBase, queryType and table are string, args is an object
    dbQuery(queryType, table, args) {

        if (queryType == 'select') {
            if (table == "users") {
                if (args.email) {
                    const queryBase = 'SELECT * FROM ?? WHERE ?? = ?';
                    query = mysql.format(queryBase, [table, "email", args.email]);
                }
                else if (args.id) {
                    const queryBase = 'SELECT * FROM ?? WHERE ?? = ?';
                    query = mysql.format(queryBase, [table, "id", args.id]);
                }
                else {
                    return { status: 400, message: "The request is not valid !!" };
                }
            }
            else if (table == "posts") {
                if (args) {
                    const queryBaseEnd = args.id === -1 ? 'ORDER BY `created_at` DESC' : 'WHERE ?? = ?';
                    const queryBase = 'SELECT ??, ??, ??, ??, ??, ??, ?? FROM ?? LEFT JOIN ?? ON ?? = ?? ' + queryBaseEnd;
                    query = mysql.format(queryBase, ["posts.id", "posts.text", "posts.imageUrl", "posts.created_at", "posts.likes", "posts.userId", "users.name", table, "users", "users.id", "posts.userId", "posts.id", args.id = args.id]);
                }
                else {
                    return { status: 400, message: "The request is not valid !!" };
                }
            }
            else {
                return { status: 400, message: "The requested table is not valid !!" };
            }
        }
        if (queryType == 'create') {
            if (table == 'users') {
                const queryBase = 'INSERT INTO ?? (??,??,??) VALUES (?,?,?)';
                query = mysql.format(queryBase, [table, "email", "name", "password", args.email, args.name, args.password]);
            }
            else if (table == 'posts') {
                const queryBase = 'INSERT INTO ?? (??,??,??,??,??) VALUES (?,?,?,?,?)';
                query = mysql.format(queryBase, [table, "userId", "text", "imageUrl", "likes", "created_at", args.userId, args.text, args.imageUrl, args.likes, args.created_at]);
            }
            else {
                return { status: 400, message: "The requested table is not valid !!" };
            }
        }
        if (queryType == 'update') {
            // Update the post but not the likes and dislikes
            if (table == "posts") {
                if (args) {
                    const queryBase = 'UPDATE ?? SET ?? = ?, ?? = ? WHERE ?? = ?';
                    query = mysql.format(queryBase, [table, "text", args.text, "imageUrl", args.imageUrl, "id", args.id]);
                } else {
                    return { message: "The request is not valid !!" };
                }
            }
            else {
                return { status: 400, message: "The requested table is not valid !!" };
            }
        }
        // Only update likes and dislikes in db
        if (queryType === 'like') {
            if (args) {
                const queryBase = 'UPDATE ?? SET ?? = ? WHERE ??= ?'
                query = mysql.format(queryBase, [table, "likes", args.likes, "id", args.id])
            }
            else {
                return { status: 400, message: "The request is  not valid !!" };
            }
        }
        if (queryType == 'delete') {
            if (table == "posts") {
                const queryBase = 'DELETE FROM ?? WHERE ?? = ?';
                query = mysql.format(queryBase, [table, "id", args.id]);
            }
        }

        // When query is prepared, send it to dataBase
        return new Promise((resolve, reject) => {
            pool.query(query, (err, response) => {
                if (err) {
                    reject('An error occured !!');
                }

                resolve(response);
            })
        });
    }
}