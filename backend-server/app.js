// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Initialize vars
var app = express();

// Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Import Routes
var appRoutes = require('./routes/app');
var loginRoutes = require('./routes/login');
var userRoutes = require('./routes/user');
var doctorRoutes = require('./routes/doctor');
var hospitalRoutes = require('./routes/hospital');
var searchRoutes = require('./routes/search');
var uploadRoutes = require('./routes/upload');
var imagesRoutes = require('./routes/images');

// Database connection
mongoose.connection.openUri('mongodb://localhost:27017/HospitalDB', (err, res) => {

    if (err) throw errr;

    console.log('Database running on port 27017: \x1b[32m%s\x1b[0m', 'online');
});

// Server index config
// var serveIndex = require('serve-index');
// app.use(express.static(__dirname + '/'));
// app.use('/uploads', serveIndex(__dirname + '/uploads'));

// Routes
app.use('/img', imagesRoutes);
app.use('/upload', uploadRoutes);
app.use('/search', searchRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/doctor', doctorRoutes);
app.use('/user', userRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);

// Listen requires
app.listen(8080, () => {
    console.log('Express server running on port 8080: \x1b[32m%s\x1b[0m', 'online');
});