'use strict';
const express = require('express');
const TaskDao = require('./task_dao');
const morgan = require('morgan');

const passport = require("passport");
const passportLocal = require("passport-local");
const session = require("express-session");  // initializated down in the file with other middlewares

const userDao = require("./user_dao");  // module for check username and password

const PORT = 3001;
let app = new express();

app.use(morgan('tiny'));
app.use(express.json());

//GET /tasks/all/<filter>
app.get('/api/tasks/all/:filter', (req, res) => {
    TaskDao.getAll(req.params.filter)
        .then((tasks) => {
            res.json(tasks);
        })
        .catch((err) => {
            res.status(500).json({
                errors: [{ 'msg': err }],
            });
        });
});

//GET /tasks/all
app.get('/api/tasks/all', (req, res) => {
    TaskDao.getAll(req.params.filter)
        .then((tasks) => {
            res.json(tasks);
        })
        .catch((err) => {
            res.status(500).json({
                errors: [{ 'msg': err }],
            });
        });
});

//GET /tasks/<taskId>
app.get('/api/tasks/:taskId', (req, res) => {
    TaskDao.getTask(req.params.taskId)
        .then((task) => {
            if (!task)
                res.status(404).send();
            else
                res.json(task);
        })
        .catch((err) => {
            res.status(500).json({
                errors: [{ 'param': 'Server', 'msg': err }],
            });
        });
});

//POST /tasks
app.post('/api/tasks', (req, res) => {
    const task = req.body;
    if (!task) {
        res.status(400).end();
    } else {
        TaskDao.getNewID().then((newID) => {
            TaskDao.createTask(task, newID)
                .then((id) => res.status(201).json({ "id": id }))
                .catch((err) => {
                    res.status(500).json({ errors: [{ 'param': 'Server', 'msg': err }], })
                })
        }
        ).catch((err) => {
            res.status(500).json({ errors: [{ 'param': 'Server', 'msg': err }], })
        });
    }
});

//PUT /tasks/mark/<taskId>
app.put('/api/tasks/mark/:taskId', (req,res) => {
    TaskDao.getTask(req.params.taskId)
        .then((task) => {
            TaskDao.markTask(task.completed? 0 : 1, req.params.taskId)
                .then((result) => res.status(200).end())
                .catch((err) => res.status(500).json({
                    errors: [{'param': 'Server', 'msg': err}],
                }));
        }
        ).catch((err) => res.status(500).json({
            errors: [{'param': 'Server', 'msg': err}],
        }));
});

//PUT /tasks/<taskId>
app.put('/api/tasks/:taskId', (req,res) => {
    const task = req.body;
    if(!task){
        res.status(400).end();
    } else {
        const task = req.body;
        TaskDao.updateTask(task, req.params.taskId)
            .then((result) => res.status(200).end())
            .catch((err) => res.status(500).json({
                errors: [{'param': 'Server', 'msg': err}],
            }));
    }
});

//DELETE /tasks/<taskId>
app.delete('/api/tasks/:taskId', (req,res) => {
    TaskDao.deleteTask(req.params.taskId)
        .then((result) => res.status(204).end())
        .catch((err) => res.status(500).json({
            errors: [{'param': 'Server', 'msg': err}],
        }));
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));

/*** Users APIs ***/

// POST /sessions 
// login
app.post('/api/sessions', function(req, res, next) {
    /* Compared to the example on the slides, here authenticate is used as
     * a normal function instead of a Middleware */
    passport.authenticate('local', (err, user, info) => {
      /* error should be null whenever the authN is good and, 
       * in this case, user will contain the information. */
  
      if (err)
        return next(err);
      
      if (!user) {
        // display wrong login messages
        return res.status(401).json(info);
      }
  
      // OK: success, perform the login
      req.login(user, (err) => {
        if (err)
          return next(err);
        
        // req.user contains the authenticated user, we send all the user info back
        // this is coming from userDao.getUser()
        return res.json(req.user);
      });
    })(req, res, next);
  });

// DELETE /sessions/current 
// logout
app.delete('/api/sessions/current', (req, res) => {
  req.logout();
  res.end();
});

// GET /sessions/current
// check whether the user is logged in or not
app.get('/api/sessions/current', (req, res) => {
  if(req.isAuthenticated()) {
    res.status(200).json(req.user);}
  else
    res.status(401).json({error: 'Unauthenticated user!'});;
});