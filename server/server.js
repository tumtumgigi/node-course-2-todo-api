// Library Imports
var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');

// Local Imports
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos}); // Promise fullfiled, ES6 Format
    }, (e) => {
        res.status(400).send(e);
    });
});

// GET /todos/123456
app.get('/todos/:id', (req, res) => {
    var id = req.params.id

    // Valid id using isValid
    if (!ObjectID.isValid(id)) {
        // 404 - send back empty body
        return res.status(404).send();
    };

    // findById
    Todo.findById(id).then((todo) => {
    // success
        // if not todo - send back 404 with empty body
        if (!todo) {
            return res.status(404).send();
        };

        // if todo - send it back
        res.send({todo});
    // error
    }, (e) => {
        // 400 - and send empty body back
        res.status(400).send();
    });
});

app.listen(port, () => {
    console.log(`Started up at port ${port}`);
});

module.exports = {app}; // ES6 Object Syntax