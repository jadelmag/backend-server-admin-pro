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

// ====================
//   Verify Admin
// ====================
exports.verifyAdmin = function(req, res, next) {

    var user = req.user;

    if (user.role === 'ADMIN_ROLE') {
        next();
        return;
    } else {
        return res.status(401).json({
            ok: false,
            message: 'Your not ADMIN',
            errors: { message: 'You dont have admin permissions' }
        });
    }
}

// ====================
//   Verify Admin
// ====================
exports.verifySameUserOrAdmin = function(req, res, next) {

    var user = req.user;
    var id = req.params.id;

    if ((user.role === 'ADMIN_ROLE') || (user._id === id)) {
        next();
        return;
    } else {
        return res.status(401).json({
            ok: false,
            message: 'Your not ADMIN or same user',
            errors: { message: 'You dont have admin or same user permissions' }
        });
    }
}