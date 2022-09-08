const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/urlDB");

// Set up the Schema and model for the MongoDB structure
// We need this in order to find values in our database
const schema = new mongoose.Schema({
	short: String,
	url: String,
});
const url = mongoose.model("URLs", schema);

// This is the rerouting part
// it takes the short handle, looks it up in the database, and returns the URL
app.route("/:url").get((req, res) => {
	const redirect = url.findOne({ short: req.params.url }, (err, response) => {
		if (err) {
			console.log(err);
		} else {
            // TODO What to do if there is no entry?
			res.redirect(response.url);
		}
	});
});

app.route("/").get((req, res) => {
    // TODO create new reroute
	res.send("Hello, world!");
});

app.listen(3000, () => {
	console.log("Server up and running");
});
