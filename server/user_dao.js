'use strict';
const sqlite = require("sqlite3");
const db = new sqlite.Database('users.db', (err) => { if (err) throw err; });
const bcrypt = require('bcrypt');

/**
 * Function to create a User object from a row of the users table
 * @param {*} row a row of the users table
 */

function User(id, username, hash) {
    this.username = username;
    this.id = id;
    this.hash = hash;
}

const createUser = function (row) {
    const id = row.id;
    const username = row.username;
    const hash = row.hash;
    return new User(id, username, hash);
}

exports.getUser = function (username, password) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM Users WHERE username = ?"
        db.all(sql, [username], (err, rows) => {
            if (err)
                reject(err);
            else if (rows.length === 0)
                resolve(undefined);
            else {
                const user = createUser(rows[0]);
                bcrypt.compare(password, user.hash).then(result => {
                    if (result)
                        resolve(user);
                    else
                        resolve(false);
                })
                resolve(user);
            }
        });
    });
};

exports.getUserById = function (id) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM Users WHERE id = ?"
        db.all(sql, [id], (err, rows) => {
            if (err) {
                reject(err);
            }
            else if (rows.length === 0) {
                console.log(id);
                resolve(undefined);
            }
            else {
                const user = createUser(rows[0]);
                console.log("ciao");
                console.log(rows[0]);
                resolve(user);
            }
        });
    });
};