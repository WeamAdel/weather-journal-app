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
app.use(cors());

// Initialize the main project folder
app.use(express.static("src"));

// Setup Server
const port = 3000;
app.listen(port, listening);

function listening() {
  console.log(`Your app is running on: http://localhost:${port}...`);
}

// Setup empty JS object to act as endpoint for all routes
const projectData = [];

//Get project data
app.get("/weather-history", getWeatherHistory);

function getWeatherHistory(req, res) {
  return res.send(projectData);
}

//Post route to add new weather entry to the project data
app.post("/add-weather", postWeatherData);

function postWeatherData(req, res) {
  const data = req.body;
  const newEntry = {
    id: projectData.length + 1,
    zipCode: data.zipCode,
    countryCode: data.countryCode,
    feelings: data.feelings,
    city: data.city,
    date: data.date,
    weather: data.weather,
  };

  projectData.push(newEntry);

  return res.send(JSON.stringify(newEntry));
}

//GET weather reading
