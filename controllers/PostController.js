import PostModel from '../models/Post.js';

export const getAll = async (req, res) => {
	try {
		const posts = await PostModel.find().populate('user').exec();

		res.json(posts);
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
		);
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
