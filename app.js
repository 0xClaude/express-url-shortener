const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/urlDB");

// Set up the Schema and model for the MongoDB structure
// We need this in order to find values in our database
const schema = new mongoose.Schema({
	url: String,
	short: String,
	visits: Number,
});
const model = mongoose.model("urls", schema);

// This is the rerouting part
// it takes the short handle, looks it up in the database, and returns the URL
app.route("/:url").get((req, res) => {
	model.findOne({ short: req.params.url }, (err, docs) => {
		if (err) {
			res.send(err);
			return;
		} else {
			// If no such URL is found, return this
			if (!docs) {
				res.send("No such entry");
				return;
			} else {
				// Update the counter first
				model.updateOne(
					{ short: req.params.url },
					{ views: (docs.views += 1) },
					(updateError, updateResult) => {
						if (updateError) {
							res.send(updateError);
						} else {
                            // if all went well, redirect user
							res.redirect(docs.url);
						}
					}
				);
			}
		}
	});
});

app.route("/").get((req, res) => {
	// TODO a Form to create a new reroute
	res.send("Hello, world!");
});

app.listen(3000, () => {
	console.log("Server up and running");
});
