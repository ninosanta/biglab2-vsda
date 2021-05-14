'use strict';
const express = require('express');
const TaskDao = require('./task_dao');
const morgan = require('morgan');

const PORT = 3001;
let app = new express();

app.use(morgan('tiny'));
app.use(express.json());

let taskList = new TaskDao.TaskList();

//GET /tasks/all/<filter>
app.get('/api/tasks/all/:filter', (req, res) => {
    taskList.getAll(req.params.filter)
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
//TODO: filtri per data
app.get('/api/tasks/all', (req, res) => {
    taskList.getAll(req.params.filter)
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
    taskList.getTask(req.params.taskId)
        .then((course) => {
            if (!course) {
                res.status(404).send();
            } else {
                res.json(course);
            }
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