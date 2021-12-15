const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');

const app = express();
// Init middleware
app.use(express.json({ extended: false }));
app.use(helmet());
app.use(cors());
// Connect Database
connectDB();

app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

const PORT = 5000;

app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
