const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    role: {
        type: String,
        default: "user"
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [3, 'Password must be at least 3 characters']
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
