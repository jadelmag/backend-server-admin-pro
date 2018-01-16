var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');

var app = express();

var User = require('../models/user');
var Doctor = require('../models/doctor');
var Hospital = require('../models/hospital');

// default options
app.use(fileUpload());

app.put('/:type/:id', (req, res) => {

    var type = req.params.type;
    var id = req.params.id;

    var collections = ['hospitals', 'doctors', 'users'];

    if (collections.indexOf(type) < 0) {
        return res.status(400).json({
            ok: false,
            message: 'Collection not allowed',
            errors: { message: 'collection allowed are: ' + collections.join(', ') }
        });
    }

    if (!req.files)
        return res.status(400).json({
            ok: false,
            message: 'No image selected',
            errors: { message: 'You must select an image' }
        });

    // Get filename
    var file = req.files.image;
    var fileSplited = file.name.split('.');
    var extension = fileSplited[fileSplited.length - 1];

    // Extensions Allowed
    var allowdExtensions = ['png', 'jpg', 'gif', 'jepg'];

    if (allowdExtensions.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            message: 'Extension not allowed',
            errors: { message: 'Allowd extensions are ' + allowdExtensions.join(', ') }
        });
    }

    // Nombre de archivo personalizado
    var fileName = `${ id }-${ new Date().getMilliseconds() }.${ extension }`;

    // Mover el archivo del temporal a un path específico
    var path = `./uploads/${ type }/${ fileName }`;

    file.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error moving file to path',
                errrors: err
            });
        }

        uploadByType(type, id, fileName, res);

    });

});


function uploadByType(type, id, fileName, res) {

    if (type === 'users') {
        User.findById(id, (err, user) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error: User not found',
                    errors: err
                });
            }

            if (!user) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error: User not found',
                    errors: { message: 'not exist an user with id' + id }
                });
            }

            var oldPath = './uploads/users/' + user.img;

            if (fs.existsSync(oldPath)) {
                fs.unlink(oldPath);
            }

            user.img = fileName;

            user.save((err, updatedUser) => {

                updatedUser.password = ':)';

                return res.status(200).json({
                    ok: true,
                    message: 'Image User updated',
                    user: updatedUser
                });
            });
        });
    }

    if (type === 'doctors') {
        Doctor.findById(id, (err, doctor) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error: Doctor not found',
                    errors: err
                });
            }

            if (!doctor) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error: Doctor not found',
                    errors: { message: 'not exist an doctor with id' + id }
                });
            }

            var oldPath = './uploads/doctors/' + doctor.img;

            if (fs.existsSync(oldPath)) {
                fs.unlink(oldPath);
            }

            doctor.img = fileName;

            doctor.save((err, updatedDoctor) => {
                return res.status(200).json({
                    ok: true,
                    message: 'Image Doctor updated',
                    doctor: updatedDoctor
                });
            });
        });
    }

    if (type === 'hospitals') {
        Hospital.findById(id, (err, hospital) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error: Hospital not found',
                    errors: err
                });
            }

            if (!hospital) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error: Hospital not found',
                    errors: { message: 'not exist an hospital with id' + id }
                });
            }

            var oldPath = './uploads/hospitals/' + hospital.img;

            if (fs.existsSync(oldPath)) {
                fs.unlink(oldPath);
            }

            hospital.img = fileName;

            hospital.save((err, updatedHospital) => {
                return res.status(200).json({
                    ok: true,
                    message: 'Image Hospital updated',
                    hospital: updatedHospital
                });
            });
        });
    }


}


module.exports = app;