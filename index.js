import express from 'express';
import mongoose from 'mongoose';

import { loginValidation, registerValidation } from './validations/auth.js';
import { postCreateValidation, postUpdateValidation } from './validations/post.js';
import checkAuth from './utils/checkAuth.js';
import * as UserController from './controllers/UserController.js';
import * as PostController from './controllers/PostController.js';

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
app.post('/auth/login', loginValidation, UserController.login);
app.post('/auth/register', registerValidation, UserController.register);
//
app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, PostController.create);
app.patch('/posts/:id', checkAuth, PostController.update);
app.delete('/posts/:id', checkAuth, postUpdateValidation, PostController.remove);

//run
app.listen(1337, (err) => {
	if (err) {
		return console.log(err);
	}

	console.log('Server OK');
});
