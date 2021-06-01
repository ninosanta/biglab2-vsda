'use strict';
const sqlite = require("sqlite3");
const db = new sqlite.Database('users.db', (err) => { if (err) throw err; });
const bcrypt = require('bcrypt');

/**
 * Function to create a User object from a row of the users table
 * @param {*} row a row of the users table
 */

function User(name, email, hash){  
    this.name = name;
    this.email = email;
    this.hash = hash;
}

const createUser = function (row) {
    const name = row.name;
    const email = row.email;
    const hash = row.hash;
    return new User(name, email, hash);
}

exports.getUser = function (email) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM users WHERE email = ?"
        db.all(sql, [email], (err, rows) => {
            if (err) 
                reject(err);
            else if (rows.length === 0)
                resolve(undefined);
            else{
                const user = createUser(rows[0]);
                bcrypt.compare(password, user.hash).then(result => {
                    if(result)
                        resolve(user);
                    else
                        resolve(false);
                })
                resolve(user);
            }
        });
    });
  };
