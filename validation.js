const Joi = require("joi");

const registerValidation = Joi.object({
	name: Joi.string().min(6).max(255).required(),
	email: Joi.string().email().min(6).max(255).required(),
	password: Joi.string().min(6).max(1024).required(),
});

const loginValidation = Joi.object({
	email: Joi.string().email().min(6).max(255).required(),
	password: Joi.string().min(6).max(1024).required(),
});

const postValidation = Joi.object({
	title: Joi.string().min(6).max(255).required(),
	description: Joi.string().min(15).max(1024).required(),
});

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.postValidation = postValidation;
