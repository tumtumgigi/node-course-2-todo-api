const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

// ES6 Destructuring
const {app} = require('./../server'); // ../ go back one level to server
const {Todo} = require('./../models/todo');

const todos = [{
    _id: new ObjectID(),
    text: 'First test todo',
    completed: false,
    completedAt: 999
}, {
    _id : new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 333
}];



// Make sure the database is empty
beforeEach((done) => {
    Todo.deleteMany({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done()); // Expression Syntax, clear all the db before request
});

// Group the POST routes
describe('POST /todos', () => { // Error Function
    it('should create a new todo', (done) => { // Callback Function because it'll be asynchronous test
    // Create the testing text    
    var text = 'Test todo text';

        // Supertest check post to be text var
        request(app)
            .post('/todos')
            .send({text})
            .expect(200) // Status Code is correct
            .expect((res) => {
                expect(res.body.text).toBe(text); // Response is correct
            })
            // Check if above doesn't error, checking write data to the db
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                // Fetch all todos in collection
                Todo.find({text}).then((todos) => { // Database is correct
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should not create todo with invalid body data', (done) => {
        
        // Supertest check post to be empty
        request(app)
            .post('/todos')
            .send({})
            .expect(400) // Error'll occur when send empty data
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2); // Expect writen data to be empty
                    done();
                }).catch((e) => done(e));
            });
    });
});

// Group the GET /todos routes
describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    })
})

// Group the GET /todos/:id routes
describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('should return 404 if todo not found', (done) => {
        // make sure you get 404 back
        var hexID = new ObjectID().toHexString();

        request(app)
            .get(`/todos/${hexID}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 for non-object ids', (done) => {
        // /todos/123
        request(app)
            .get('/todos/1234')
            .expect(404)
            .end(done);
    });
});

describe('DELETE /todos:id', () => {
    it('should remove a todo', (done) => {
        var hexId = todos[1]._id.toHexString();

        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexId);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                // query database using findById, toNotExist
                Todo.findById(hexId).then((todo) => {
                    // expect(null).toNotExist();
                    expect(todo).toBeFalsy(); // .toNotExist is deprecated
                    done();
                }).catch((e) => done(e));                
            });
    });

    it('should return 404 if todo not found', (done) => {
        var hexId = new ObjectID().toHexString();

        request(app)
            .delete(`/todos/${hexId}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 if object id is invalid', (done) => {
        request(app)
            .delete('/todos/1234')
            .expect(404)
            .end(done);
    });
});

// Group the PATCH /todos/:id routes
describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
        // Grab id of first item
        var hexId = todos[0]._id.toHexString();
        var text = 'This should replace the 1st text'
        // Update text, set completed true
        request(app)
            .patch(`/todos/${hexId}`)
            .send({
                text,
                completed: true
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(true);
                expect(typeof(res.body.todo.completedAt)).toBe('number')
            })
            .end(done);
    });

    it('should clear completedAt when todo is not completed', (done) => {
        // Grab id of second todo item
        var hexId = todos[1]._id.toHexString();
        var text = 'This should be a new text'
        // Update text, set completed to false
        request(app)
            .patch(`/todos/${hexId}`)
            .send({
                completed: false,
                text: text // or just <text> in ES6 Syntax
            })
            .expect(200)
            // text is changed, completed false, completedAt is null .toNotExist
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toBeFalsy();
            })
            .end(done)
    });
});