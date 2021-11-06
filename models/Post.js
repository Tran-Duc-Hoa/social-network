const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const PostSchema = new Schema(
    {
        user: {
            type: ObjectId,
            ref: 'User',
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        avatar: String,
        likes: [
            {
                user: {
                    type: ObjectId,
                    ref: 'User',
                    required: true,
                },
            },
        ],
        comments: [
            {
                user: {
                    type: ObjectId,
                    ref: 'User',
                    required: true,
                },
                name: String,
                text: {
                    type: String,
                    required: true,
                },
                avatar: String,
            },
        ],
    },
    {
        collection: 'Post',
        timestamps: true,
    }
);

module.exports = Post = new mongoose.model('Post', PostSchema);
