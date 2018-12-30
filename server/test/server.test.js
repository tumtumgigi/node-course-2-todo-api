const expect = require('expect');
const request = require('supertest');

// ES6 Destructuring
const {app} = require('./../server'); // ../ go back one level to server
const {Todo} = require('./../models/todo');

// Make sure the database is empty
beforeEach((done) => {
    Todo.remove({}).then(() => done()); // Expression Syntax, clear all the db before request
});

// Group the routes
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
                Todo.find().then((todos) => { // Database is correct
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
                    expect(todos.length).toBe(0); // Expect writen data to be empty
                    done();
                }).catch((e) => done(e));
            });
    });
});