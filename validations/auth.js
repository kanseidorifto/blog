import { body } from 'express-validator';

export const loginValidation = [
	body('email', 'Incorrect email format').isEmail(),
	body('password', 'Password lenght must be minimum 5 symbols').isLength({ min: 5 }),
];
export const registerValidation = [
	body('email', 'Incorrect email format').isEmail(),
	body('password', 'Password lenght must be minimum 5 symbols').isLength({ min: 5 }),
	body('fullName', 'Password lenght must be minimum 3 symbols').isLength({ min: 3 }),
	body('avatarUrl', 'Incorrect URL for image').optional().isURL(),
];
