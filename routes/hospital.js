var express = require('express');
var app = express();

var mdAuthentication = require('../middlewares/authentication');

var Hospital = require('../models/hospital');

// ====================
//   GET All Hospitals
// ====================
app.get('/', (req, res, next) => {

    var from = req.query.from || 0;
    from = Number(from);

    Hospital.find({})
        .skip(from)
        .limit(5)
        .populate('user', 'name email')
        .exec(
            (err, hospitals) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Error: Not loading Hospital',
                        errors: err
                    });
                }

                Hospital.count({}, (err, count) => {
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            message: 'Error: sending with count',
                            errors: err
                        });
                    }

                    res.status(200).json({
                        ok: true,
                        hospitals: hospitals,
                        total: count
                    });
                });
            });
});

// ====================
//   GET Hospital By Id
// ====================
app.get('/:id', (req, res) => {
    var id = req.params.id;

    Hospital.findById(id)
        .populate('user', 'name img email google')
        .exec((err, hospital) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error searching hospital by id',
                    errors: err
                });
            }

            if (!hospital) {
                return res.status(400).json({
                    ok: false,
                    message: 'Hospital with id: ' + id + 'doesnt exist',
                    errors: { message: 'Doesnt exist the hospitl' }
                });
            }

            return res.status(200).json({
                ok: true,
                hospital: hospital
            });
        });
});

// ====================
//   Create Hospital
// ====================
app.post('/', mdAuthentication.verifyToken, (req, res) => {

    var body = req.body;

    var hospital = new Hospital({
        name: body.name,
        user: req.user._id
    });

    hospital.save((err, savedHospital) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error: creating Hospital',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            hospital: savedHospital
        });

    });

});

// ====================
//   Update Hospital
// ====================
app.put('/:id', mdAuthentication.verifyToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, (err, hospital) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error: finding Hospital',
                errors: err
            });
        }

        if (!hospital) {
            return res.status(400).json({
                ok: false,
                message: 'Error: Hospital doesnt exist',
                errors: err
            });
        }

        hospital.name = body.name;
        hospital.user = req.user._id;

        hospital.save((err, updatedHospital) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error: updating Hospital',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                hospital: updatedHospital
            });
        });
    });
});

// ====================
//   Delete Hospital
// ====================
app.delete('/:id', mdAuthentication.verifyToken, (req, res) => {

    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, deletedHospital) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error deleting Hospital',
                errors: err
            });
        }

        if (!deletedHospital) {
            return res.status(400).json({
                ok: false,
                message: 'Error Hospital doesnt exist',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            hospital: deletedHospital
        });
    });
});


module.exports = app;