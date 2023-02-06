import PostModel from '../models/Post.js';

export const getLastTags = async (req, res) => {
	try {
		const posts = await PostModel.find().sort({ createdAt: 'desc' }).limit(5).exec();

		const tags = posts
			.map((post) => post.tags[0])
			.flat()
			.slice(0, 5);

		res.json(tags);
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: 'Failed to retrive tags' });
	}
};

export const getAllBy = async (req, res) => {
	try {
		const tag = req.params.tag;
		const sortBy = req.query.sortBy;

		let posts;
		switch (sortBy) {
			case 'views':
				posts = await PostModel.find({ tags: tag })
					.populate('user')
					.sort({ viewsCount: 'desc' })
					.exec();
				break;
			default: //latest
				posts = await PostModel.find({ tags: tag })
					.populate('user')
					.sort({ createdAt: 'desc' })
					.exec();
		}
		res.json(posts);
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: 'Failed to retrive articles' });
	}
};
