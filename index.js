const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();

// Import routes
const authRoute = require("./routes/auth");
const postRoute = require("./routes/post");

dotenv.config();
app.use(cors());
app.use(express.json());

// Connect to DB
mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGO_CONNECT, () =>
	console.log("Connected to DB")
);

// Route Middlewares
app.use("/api/users/", authRoute);
app.use("/api/posts/", postRoute);
app.use("/", async (req, res) => {
	res.status(200).json({
		message: "POST Request success",
		data: {
			name: "Anang Firmansyah",
			email: "anangfirmansyahp5@gmail.com",
		},
		autho: "Anang Firmansyah",
	});
});

app.listen(process.env.PORT || 3000, () =>
	console.log(`Server running at port ${process.env.PORT || 3000}`)
);
