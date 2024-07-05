const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const router = express.Router();

app.use(cors());
app.use(express.json());

const conn_str = "mongodb+srv://cu17bcs1796:Krishna3644@register.ov1sqik.mongodb.net/mydatabase?retryWrites=true&w=majority";
mongoose.connect(conn_str)
  .then(() => console.log("Connected successfully to MongoDB"))
  .catch((error) => console.log(error));

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

router.get('/', (req, res) => {
  res.send('App is running..');
});

router.post('/register', async (req, res) => {
  const { fullName, email, password, confirmPassword } = req.body;
  console.log('Received registration data:', req.body);

  if (password !== confirmPassword) {
    console.log('Passwords do not match');
    return res.status(400).json({ msg: 'Passwords do not match' });
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      console.log('User already exists');
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({ fullName, email, password });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();
    console.log('User registered successfully');

    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).send('Server error');
  }
});

router.get('/userdata', async (req, res) => {
  try {
    const data = await User.find();
    res.json(data);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.use('/.netlify/functions/api', router);
module.exports.handler = serverless(app);

// if (process.env.NODE_ENV !== 'production') {
//   const port = process.env.PORT || 9999;
//   app.listen(port, () => {
//     console.log(`Server running on port ${port}`);
//   });
// }
