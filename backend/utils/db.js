// Import dependancies
const mysql = require('mysql');

// Connexion to database
const pool = require('./dbconnect');
module.exports = {
    dbQuery(queryType, table, args) {
        let queryBase;
        let query;
        if (queryType == 'select') {
            if (table == "users") {
                if (args.email) {
                    queryBase = 'SELECT * FROM ?? WHERE ?? = ?';
                    query = mysql.format(queryBase, [table, "email", args.email]);
                }
                else if (args.id) {
                    queryBase = 'SELECT * FROM ?? WHERE ?? = ?';
                    query = mysql.format(queryBase, [table, "id", args.id]);
                }
                else {
                    return { status: 400, message: "The requested email is not valid !!" };
                }
            }
            else if (table == "posts") {
                if (args) {
                    const queryBaseEnd = args.id === -1 ? 'ORDER BY `time_stamp` DESC' : 'WHERE ?? = ?';
                    queryBase = 'SELECT ??, ??, ??, ??, ??, ??, ??, ??,?? FROM ?? LEFT JOIN ?? ON ?? = ?? ' + queryBaseEnd;
                    query = mysql.format(queryBase, ["posts.id", "posts.title", "posts.text", "posts.imageUrl", "posts.time_stamp", "posts.likes", "posts.dislikes", "posts.userId", "users.name", table, "users", "users.id", "posts.userId", "posts.id", args.id = args.id]);
                    console.log(query)
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
                queryBase = 'INSERT INTO ?? (??,??,??) VALUES (?,?,?)';
                query = mysql.format(queryBase, [table, "email", "name", "password", args.email, args.name, args.password]);
            }
            else if (table == 'posts') {
                queryBase = 'INSERT INTO ?? (??,??,??,??,??,??) VALUES (?,?,?,?,?,?)';
                query = mysql.format(queryBase, [table, "userId", "title", "text", "imageUrl", "likes", "dislikes", args.userId, args.title, args.text, args.imageUrl, args.likes, args.dislikes]);
                console.log(query)
            }
            else {
                return { status: 400, message: "The requested table is not valid !!" };
            }
        }
        if (queryType == 'update') {
            if (table == "posts") {
                if (args) {
                    queryBase = 'UPDATE ?? SET ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ? WHERE ?? = ?';
                    query = mysql.format(queryBase, [table, "title", args.title, "text", args.text, "imageUrl", args.imageUrl, "likes", args.likes, "dislikes", args.dislikes, "id", args.id]);
                    console.log(query)
                } else {
                    return { message: "The request is not valid !!" };
                }
            }
            else if (table == "users") {
                if (args) {
                    queryBase = "UPDATE ?? SET ?? = ?, ?? = ?, ?? = ? WHERE ?? = ?";
                    query = mysql.format(queryBase, [table, "email", args.email, "name", args.name, "password", args.password, "id", args.id]);
                    console.log(query)
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
                queryBase = 'DELETE FROM ?? WHERE ?? = ?';
                query = mysql.format(queryBase, [table, "id", args.id]);
            }
            else if (table == "users") {
                queryBase = "DELETE FROM ?? WHERE ?? = ?";
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