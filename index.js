import express from 'express';
import mongoose from 'mongoose';

import { registerValidation } from './validations/auth.js';
import checkAuth from './utils/checkAuth.js';
import * as UserController from './controllers/UserController.js';

const app = express();

mongoose.set('strictQuery', true);
mongoose
	.connect(
		'mongodb+srv://admin:admin@cluster0.heqxfjv.mongodb.net/blog?retryWrites=true&w=majority',
	)
	.then(() => console.log('DB OK'))
	.catch((err) => console.error('DB Error', err));

app.use(express.json());

app.get('/auth/me', checkAuth, UserController.getMe);
app.post('/auth/login', UserController.login);
app.post('/auth/register', registerValidation, UserController.register);

//run
app.listen(1337, (err) => {
	if (err) {
		return console.log(err);
	}

	console.log('Server OK');
});
