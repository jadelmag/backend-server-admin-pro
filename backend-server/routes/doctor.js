var express = require('express');
var app = express();

var mdAuthentication = require('../middlewares/authentication');

var Doctor = require('../models/doctor');

// ====================
//   GET All Doctors
// ====================
app.get('/', (req, res, next) => {

    var from = req.query.from || 0;
    from = Number(from);

    Doctor.find({})
        .skip(from)
        .limit(5)
        .populate('user', 'name email')
        .populate('hospital')
        .exec((err, doctors) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error finding Doctors',
                    errors: err
                });
            }

            Doctor.count({}, (err, count) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        message: 'Error: sending with count',
                        errors: err
                    });
                }

                return res.status(200).json({
                    ok: true,
                    doctors: doctors,
                    total: count
                });
            });
        });
});

// ====================
//  Create Doctor
// ====================
app.post('/', mdAuthentication.verifyToken, (req, res) => {

    var body = req.body;

    var doctor = new Doctor({
        name: body.name,
        user: req.user._id,
        hospital: body.hospital
    });

    doctor.save((err, savedDoctor) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error creating doctor',
                errors: err
            });
        }

        return res.status(200).json({
            ok: true,
            doctor: savedDoctor
        });
    });
});


// ====================
//  Update Doctor
// ====================
app.put('/:id', mdAuthentication.verifyToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Doctor.findById(id, (err, updatedDoctor) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error: Finding Doctor',
                errors: err
            });
        }

        if (!updatedDoctor) {
            return res.status(400).json({
                ok: false,
                message: 'Error: Updating Doctor',
                errors: err
            });
        }

        updatedDoctor.name = body.name;
        updatedDoctor.user = req.user._id;
        updatedDoctor.hospital = body.hospital;

        updatedDoctor.save((err, savedDoctor) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error: Saving updated Doctor',
                    errors: err
                });
            }

            return res.status(200).json({
                ok: true,
                doctor: savedDoctor
            });
        });
    });
});

// ====================
//  Remove Doctor
// ====================
app.delete('/:id', mdAuthentication.verifyToken, (req, res) => {

    var id = req.params.id;

    Doctor.findByIdAndRemove(id, (err, removedDoctor) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error: removing Doctor',
                errors: err
            });
        }

        if (!removedDoctor) {
            return res.status(400).json({
                ok: false,
                message: 'Error: finding Doctor to Remove',
                errors: err
            });
        }

        return res.status(200).json({
            ok: true,
            doctor: removedDoctor
        });
    });
});

module.exports = app;