import { body } from 'express-validator';

export const postCreateValidation = [
	body('title', 'Too short article title').isLength({ min: 1, max: 250 }).isString(),
	body('text', 'Too short text length').isLength({ min: 1 }).isString(),
	body('tags', 'Incorrect tag format (specify an array)').optional().isArray(),
	body('imageUrl', 'Incorrect URL to image').optional().isString(),
];
export const postUpdateValidation = [
	body('title', 'Too short article title').isLength({ min: 1, max: 250 }).isString(),
	body('text', 'Too short text length').isLength({ min: 1 }).isString(),
	body('tags', 'Incorrect tag format (specify an array)').optional().isArray(),
	body('imageUrl', 'Incorrect URL to image').optional().isString(),
];
