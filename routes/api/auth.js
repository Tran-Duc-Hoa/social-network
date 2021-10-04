const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const auth = require('../../middlewares/auth');
const User = require('../../models/User');

router.get('/', auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select('-password');
		res.status(200).json(user);
	} catch (error) {
		console.error(error.message);
		res.status(500).send('Server Error');
	}
});

router.post(
	'/',
	[
		check('email', 'email is required').isEmail(),
		check('password', 'Password is required.').exists(),
	],
	async (req, res) => {
		const { email, password } = req.body;

		try {
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				return res.status(400).json({ errors: errors.array() });
			}

			let user = await User.findOne({ email });

			if (!user) {
				return res.status(400).json({ errors: [{ msg: 'Invalid Credentials.' }] });
			}

			const isMatch = await bcrypt.compare(password, user.password);
			if (!isMatch) {
				return res.status(400).json({ errors: [{ msg: 'Invalid Credentials.' }] });
			}
			const payload = {
				user: {
					id: user.id,
				},
			};

			jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 3600 }, (err, token) => {
				if (err) throw err;
				res.json({ token });
			});
		} catch (error) {
			console.log(error.message);
		}
	}
);

module.exports = router;
