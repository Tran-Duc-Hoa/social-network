const express = require('express');
const { log } = require('npmlog');
const router = express.Router();
const User = require('../../models/User');

router.post('/', async (req, res) => {
  try {
    const data = {
      name: 'D.Hoa',
      email: 'abcde@gmail.com',
      password: '123456',
    };

    const user = new User(data);
    user.save();
    res.json(user);
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;
