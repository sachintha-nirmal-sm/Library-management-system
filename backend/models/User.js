const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please provide a username'],
        unique: true,
        trim: true
    },
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [6, 'Password must be at least 6 characters long'],
        select: false
    },
    phone: {
        type: String,
        required: [true, 'Please provide a phone number']
    },
    address: {
        type: String,
        required: [true, 'Please provide an address']
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'card'],
        required: true
    },
    cardNumber: {
        type: String,
        required: function() {
            return this.paymentMethod === 'card';
        }
    },
    cvv: {
        type: String,
        required: function() {
            return this.paymentMethod === 'card';
        }
    },
    profilePhoto: {
        type: String
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Set first user as admin
userSchema.pre('save', async function(next) {
    if (this.isNew) {
        const count = await mongoose.model('User').countDocuments();
        if (count === 0) {
            this.role = 'admin';
        }
    }
    next();
});

// Method to compare password
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema); 