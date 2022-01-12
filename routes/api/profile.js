const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const request = require('request');
const config = require('config');
const auth = require('../../middlewares/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');

router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', [
            'name',
            'avatar',
        ]);

        if (!profile) {
            return res.status(400).json({ msg: 'There is no profile for this user.' });
        }

        res.json(profile);
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error');
    }
});

router.post(
    '/',
    [
        auth,
        [
            check('status', 'Status is required').not().isEmpty(),
            check('skills', 'Skills is required').not().isEmpty(),
        ],
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            company,
            website,
            location,
            status,
            skills,
            bio,
            githubUserName,
            youtube,
            twitter,
            facebook,
            linkedin,
            instagram,
        } = req.body;

        // Build profile object
        const profileFields = {};
        profileFields.user = req.user.id;
        if (company) profileFields.company = company;
        if (website) profileFields.website = website;
        if (location) profileFields.location = location;
        if (bio) profileFields.bio = bio;
        if (githubUserName) profileFields.githubUserName = githubUserName;
        if (status) profileFields.status = status;
        if (skills) {
            profileFields.skills = skills.split(',').map((skill) => skill.trim());
        }

        // Build social object
        profileFields.social = {};
        if (youtube) profileFields.social.youtube = youtube;
        if (twitter) profileFields.social.twitter = twitter;
        if (facebook) profileFields.social.facebook = facebook;
        if (linkedin) profileFields.social.linkedin = linkedin;
        if (instagram) profileFields.social.instagram = instagram;

        try {
            let profile = await Profile.findOne({ user: req.user.id });
            // Update
            if (profile) {
                profile = await Profile.findOneAndUpdate({ user: req.user.id }, profileFields, {
                    new: true,
                });
                return res.json(profile);
            }

            // Create
            profile = new Profile(profileFields);
            await profile.save();

            res.json(profile);
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Server Error');
        }
    }
);

router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);

        res.json(profiles);
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error');
    }
});

// @desc    Get profile by userId
router.get('/user/:userId', async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.userId }).populate('user', [
            'name',
            'avatar',
        ]);
        if (!profile) return res.status(400).json({ msg: 'Profile not found!' });
        res.json(profile);
    } catch (error) {
        console.log(error.message);

        if (error.kind === 'ObjectId') return res.status(400).json({ msg: 'Profile not found!' });
        res.status(500).send('Server Error');
    }
});

// @desc    Delete profile by userId
router.delete('/', auth, async (req, res) => {
    try {
        await Post.deleteMany({ user: req.user.id });
        await Profile.findOneAndDelete({ user: req.user.id });
        await User.findByIdAndDelete(req.user.id);

        res.json({ msg: 'User deleted' });
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error');
    }
});

// @desc Add experience
router.put(
    '/experience',
    [
        auth,
        [
            check('title', 'Title is required').not().isEmpty(),
            check('company', 'Company is required').not().isEmpty(),
            check('from', 'From is required').not().isEmpty(),
        ],
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, company, location, from, to, current, description } = req.body;

        const newExperience = {
            title,
            location,
            company,
            current,
            description,
            to,
            from,
        };

        try {
            const profile = await Profile.findOne({ user: req.user.id });
            if (!profile) {
                return res.status(404).send('Profile with this user not found.');
            }
            profile.experience.unshift(newExperience);
            await profile.save();
            res.json(profile);
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Server Error');
        }
    }
);

// @desc    Delete experience by experienceId
router.delete('/experience/:experienceId', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        if (!profile) {
            return res.status(404).json({ msg: 'Profile with this user not found.' });
        }

        console.log(typeof profile.experience[0].id);
        // Get remove index
        const removeIndex = profile.experience
            .map((item) => item.id)
            .indexOf(req.params.experienceId);

        if (removeIndex === -1)
            return res.status(404).json({ msg: 'Experience with this id not found.' });

        profile.experience.splice(removeIndex, 1);

        await profile.save();

        res.json(profile);
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error');
    }
});

// @desc Add education
router.put(
    '/education',
    [
        auth,
        [
            check('school', 'School is required').not().isEmpty(),
            check('degree', 'Degree is required').not().isEmpty(),
            check('fieldOfStudy', 'fieldOfStudy is required').not().isEmpty(),
            check('from', 'from is required').not().isEmpty(),
            check('current', 'current is required').not().isEmpty(),
        ],
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { school, degree, fieldOfStudy, from, current, to, description, location } = req.body;

        const newEducation = {
            school,
            degree,
            fieldOfStudy,
            from,
            current,
            to,
            description,
            location,
        };

        try {
            const profile = await Profile.findOne({ user: req.user.id });

            profile.education.unshift(newEducation);
            await profile.save();

            res.json(profile);
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Server Error');
        }
    }
);

// @desc    Delete education by educationId
router.delete('/education/:educationId', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        // Get remove index
        const removeIndex = profile.education
            .map((item) => item.id)
            .indexOf(req.params.educationId);

        if (removeIndex === -1)
            return res.status(404).json({ msg: 'education with this id not found.' });

        profile.education.splice(removeIndex, 1);
        await profile.save();

        res.json(profile);
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error');
    }
});

// @desc    Get user repos from github
router.get('/github/:userName', async (req, res) => {
    try {
        const options = {
            url: `https://api.github.com/users/${
                req.params.userName
            }/repos?per_page=5&sort=created: asc&client_id=${config.get(
                'githubClientId'
            )}&client_secret${config.get('githubSecret')}`,
            method: 'GET',
            headers: {
                'user-agent': 'node.js',
            },
        };

        request(options, (error, response, body) => {
            if (error) console.error(error.message);

            if (response.statusCode !== 200) {
                return res.status(400).json({ msg: 'No github profile found.' });
            }

            res.json(JSON.parse(body));
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
