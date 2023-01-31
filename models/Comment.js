import mongoose from 'mongoose';

const CommentSchema = mongoose.Schema(
	{
		text: { type: String, required: true },
		post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
		user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
		score: { type: Number, default: 0, required: true },
	},
	{ timestamps: true },
);

export default mongoose.model('Comment', CommentSchema);
