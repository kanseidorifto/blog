import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { validationResult } from 'express-validator';

import { registerValidation } from './validations/auth.js';
import UserModel from './models/User.js';
import checkAuth from './utils/checkAuth.js';

const app = express();

mongoose.set('strictQuery', true);
mongoose
	.connect(
		'mongodb+srv://admin:admin@cluster0.heqxfjv.mongodb.net/blog?retryWrites=true&w=majority',
	)
	.then(() => console.log('DB OK'))
	.catch((err) => console.error('DB Error', err));

app.use(express.json());

app.get('/auth/me', checkAuth, async (req, res) => {
	try {
		const user = await UserModel.findById(req.userId);

		if (!user) {
			res.status(404).json({ message: 'User not found' });
		}

		const { passwordHash, ...userData } = user._doc;

		res.json(userData);
	} catch (error) {
		console.log(err);
		res.status(401).json({ message: 'No access' });
	}
});

app.post('/auth/login', async (req, res) => {
	try {
		const user = await UserModel.findOne({ email: req.body.email });

		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		const isValidPassword = await bcrypt.compare(req.body.password, user._doc.passwordHash);

		if (!isValidPassword) {
			return res.status(400).json({ message: 'Incorrect email or password' });
		}

		const token = jwt.sign({ _id: user._id }, 'secret123', { expiresIn: '2h' });

		const { passwordHash, ...userData } = user._doc;

		res.json({ ...userData, token });
	} catch (error) {
		console.log(err);
		res.status(500).json({ message: 'Failed to login' });
	}
});

app.post('/auth/register', registerValidation, async (req, res) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json(errors.array());
		}

		const password = req.body.password;
		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(password, salt);

		const doc = new UserModel({
			email: req.body.email,
			fullName: req.body.fullName,
			avatarUrl: req.body.avatarUrl,
			passwordHash: hash,
		});

		const user = await doc.save();

		const token = jwt.sign({ _id: user._id }, 'secret123', { expiresIn: '2h' });

		const { passwordHash, ...userData } = user._doc;

		res.json({ ...userData, token });
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: 'Failed to register' });
	}
});

//run
app.listen(1337, (err) => {
	if (err) {
		return console.log(err);
	}

	console.log('Server OK');
});
