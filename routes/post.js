const router = require("express").Router();
const verify = require("./verifyToken");
const Post = require("../model/Post");
const User = require("../model/User");
const { postValidation } = require("../validation");

router.post("/create", verify, async (req, res) => {
	// Check if user exist
	const userExist = await User.findById(req.user._id);
	if (!userExist) return res.status(400).send("User has been deleted");

	// Validate req body
	const { error } = postValidation.validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	// Create a post
	const newPost = new Post({
		author: req.user._id,
		title: req.body.title,
		description: req.body.description,
	});

	try {
		const savedPost = await newPost.save();
		res.status(200).json(savedPost);
	} catch (err) {
		res.status(400).send(err);
	}
});

// Get post
router.get("/", verify, async (req, res) => {
	const getPosts = await Post.find({ author: req.user._id });
	if (getPosts.length === 0)
		return res.status(400).send("User don't have a post");

	try {
		res.status(200).json(getPosts);
	} catch (err) {
		res.status(400).send(err);
	}
});

// Get post by specific
router.get("/:postId", verify, async (req, res) => {
	const userExist = await User.findById(req.user._id);
	if (!userExist) return res.status(400).send("User has been deleted");

	const post = await Post.findById(req.params.postId);
	if (post.author !== req.user._id)
		return res.status(400).send("You cannot get post someone else");

	try {
		res.status(200).json(post);
	} catch (err) {
		res.status(400).send(err);
	}
});

// Update post
router.put("/update/:postId", verify, async (req, res) => {
	// Check if user exist
	const userExist = await User.findById(req.user._id);
	if (!userExist) return res.status(400).send("User has been deleted");

	const post = await Post.findById(req.params.postId);
	if (post.author !== req.user._id)
		return res.status(400).send("You cannot update post someone else");

	const { error } = postValidation.validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	try {
		const updatedPost = await Post.updateOne(
			{ _id: req.params.postId },
			{
				$set: {
					title: req.body.title,
					description: req.body.description,
				},
			}
		);

		res.status(200).json(updatedPost);
	} catch (err) {
		res.status(400).send(err);
	}
});

// Delete Post
router.delete("/:postId", verify, async (req, res) => {
	const userExist = await User.findById(req.user._id);
	if (!userExist) return res.status(400).send("User has been deleted");

	const post = await Post.findById(req.params.postId);
	if (post.author !== req.user._id)
		return res.status(400).send("You cannot Delete post someone else");

	try {
		const removedPost = await Post.remove({ _id: req.params.postId });
		res.status(200).json(removedPost);
	} catch (err) {
		res.status(400).json({
			message: err,
		});
	}
});

module.exports = router;
