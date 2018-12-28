// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb'); // Object Destructuring

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, client) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');
    const db = client.db('TodoApp')

    // deleteMany
    // db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result) => {
    //     console.log(result);
    // });

    // deleteOne
    // db.collection('Todos').deleteOne({text: 'Eat lunch'}).then((result) => {
    //     console.log(result);
    // });

    // findOneAndDelete
    // db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
    //     console.log(result);
    // });

    // Delete Andrew in Users Document
    // db.collection('Users').deleteMany({name: 'Andrew'}).then((result) => {
    //     console.log(result);
    // });

    // Delete Mike by obj _id
    db.collection('Users').findOneAndDelete({
        _id: new ObjectID("5c25a47757a769dd89630846")
    }).then((results) => {
        console.log(JSON.stringify(results, undefined, 2));
    });

    // client.close();
});