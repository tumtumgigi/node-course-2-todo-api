const {ObjectID} = require('mongodb');

const {mongooose} = require('../server/db/mongoose');
const {Todo} = require('../server/models/todo');
const {User} = require('../server/models/user');

// Todo.remove({}) If no queries is specified it'll delete all the data
// Todo.deleteMany({}).then((result) => { // remove is deprecated, use deleteMany instead
//     console.log(result);
// });

// Todo.findOneAndRemove
Todo.findOneAndRemove({_id: '5c2dd6b3302d710f2e824915'}).then((todo) => {

});


// Todo.findByIdAndRemove
Todo.findByIdAndRemove('5c2dd6c0302d710f2e82491b').then((todo) => {
    console.log(todo);
});