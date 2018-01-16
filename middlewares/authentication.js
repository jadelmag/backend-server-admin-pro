var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

// ====================
//   Verify Token
// ====================

exports.verifyToken = function(req, res, next) {

    var token = req.query.token;

    jwt.verify(token, SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                message: 'Token invalid',
                errors: err
            });
        }

        req.user = decoded.user;

        next();

    });
}