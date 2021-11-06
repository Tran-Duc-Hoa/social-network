const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middlewares/auth');
const Post = require('../../models/Post');
const User = require('../../models/User');
const Profile = require('../../models/Profile');

// @route  POST api/posts
// @desc   Create a post
// @access Private
router.post(
    '/',
    [
        auth,
        [
            check('text', 'text must be required').not().isEmpty(),
            check('name', 'name must be required').not().isEmpty(),
        ],
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { text } = req.body;

        try {
            const user = await User.findById(req.user.id).select('-password');
            const { name, avatar, id } = user;

            const newPost = new Post({
                text,
                name,
                avatar,
                user: id,
            });

            await newPost.save();
            res.json(newPost);
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Server Error');
        }
    }
);

// @route  POST api/posts
// @desc   Get all posts
// @access Private
router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error');
    }
});

// @route  POST api/posts/:id
// @desc   Get post by id
// @access Private
router.get('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ msg: 'Post not found.' });
        }

        res.json(post);
    } catch (error) {
        console.log(error.message);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found.' });
        }
        res.status(500).send('Server Error');
    }
});

// @route  DELETE api/posts/:id
// @desc   Delete post by id
// @access Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ msg: 'Post not found.' });
        }

        // Check user
        if (post.user.toString() === req.user.id) {
            return res.status(403).json({ msg: 'Forbidden - User does not have permission.' });
        }
        await Post.findByIdAndDelete(req.params.id);

        res.json(post);
    } catch (error) {
        console.log(error.message);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found.' });
        }
        res.status(500).send('Server Error');
    }
});

// @route  PUT api/posts/like/:id
// @desc   Like a post
// @access Private
router.put('/like/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ msg: 'Post not found.' });
        }

        // Check if the post already been liked
        if (post.likes.filter((like) => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({ msg: 'Post already liked.' });
        }
        post.likes.unshift({ user: req.user.id });
        await post.save();

        res.json(post.likes);
    } catch (error) {
        console.log(error.message);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found.' });
        }
        res.status(500).send('Server Error');
    }
});

// @route  PUT api/posts/unlike/:id
// @desc   Like a post
// @access Private
router.put('/unlike/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ msg: 'Post not found.' });
        }

        // Check if the post already been liked
        if (post.likes.filter((like) => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({ msg: 'Post has not been liked yet.' });
        }

        // Get remove index
        const removeIndex = post.likes.map((item) => item.user.toString()).indexOf(req.user.id);
        post.likes.splice(removeIndex, 1);
        await post.save();

        res.json(post.likes);
    } catch (error) {
        console.log(error.message);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found.' });
        }
        res.status(500).send('Server Error');
    }
});

// @route  POST api/posts/:id/comments
// @desc   Comment on a post
// @access Private
router.post(
    '/:id/comments',
    [auth, [check('text', 'text must be required').not().isEmpty()]],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { text } = req.body;

        try {
            const user = await User.findById(req.user.id).select('-password');
            const post = await Post.findById(req.params.id);

            const newComment = {
                text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id,
            };

            post.comments.unshift(newComment);
            await post.save();

            res.json(post.comments);
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Server Error');
        }
    }
);

// @route  DELETE api/posts/:id/comments/:commentId
// @desc   Comment on a post
// @access Private
router.delete('/:id/comments/:commentId', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        const comment = post.comments.find((comment) => comment.id === req.params.commentId);
        // Make sure comment exists
        if (!comment) {
            return res.status(404).json({ msg: 'Comment does not exist.' });
        }

        // Check user
        if (comment.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized.' });
        }

        // Get remove index
        const removeIndex = post.comments.map((item) => item.user.toString()).indexOf(req.user.id);
        post.comments.splice(removeIndex, 1);
        await post.save();

        res.json(post.comments);
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
