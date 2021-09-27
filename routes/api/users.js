const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');

router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'email is required').isEmail(),
    check('password', 'Please enter a password with 6 or more characters.').isLength({ min: 6 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const data = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      };

      const user = new User(data);
      await user.save();
      res.json(user);
    } catch (error) {
      console.log(error.message);
    }
  }
);

module.exports = router;
