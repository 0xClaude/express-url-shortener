require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const bcrypt = require("bcrypt");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

const saltRounds = 10;

mongoose.connect("mongodb://localhost:27017/urlDB");

// Set up the Schema and model for the MongoDB structure
// We need this in order to find values in our database
const schema = new mongoose.Schema({
	url: String,
	short: String,
	visits: Number,
	//userID: Number // ! Uncomment this when user functionality is implemented
});
const model = mongoose.model("urls", schema);

// Set up the User Schema
const User = new mongoose.Schema({
	login: String,
	password: String,
});

app.route("/register")
	.get((req, res) => {
		res.render("register");
	})
	.post((req, res) => {
		const login = req.body.mail;
		const pass = req.body.password;

		bcrypt.hash(pass, saltRounds, (err, hash) => {
			// TODO Save user to database
		});
	});

app.route("/mylinks")
    .get((req, res) => {
	    // TODO list personal links
        // Check if user is logged in 
});

app.route("/")
	.get((req, res) => {
		// TODO check if the user is logged in, else show login screen
		// TODO create login/register screen
		// TODO a Form to create a new reroute
		res.render("form");
	})
	.post((req, res) => {
		const url = req.body.url;
		const short = genId(5);

		const newUrl = new model({
			url: url,
			short: short,
			visits: 0,
		});
		newUrl.save().then(() => {
			console.log("New entry saved");
		});
		res.render("submitted", { url: short });
	});

// This is the rerouting part
// it takes the short handle, looks it up in the database, and returns the URL
app.route("/:url").get((req, res) => {
	// make a request to mongodb
	model.findOne({ short: req.params.url }, (err, docs) => {
		// filter database errors
		if (err) {
			res.send(err);
			return;
		} else {
			// If no such URL is found, return this
			if (!docs) {
				res.send("No such entry");
				return;
			} else {
				// Update the counter, then redirect
				model.updateOne(
					{ short: req.params.url },
					{ visits: (docs.visits += 1) },
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

// generating random id
// It takes one parameter: number
// how many letters will the word have?

function genId(number) {
	let result = "";
	let chars =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for (let i = 0; i < number; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return result;
}

app.listen(3000, () => {
	console.log("Server up and running");
});
