import PostModel from '../models/Post.js';
import CommentModel from '../models/Comment.js';

export const getAll = async (req, res) => {
	try {
		const sortBy = req.query.sortBy;

		let sort;
		switch (sortBy) {
			case 'views':
				sort = { viewsCount: -1 };
				break;
			default: //latest
				sort = { createdAt: -1 };
		}

		const result = await PostModel.aggregate([
			{
				$lookup: {
					from: 'users',
					localField: 'user',
					foreignField: '_id',
					as: 'user',
				},
			},
			{ $unwind: '$user' },
			{
				$lookup: {
					from: 'comments',
					localField: '_id',
					foreignField: 'post',
					as: 'comment',
				},
			},
			{
				$project: {
					_id: 1,
					title: 1,
					text: 1,
					tags: 1,
					viewsCount: 1,
					commentsCount: { $size: '$comment' },
					'user._id': 1,
					'user.fullName': 1,
					'user.avatarUrl': 1,
					imageUrl: 1,
					createdAt: 1,
					updatedAt: 1,
				},
			},
			{ $sort: sort },
		]);
		res.json(result);
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: 'Failed to retrive articles' });
	}
};

export const getOne = async (req, res) => {
	try {
		const postId = req.params.id;

		PostModel.findOneAndUpdate(
			{
				_id: postId,
			},
			{ $inc: { viewsCount: 1 } },
			{ returnDocument: 'after' },
			(err, doc) => {
				if (err) {
					console.log(err);
					return res.status(500).json({ message: 'Failed to get article' });
				}
				if (!doc) {
					return res.status(404).json({ message: "Article didn't found" });
				}
				return res.json(doc);
			},
		).populate('user');
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: 'Failed to get article' });
	}
};

export const remove = async (req, res) => {
	try {
		const postId = req.params.id;
		// const posts = await PostModel.findOne({_id:postId}).populate('user').exec();
		PostModel.findOneAndDelete(
			{
				_id: postId,
			},
			(err, doc) => {
				if (err) {
					console.log(err);
					return res.status(500).json({ message: 'Failed to delete article' });
				}
				if (!doc) {
					return res.status(404).json({ message: "Article didn't found" });
				}
				return res.json({ success: true });
			},
		);
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: 'Failed to delete article' });
	}
};

export const create = async (req, res) => {
	try {
		const doc = new PostModel({
			title: req.body.title,
			text: req.body.text,
			tags: req.body.tags,
			imageUrl: req.body.imageUrl,
			user: req.userId,
		});

		const post = await doc.save();

		res.json(post);
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: 'Failed to create article' });
	}
};

export const update = async (req, res) => {
	try {
		const postId = req.params.id;

		await PostModel.updateOne(
			{
				_id: postId,
			},
			{
				title: req.body.title,
				text: req.body.text,
				tags: req.body.tags,
				imageUrl: req.body.imageUrl,
				user: req.userId,
			},
		);
		res.json({ success: true });
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: 'Failed to update article' });
	}
};
