require('./config/config.js');

// Library Imports
const _ = require('lodash'); // Use in PATCH
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

// Local Imports
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;

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

// GET /todos/:id route
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

// DELETE /todos/:id route
app.delete('/todos/:id', (req, res) => {
    // get the id
    var id = req.params.id

    // validatae the id -> not valid? return 404
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    // remove todo by id
    Todo.findByIdAndRemove(id).then((todo) => {
    // success
        // if no doc, send 404
        if (!todo) {
            return res.status(404).send();
        }

        // if doc, send doc back with 200
        res.status(200).send({todo});
    // error
    }, (e) => {
         // 400 with empty body
        res.status(400).send();
    });
});

// PATCH /todos/:id
app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;
    // Specified fields that user can update ('test' and 'completed')
    var body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(id)) {
        return res.status(400).send();
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    // Update to mongodb, use mongdb syntax
    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
        if (!todo) {
            return res.status(404);
        }

        res.send({todo});
    }).catch((e) => {
        res.status(400).send();
    })
});

// POST /users route
app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    })
});

// GET /users/me route
app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

// POST /users/login {email, password} route
app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    
    User.findByCredentials(body.email, body.password).then((user) => {
        user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        });
    }).catch((e) => {
        res.status(400).send();
    });
});

// DELETE /users/me/token route
app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    });
});

app.listen(port, () => {
    console.log(`Started up at port ${port}`);
});

module.exports = {app}; // ES6 Object Syntax