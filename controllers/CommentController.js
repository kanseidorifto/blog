import CommentModel from '../models/Comment.js';
import PostModel from '../models/Post.js';

export const getAll = async (req, res) => {
	try {
		const postId = req.params.id;
		const comments = await CommentModel.find({
			post: postId,
		})
			.populate('user')
			.sort({ createdAt: 'desc' })
			.exec();

		res.json(comments);
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: 'Failed to retrive comments' });
	}
};

export const getAllLastComments = async (req, res) => {
	try {
		const comments = await CommentModel.find()
			.limit(5)
			.populate('user')
			.sort({ createdAt: 'desc' })
			.exec();

		res.json(comments);
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: 'Failed to retrive last comments' });
	}
};

export const create = async (req, res) => {
	try {
		const postId = req.params.id;
		const post = await PostModel.findOne({ _id: postId });
		if (!post) {
			return res.status(404).json({ message: 'Post not found' });
		}
		const doc = new CommentModel({
			text: req.body.text,
			user: req.userId,
			post: postId,
		});

		const comment = await doc.save();

		res.json(comment);
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: 'Failed to create comment' });
	}
};
