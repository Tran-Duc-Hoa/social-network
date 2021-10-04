const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');

router.post(
	'/',
	[
		check('name', 'Name is required').not().isEmpty(),
		check('email', 'email is required').isEmail(),
		check('password', 'Please enter a password with 6 or more characters.').isLength({
			min: 6,
		}),
	],
	async (req, res) => {
		try {
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				return res.status(400).json({ errors: errors.array() });
			}

			const { name, email, password } = req.body;

			let user = await User.findOne({ email });

			if (user) {
				return res.status(400).json({ errors: [{ msg: 'User already exists.' }] });
			}

			const avatar = gravatar.url(email, {
				s: '200',
				r: 'pg',
				d: 'mm',
			});

			user = new User({
				name,
				email,
				password,
				avatar,
			});

			const salt = await bcrypt.genSalt(10);
			user.password = await bcrypt.hash(password, salt);
			await user.save();

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
