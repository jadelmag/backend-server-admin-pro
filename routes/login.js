var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var app = express();

var User = require('../models/user');

var GoogleAuth = require('google-auth-library');
var auth = new GoogleAuth;

const SEED = require('../config/config').SEED;
const GOOGLE_CLIENT_ID = require('../config/config').GOOGLE_CLIENT_ID;
const GOOGLE_SECRET = require('../config/config').GOOGLE_SECRET;

// ===================
// Login Google
// ===================
app.post('/google', (req, res) => {

    var token = req.body.token || 'XXX';

    var client = new auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_SECRET, '');

    client.verifyIdToken(
        token,
        GOOGLE_CLIENT_ID,
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3],
        function(e, login) {

            if (e) {
                return res.status(400).json({
                    ok: false,
                    message: 'Token not valid',
                    errors: e
                });
            }

            var payload = login.getPayload();
            var userid = payload['sub'];
            // If request specified a G Suite domain:
            //var domain = payload['hd'];

            User.findOne({ email: payload.email }, (err, user) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Error: User not found',
                        errors: err
                    });
                }

                if (user) {
                    if (user.google === false) {
                        return res.status(400).json({
                            ok: false,
                            message: 'Error: You must use normal authentication'
                        });
                    } else {
                        // Create Token 4 hours
                        user.password = ';)';

                        var token = jwt.sign({ user: user }, SEED, { expiresIn: 14400 });

                        res.status(200).json({
                            ok: true,
                            user: user,
                            token: token,
                            id: user._id,
                            menu: getMenu(user.role)
                        });
                    }
                } else {
                    // If user not exist via email
                    var user = new User();
                    user.name = payload.name;
                    user.email = payload.email;
                    user.password = ';)';
                    user.img = payload.picture;
                    user.role = 'USER_ROLE';
                    user.google = true;

                    user.save((err, userDB) => {
                        if (err) {
                            return res.status(500).json({
                                ok: false,
                                message: 'Error: Could not create user on database'
                            });
                        }

                        if (!userDB) {
                            return res.status(400).json({
                                ok: false,
                                message: 'Error doenst exist user with this email',
                                errors: { message: 'Error doenst exist user with this email' }
                            });
                        }

                        var token = jwt.sign({ user: userDB }, SEED, { expiresIn: 14400 });

                        res.status(200).json({
                            ok: true,
                            user: userDB,
                            token: token,
                            id: userDB._id,
                            menu: getMenu(userDB.role)
                        });

                    });
                }

            });

        });
});

// ===================
// Normal
// ===================
app.post('/', (req, res) => {

    var body = req.body;

    User.findOne({ email: body.email }, (err, userDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error finding user in login',
                errors: err
            });
        }

        if (!userDB) {
            return res.status(400).json({
                ok: false,
                message: 'Error doenst exist user with this email',
                errors: { message: 'Error doenst exist user with this email' }
            });
        }

        if (!bcrypt.compareSync(body.password, userDB.password)) {
            return res.status(400).json({
                ok: false,
                message: 'Error password doesnt match',
                errors: err
            });
        }

        // Create Token 4 hours
        userDB.password = ';)';

        var token = jwt.sign({ user: userDB }, SEED, { expiresIn: 14400 });

        res.status(200).json({
            ok: true,
            user: userDB,
            token: token,
            id: userDB._id,
            menu: getMenu(userDB.role)
        });

    });


});

function getMenu(ROLE) {

    var menu = [{
            title: 'Main',
            icon: 'mdi mdi-gauge',
            submenu: [
                { title: 'Dashboard', url: '/dashboard' },
                { title: 'Profile', url: '/profile' },
                { title: 'Progress', url: '/progress' },
                { title: 'Promises', url: '/promises' },
                { title: 'Rxjs', url: '/rxjs' },
                { title: 'Graphics', url: '/graphics' }
            ]
        },
        {
            title: 'Personal',
            icon: 'mdi mdi-folder-lock-open',
            submenu: [
                // { title: 'Users', url: '/users' },
                { title: 'Doctors', url: '/doctors' },
                { title: 'Hospitals', url: '/hospitals' }
            ]
        }
    ];

    if (ROLE === 'ADMIN_ROLE') {
        menu[1].submenu.unshift({ title: 'Users', url: '/users' });
    }

    return menu;
}

module.exports = app;