var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var roles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{PATH} role not allowed'
};

var userSchema = new Schema({
    name: { type: String, required: [true, 'Name is required'] },
    email: { type: String, unique: true, required: [true, 'Email is required'] },
    password: { type: String, required: [true, 'Password is required'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLE', enum: roles },
    google: { type: Boolean, required: true, default: false }
});

userSchema.plugin(uniqueValidator, { message: 'Email must be unique' });

module.exports = mongoose.model('User', userSchema);