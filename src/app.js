//Handle weather form submit
const weatherForm = document.getElementById("weather-form");
const countryCodeInput = document.getElementById("country-code");
const zipCodeInput = document.getElementById("zip-code");
const feelingInput = document.getElementById("feeling");

weatherForm.addEventListener("submit", handleWeatherFormSubmit);

function handleWeatherFormSubmit(e) {
  e.preventDefault(); //prevent default form behaviour
  const formValues = getFormValues();
  //fetch weather data by zip code
  fetchWeatherData(formValues);
}

//Get form values on submit
function getFormValues() {
  return {
    countryCode: countryCodeInput.value.trim(),
    zipCode: zipCodeInput.value.trim(),
    feeling: feelingInput.value.trim(),
    date: getPostDate(),
  };
}

//Fetch weather data using https://openweathermap.org/ API
const APIKey = "91944400789044254ef1db1e5cdcd17d";
const APIEndPoint = "";

function fetchWeatherData({ zipCode = 94040, countryCode = "us", ...rest }) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode},${countryCode}&appid=${APIKey}`
  )
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log(data);
      const newEntryData = {
        zipCode,
        countryCode,
        feeling: rest.feeling,
        date: rest.date,
        weather: {
          temp: data.main.temp,
          minTemp: data.main.temp_max,
          maxTemp: data.main.temp_min,
          humidity: data.main.humidity,
          description: data.weather[0].description,
          status: data.weather[0].main,
        },
      };
      console.log(newEntryData);
      postDataToServer(newEntryData);
    })
    .catch((error) => {
      console.log(error);
    });
}

//Post data to the node server
async function postDataToServer(data) {
  fetch("add-weather", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
    body: JSON.stringify(data),
  })
    .then((res) => {
      console.log(res);
      return res.json();
    })
    .then((data) => {
      console.log(data);
    })
    .catch((error) => console.log(error));
}

// Create a new date instance dynamically with JS
function getPostDate() {
  const d = new Date();
  return d.getMonth() + "." + d.getDate() + "." + d.getFullYear();
}

async function updateUI(newEntry) {
  console.log("Updated");
}
