const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const profileSchema = new mongoose.Schema(
    {
        user: {
            type: ObjectId,
            ref: 'user',
        },
        company: String,
        website: String,
        location: String,
        status: {
            type: String,
            required: true,
        },
        skills: {
            type: [String],
            required: true,
        },
        bio: String,
        githubUserName: String,
        experience: [
            {
                title: {
                    type: String,
                    required: true,
                },
                company: {
                    type: String,
                    required: true,
                },
                location: String,
                from: {
                    type: Date,
                    required: true,
                },
                to: Date,
                current: {
                    type: Boolean,
                    default: false,
                },
                description: String,
            },
        ],
        experience: [
            {
                school: {
                    type: String,
                    required: true,
                },
                degree: {
                    type: String,
                    required: true,
                },
                fieldOfStudy: {
                    type: String,
                    required: true,
                },
                location: String,
                from: {
                    type: Date,
                    required: true,
                },
                to: Date,
                current: {
                    type: Boolean,
                    default: false,
                },
                description: String,
            },
        ],
        social: {
            youtube: String,
            twitter: String,
            facebook: String,
            linkedin: String,
            instagram: String,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = Profile = new mongoose.model('profile', profileSchema);
