//Packages
const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");

//Instantiating the app
const app = express();

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Initialize the main project folder
app.use(express.static("src"));

// Setup Server
const port = 3000;
app.listen(port, listening);

function listening() {
  console.log(`Your app is running on: http://localhost:${port}`);
}

// Setup empty JS object to act as endpoint for all routes
projectData = {};

//API using https://openweathermap.org/
const APIKey = "91944400789044254ef1db1e5cdcd17d";
const APIEndPoint = `api.openweathermap.org/data/2.5/weather?q=`;
