// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb'); // Object Destructuring

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, client) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');
    const db = client.db('TodoApp')

    // Update the field
    // db.collection('Todos').findOneAndUpdate({
    //     _id: new ObjectID('5c259d9c57a769dd89630653')
    // }, {
    //     $set: {
    //         completed: true
    //     }
    // }, {
    //     returnOriginal: false
    // }).then((result) => {
    //     console.log(result);
    // });

    // Update the field and increment    
    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('5c25a03457a769dd8963070b')
    }, {
        $set: {
            name: 'Tum'
        },
        $inc: {
            age: 1
        }
    }, {
        returnOriginal: false
    }).then((result) => {
        console.log(result);
    });

    // client.close();
});