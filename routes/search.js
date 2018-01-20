var express = require('express');
var app = express();

var Hospital = require('../models/hospital');
var Doctor = require('../models/doctor');
var User = require('../models/user');


//=============================
// Search by Collection
//=============================
app.get('/collection/:table/:search', (req, res) => {

    var search = req.params.search;
    var table = req.params.table;
    var regex = new RegExp(search, 'i');

    var promise;

    switch (table) {
        case 'users':
            promise = searchUsers(search, regex);
            break;
        case 'doctors':
            promise = searchDoctors(search, regex);
            break;
        case 'hospitals':
            promise = searchHospitals(search, regex);
            break;
        default:
            return res.status(400).json({
                ok: false,
                message: 'Only search by: users, doctors and hospitals',
                error: { message: 'Type collection/table not valid' }
            });
    }

    promise.then(data => {
        res.status(200).json({
            ok: true,
            [table]: data
        });
    });
});


//=============================
// General Search
//=============================
app.get('/all/:search', (req, res, next) => {

    var search = req.params.search;
    var regex = new RegExp(search, 'i');

    Promise.all([
            searchHospitals(search, regex),
            searchDoctors(search, regex),
            searchUsers(search, regex)
        ])
        .then(response => {

            res.status(200).json({
                ok: true,
                hospitals: response[0],
                doctors: response[1],
                users: response[2]
            });
        });
});

function searchHospitals(tag, regex) {

    return new Promise((resolve, reject) => {

        Hospital.find({ name: regex })
            .populate('user', 'name email img')
            .exec((err, hospitals) => {
                if (err) {
                    reject('Error searching hospitals', err);
                } else {
                    resolve(hospitals);
                }
            });

    });
}

function searchDoctors(tag, regex) {

    return new Promise((resolve, reject) => {

        Doctor.find({ name: regex })
            .populate('user', 'name email img')
            .populate('hospital')
            .exec((err, doctors) => {
                if (err) {
                    reject('Error searching doctors', err);
                } else {
                    resolve(doctors);
                }
            });

    });
}

function searchUsers(tag, regex) {

    return new Promise((resolve, reject) => {

        User.find({}, 'name email role google img')
            .or([{ 'name': regex }, { 'email': regex }])
            .exec((err, users) => {
                if (err) {
                    reject('Error searching users', err);
                } else {
                    resolve(users);
                }
            });
    });
}

module.exports = app;