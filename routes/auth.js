const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../model/User");
const { registerValidation, loginValidation } = require("../validation");

// REGISTER
router.post("/register", async (req, res) => {
	// VALIDATE THE DATA BEFORE WE A USER
	const { error } = registerValidation.validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	// CHECK IF THE USER ALREDY EXIST
	const emailExist = await User.findOne({ email: req.body.email });
	if (emailExist) return res.status(400).send("Email alredy register!");

	// HASH THE PASSWORD
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(req.body.password, salt);

	// CREATE A NEW USER
	const user = new User({
		name: req.body.name,
		email: req.body.email,
		password: hashedPassword,
	});

	try {
		const savedUser = await user.save();
		res.status(200).send({ user: user._id });
	} catch (err) {
		res.status(400).send(err);
	}
});

// LOGIN
router.post("/login", async (req, res) => {
	// Validate the data body
	const { error } = loginValidation.validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	// Chec if the user exist
	const user = await User.findOne({ email: req.body.email });
	if (!user) return res.status(400).send("Email is not found");

	// Password is correct
	const validPass = await bcrypt.compare(req.body.password, user.password);
	if (!validPass) return res.status(400).send("Invalid Password");

	try {
		// Create and assign a token
		const token = jwt.sign({ _id: user._id }, process.env.TOKEN);
		res.header("auth-token", token).send(token);
		// res.status(200).send("Logged in");
	} catch (err) {
		res.status(400).send(err);
	}
});

module.exports = router;
