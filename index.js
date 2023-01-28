import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';

import { loginValidation, registerValidation } from './validations/auth.js';
import { postCreateValidation, postUpdateValidation } from './validations/post.js';

import { checkAuth, handleValidationErrors } from './utils/index.js';
import { UserController, PostController } from './controllers/index.js';
import { getLastTags } from './controllers/PostController.js';

const app = express();

const storage = multer.diskStorage({
	destination: (_, __, cb) => {
		cb(null, 'uploads');
	},
	filename: (_, file, cb) => {
		cb(null, file.originalname);
	},
});

const upload = multer({ storage });

//
mongoose.set('strictQuery', true);
mongoose
	.connect(
		'mongodb+srv://admin:admin@cluster0.heqxfjv.mongodb.net/blog?retryWrites=true&w=majority',
	)
	.then(() => console.log('DB OK'))
	.catch((err) => console.error('DB Error', err));

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));
//

app.get('/auth/me', checkAuth, UserController.getMe);
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
//
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
	res.json({ url: `/uploads/${req.file.filename}` });
});
//
app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.patch(
	'/posts/:id',
	checkAuth,
	postUpdateValidation,
	handleValidationErrors,
	PostController.update,
);
app.delete('/posts/:id', checkAuth, PostController.remove);
//
app.get('/tags', getLastTags);

//run
app.listen(1337, (err) => {
	if (err) {
		return console.log(err);
	}

	console.log('Server OK');
});
