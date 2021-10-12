const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        avatar: String,
    },
    {
        collection: 'User',
        timestamps: true,
    }
);

module.exports = User = mongoose.model('User', userSchema);
