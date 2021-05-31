"use strict";

const sqlite = require("sqlite3");

const db = new sqlite.Database('tasks.db', (err) => { if (err) throw err; });
const bcrypt = require("bcrypt");

/* DAO operations for validating users */

exports.getUser = (email, password) => {
    // username = email
    return new Promise(
        (resolve, reject) => {
            const query = "SELECT * FROM users WHERE email = ?";
            db.get(query, [email], (err, row) => {
                if(err)
                    reject(err);  // DB error
                else if (row === undefined)
                    resolve(false);  // user not found
                else {
                    /* user found -> password check! */
                    bcrypt.compare(password, row.password).then(
                        result => {
                            if(result)  // password matched!
                                resolve({id: row.id, username: row.email, name: row.name});
                            else
                                resolve(false);  // password did not match!
                        }
                    )
                }
                    
            })
        }
    );
}