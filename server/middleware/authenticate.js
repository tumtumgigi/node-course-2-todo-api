var {User} = require('./../models/user');

var authenticate = (req, res, next) => {
    var token = req.header('x-auth');

    User.findByToken(token).then((user) => {
        if (!user) {
            // Instead of using the res.status... as catch() below
            // we'll stop the process by reject it, skip to catch()
            return Promise.reject();
        }

        req.user = user;
        req.token = token;
        next();
    }).catch((e) => {
        res.status(401).send(); // 401 Authentication is required
    });
};

module.exports = {authenticate}; // Same as authenticate: authenticate