var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var mdAuthentication = require('../middlewares/authentication');

var app = express();

var User = require('../models/user');

// ====================
//   GET All Users
// ====================
app.get('/', (req, res, next) => {

    var from = req.query.from || 0;
    from = Number(from);

    User.find({}, 'name email img role google')
        .skip(from)
        .limit(5)
        .exec(
            (err, users) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Database error',
                        errors: err
                    });
                }

                User.count({}, (err, count) => {
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            message: 'Error: sending with count',
                            errors: err
                        });
                    }

                    res.status(200).json({
                        ok: true,
                        users: users,
                        total: count
                    });
                });
            });
});

// ====================
//   Create User
// ====================
app.post('/', (req, res) => {

    var body = req.body;

    var user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    user.save((err, userSaved) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error while creating User',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            user: userSaved,
            userToken: req.user
        });

    });

});

// ====================
//   Update User
// ====================
app.put('/:id', [mdAuthentication.verifyToken, mdAuthentication.verifySameUserOrAdmin], (req, res) => {

    var id = req.params.id;
    var body = req.body;

    User.findById(id, (err, user) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error finding user',
                errors: err
            });
        }

        if (!user) {
            return res.status(400).json({
                ok: false,
                message: 'Error: User with id ' + id + 'doesnt exist',
                errors: { message: 'Desnt exist an user with this ID' }
            });
        }

        user.name = body.name;
        user.email = body.email;
        user.role = body.role;

        user.save((err, userUpdated) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error to update user',
                    errors: err
                });
            }

            userUpdated.password = ':)';

            res.status(200).json({
                ok: true,
                user: userUpdated
            });
        });
    });
});

// ====================
//   Delete User
// ====================
app.delete('/:id', [mdAuthentication.verifyToken, mdAuthentication.verifyAdmin], (req, res) => {

    var id = req.params.id;

    User.findByIdAndRemove(id, (err, userDeleted) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error deleting user',
                errors: err
            });
        }

        if (!userDeleted) {
            return res.status(400).json({
                ok: false,
                message: 'Error user doesnt exist',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            user: userDeleted
        });
    });
});



module.exports = app;