import { body } from 'express-validator';

export const commentCreateValidation = [
	body('text', 'Too short text length').isLength({ min: 1 }).isString(),
];
