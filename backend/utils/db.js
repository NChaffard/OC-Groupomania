// Import dependancies
const mysql = require('mysql');

// Connexion to database
const pool = require('./dbconnect');
module.exports = {
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
                    return { status: 400, message: "The requested email is not valid !!" };
                }
            }
            else if (table == "posts") {
                if (args) {
                    const queryBaseEnd = args.id === -1 ? 'ORDER BY `time_stamp` DESC' : 'WHERE ?? = ?';
                    const queryBase = 'SELECT ??, ??, ??, ??, ??, ??, ??, ?? FROM ?? LEFT JOIN ?? ON ?? = ?? ' + queryBaseEnd;
                    query = mysql.format(queryBase, ["posts.id", "posts.text", "posts.imageUrl", "posts.time_stamp", "posts.likes", "posts.dislikes", "posts.userId", "users.name", table, "users", "users.id", "posts.userId", "posts.id", args.id = args.id]);
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
                query = mysql.format(queryBase, [table, "userId", "text", "imageUrl", "likes", "dislikes", args.userId, args.text, args.imageUrl, args.likes, args.dislikes]);
            }
            else {
                return { status: 400, message: "The requested table is not valid !!" };
            }
        }
        if (queryType == 'update') {
            if (table == "posts") {
                if (args) {
                    const queryBase = 'UPDATE ?? SET ?? = ?, ?? = ?, ?? = ?, ?? = ? WHERE ?? = ?';
                    query = mysql.format(queryBase, [table, "text", args.text, "imageUrl", args.imageUrl, "likes", args.likes, "dislikes", args.dislikes, "id", args.id]);
                } else {
                    return { message: "The request is not valid !!" };
                }
            }
            else if (table == "users") {
                if (args) {
                    const queryBase = "UPDATE ?? SET ?? = ?, ?? = ?, ?? = ? WHERE ?? = ?";
                    query = mysql.format(queryBase, [table, "email", args.email, "name", args.name, "password", args.password, "id", args.id]);
                } else {
                    return { message: "The request is not valid !!" };
                }
            }
            else {
                return { status: 400, message: "The requested table is not valid !!" };
            }
        }
        if (queryType == 'delete') {
            if (table == "posts") {
                const queryBase = 'DELETE FROM ?? WHERE ?? = ?';
                query = mysql.format(queryBase, [table, "id", args.id]);
            }
            else if (table == "users") {
                const queryBase = "DELETE FROM ?? WHERE ?? = ?";
                query = mysql.format(queryBase, [table, "id", args.id]);
            }
            else {
                return { status: 400, message: "The requested table is not valid !!" };
            }
        }
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