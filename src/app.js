//Handle weather form submit
const weatherForm = document.getElementById("weather-form");
const countryCodeInput = document.getElementById("country-code");
const zipCodeInput = document.getElementById("zip-code");
const feelingInput = document.getElementById("feeling");
const submitBtn = document.getElementById("submit-btn");

weatherForm.addEventListener("submit", handleWeatherFormSubmit);

function handleWeatherFormSubmit(e) {
  e.preventDefault(); //prevent default form behaviour
  const formValues = getFormValues();
  //fetch weather data by zip code
  fetchWeatherData(formValues);
  setSubmitBtnStatus(true);
}

//In case of data is being submitted disable the submit button to prevent further for submittions
function setSubmitBtnStatus(status) {
  status
    ? submitBtn.setAttribute("disabled", true)
    : submitBtn.removeAttribute("disabled");
}

const errorMessage = document.getElementById("error-message");
const errCode = errorMessage.querySelector("code");
const errMessage = errorMessage.querySelector("message");

function toggleErrorMessage({ code = null, message = null }) {
  errorMessage.classList.toggle("visible");
  if (code) {
    errCode.innerText = code;
    errMessage.innerHTML = message;
  }
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
    `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode},${countryCode}&units=metric&appid=${APIKey}`
  )
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      const failed = data.cod ? true : false;
      if (!failed) {
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
        postDataToServer(newEntryData);
      } else {
        toggleErrorMessage({ code: data.cod, message: data.message });
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

//Post data to the node server
async function postDataToServer(data) {
  await fetch("add-weather", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
    body: JSON.stringify(data),
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      return updateUI(data);
    })
    .catch((error) => console.log(error));
}

// Create a new date instance dynamically with JS
function getPostDate() {
  const d = new Date();
  return d.getMonth() + "." + d.getDate() + "." + d.getFullYear();
}

/* UI Functions */
const historyList = document.getElementById("history-list");
async function updateUI(newEntry) {
  const weatherCardElem = await createWeatherCardElem(newEntry);
  historyList.innerHTML = weatherCardElem + historyList.innerHTML;
  //Remove newly added card styles
  setTimeout(removeNewCardHighlight.bind(this, newEntry.zipCode), 1000);
  resetFormValues();
  setSubmitBtnStatus(false);
}

//Create a card markup template
//Takes 0.155s to update the UI
//Better performance than creating each element individually using "document.createElement()"
//The second method is commented bellow in case it's required to use it

function createWeatherCardElem({
  zipCode,
  countryCode,
  feeling,
  date,
  weather,
}) {
  const template = `<li class="new" id="history-card-${zipCode}">
    <div class="main-info">
      <i class="fas fa-cloud-rain"></i>
      <div class="wrapper">
        <p class="temp">
          <span>${weather.temp}<sup>°</sup></span>
        </p>
        <p class="description">${weather.description}</p>
      </div>
    </div>
    <div class="extra-info">
      <h3 class="country">${countryCode}</h3>
      <time datetime="${date}">${date}</time>
      <p class="min-max">
        <span>min: ${weather.minTemp}<sup>°</sup></span> / 
        <span>max: ${weather.maxTemp}<sup>°</sup></span></p>
    </div>
  </li>`;

  return template;
}

//New added card is highlited in yellow for 1s then it takes the normal syles
function removeNewCardHighlight(zipCode) {
  const card = document.getElementById("history-card-" + zipCode);
  console.log(card);
  card.classList.remove("new");
}

function resetFormValues() {
  countryCodeInput.value = "";
  zipCodeInput.value = "";
  feelingInput.value = "";
}

//Takes 1.15s to update the UI
// function createWeatherCardElem({
//  zipCode,
//   countryCode,
//   feeling,
//   date,
//   weather,
// }) {
//   //creating elements
//   const li = document.createElement("li");
//   const mainInfo = document.createElement("div");
//   const cardIcon = document.createElement("i");
//   const mainInfoWrapper = document.createElement("div");
//   const temprature = document.createElement("p");
//   const degree = document.createElement("span");
//   const degreeSympol = document.createElement("sup");
//   const description = document.createElement("p");
//   const extraInfo = document.createElement("div");
//   const country = document.createElement("h3");
//   const time = document.createElement("time");
//   const minMaxTemp = document.createElement("p");
//   const minTemp = document.createElement("span");
//   const maxTemp = document.createElement("span");

//   // Assigning attributes
//   //Main info
//   li.setAttribute("class", "new");
//   mainInfo.setAttribute("class", "main-info");
//   cardIcon.setAttribute("class", "fas fa-cloud-rain");
//   mainInfoWrapper.setAttribute("class", "wrapper");
//   temprature.setAttribute("class", "temp");
//   description.setAttribute("class", "description");
//   //Extra info
//   extraInfo.setAttribute("class", "extra-info");
//   country.setAttribute("class", "country");
//   time.setAttribute("datetime", date);
//   minMaxTemp.setAttribute("class", "min-max");

//   //Set elements values
//   //Main info
//   degreeSympol.innerText = "°";
//   degree.innerText = weather.temp;
//   degree.appendChild(degreeSympol);
//   temprature.innerHTML = degree;
//   description.innerHTML = weather.description;
//   mainInfoWrapper.appendChild(degree);
//   mainInfoWrapper.appendChild(description);
//   mainInfo.appendChild(cardIcon);
//   mainInfo.appendChild(mainInfoWrapper);

//   //Extra info
//   country.innerText = countryCode;
//   time.innerText = date;
//   minTemp.innerText = "min:" + weather.minTemp;
//   maxTemp.innerText = "max:" + weather.maxTemp;
//   minMaxTemp.appendChild(minMaxTemp);
//   minMaxTemp.appendChild(maxTemp);
//   extraInfo.append(country);
//   extraInfo.append(time);
//   extraInfo.append(minMaxTemp);

//   li.appendChild(mainInfo);
//   li.appendChild(extraInfo);

//   return li;
// }
