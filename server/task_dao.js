'use strict';


const sqlite = require("sqlite3");
const dayjs = require("dayjs");

const db = new sqlite.Database('tasks.db', (err) => { if (err) throw err; });

const localizedFormat = require('dayjs/plugin/localizedFormat');
dayjs.extend(localizedFormat); // use shortcuts 'LLL' for date and time format

function Task(id, description, isUrgent = false, isPrivate = true, deadline = '') {
  this.id = id;
  this.description = description;
  this.urgent = isUrgent;
  this.private = isPrivate;
  // saved as dayjs object
  this.deadline = deadline && dayjs(deadline);
  this.completed = this.completed;
  // dayjs().toString() prints GMT
  // LLL	stands for MMMM D, YYYY h:mm A see https://day.js.org/docs/en/display/format

  this.toString = () => {
    return `Id: ${this.id}, ` +
      `Description: ${this.description}, Urgent: ${this.urgent}, Private: ${this.private}, ` +
      `Deadline: ${this._formatDeadline('LLL')}`;
  }

  this._formatDeadline = (format) => {
    return this.deadline ? this.deadline.format(format) : '<not defined>';
  }
}

exports.getNewID = function () {
  return new Promise((resolve, reject) => {
    let sql = 'SELECT MAX(id) AS result FROM tasks';
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      }
      else {
        resolve(rows.map(record => record.result)[0]+1);
      }
    });
  });
}

exports.createTask = function (task, id) {
  console.log("id ricevuto ");
  console.log(id);
  console.log(task);
  let sql;
  return new Promise((resolve, reject) => {
    sql = 'INSERT INTO tasks(id,description, important, private, deadline, completed,user) VALUES(?,?,?,?,?,?,1)';
    db.all(sql, [id, task.description, task.important, task.private, task.deadline, task.completed], function (err) {
      if (err) {
        reject(err);
      }
      else {
        resolve(id);
      }
    });
  });
}

const createTask = function (row) {
  const privateTask = (row.private === 1) ? true : false;
  const urgent = (row.urgent === 1) ? true : false;
  const completed = (row.completed === 1) ? true : false;
  return new Task(row.tid, row.description, urgent, privateTask, completed, row.deadline);
}


exports.TaskList = function TaskList() {
  this.getAll = (filter) => {
    let sql;
    return new Promise((resolve, reject) => {
      if (filter === undefined)
        sql = 'SELECT * FROM tasks';
      else {
        switch (filter) {
          case 'important':
            sql = 'SELECT * FROM tasks WHERE important=1';
            break;
          case 'private':
            sql = 'SELECT * FROM tasks WHERE private=1';
            break;
          case 'completed':
            sql = 'SELECT * FROM tasks WHERE completed=1';
            break;
        }
      }
      console.log(sql);
      db.all(sql, [], (err, rows) => {
        if (err)
          reject(err);
        else {
          const tasks = rows.map(record => new Task(record.id, record.description, record.important == 1, record.private == 1, record.deadline));
          resolve(tasks);
        }
      });
    });
  };

  this.getAfterDeadline = (deadline) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM tasks WHERE deadline > ?';
      db.all(sql, [deadline.format()], (err, rows) => {
        if (err)
          reject(err);
        else {
          const tasks = rows.map(record => new Task(record.id, record.description, record.important == 1, record.private == 1, record.deadline));
          resolve(tasks);
        }
      });
    });
  };


  /**
 * Get a task with given id
 */
  this.getTask = (id) => {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM tasks WHERE id = ?";
      console.log(sql);
      db.all(sql, [id], (err, rows) => {
        if (err)
          reject(err);
        else if (rows.length === 0)
          resolve(undefined);
        else {
          const task = createTask(rows[0]);
          resolve(task);
        }
      });
    });
  }
  this.getWithWord = (word) => {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM tasks WHERE description LIKE ?";
      db.all(sql, ["%" + word + "%"], (err, rows) => {
        if (err)
          reject(err);
        else {
          const tasks = rows.map(record => new Task(record.id, record.description, record.important == 1, record.private == 1, record.deadline));
          resolve(tasks);
        }
      });
    });
  };
}