var env = process.env.NODE_ENV || 'development'; // Use only in heroku

if (env === 'development' || env === 'test') { // The production env won't run it
    var config = require('./config.json');
    var envConfig = config[env];

    // Set the forEach loop for all process.env variable
    Object.keys(envConfig).forEach((key) => {
        process.env[key] = envConfig[key];
    });
}

// We no longer use the following lines, but keep it for edu purpose
// if (env === 'development') {
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI = "mongodb://127.0.0.1:27017/TodoApp"
// } else if (env === 'test') {
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI = "mongodb://127.0.0.1:27017/TodoAppTest"
// }