var express = require('express');
var fs = require('fs');

var app = express();

app.get('/:type/:img', (req, res, next) => {

    var type = req.params.type;
    var img = req.params.img;

    var path = `./uploads/${ type }/${ img }`;

    fs.exists(path, success => {
        if (!success) {
            path = './assets/no-img.jpg';
        }

        res.sendfile(path);
    });

});

module.exports = app;