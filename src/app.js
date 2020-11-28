/* Global variables */
const historyList = document.getElementById("history-list");

//Get project data on page load
(async function getWeatherHistory() {
  const weatherHistory = await fetch("/weather-history")
    .then((res) => res.json())
    .then((data) => {
      for (let entry of data) updateUI({ entry, isNew: false });
    })
    .catch((error) => console.log(error));
})();

//Handle weather form submit
const countryCodeInput = document.getElementById("country-code");
const zipCodeInput = document.getElementById("zip");
const feelingsInput = document.getElementById("feelings");
const submitBtn = document.getElementById("generate");

submitBtn.addEventListener("click", handleWeatherFormSubmit);

function handleWeatherFormSubmit(e) {
  e.preventDefault(); //prevent default form behaviour
  const formValues = getFormValues();
  //fetch weather data by zip code
  fetchWeatherData(formValues);
  //disable submit button until data submittion
  setSubmitBtnStatus(true);
}

//In case of data is being submitted disable the submit button to prevent further for submittions
function setSubmitBtnStatus(status) {
  status
    ? submitBtn.setAttribute("disabled", true)
    : submitBtn.removeAttribute("disabled");
}

//Get form values on submit
function getFormValues() {
  return {
    countryCode: countryCodeInput.value.trim(),
    zipCode: zipCodeInput.value.trim(),
    feelings: feelingsInput.value.trim(),
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
      const failed = data.message ? true : false;

      if (!failed) {
        const newEntryData = {
          zipCode,
          countryCode,
          city: data.name,
          feelings: rest.feelings,
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
        //show error message
        toggleErrorMessage({ code: data.cod, message: data.message });
        //hide error message after 3s
        setTimeout(
          toggleErrorMessage.bind(this, { code: "", message: "" }),
          3000
        );
        setSubmitBtnStatus(false);
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
      return updateUI({ entry: data });
    })
    .catch((error) => console.log(error));
}

// Create a new date instance dynamically with JS
function getPostDate() {
  const d = new Date();
  return d.getMonth() + "." + d.getDate() + "." + d.getFullYear();
}

/* Toggle error message of form submit */
const errorMessage = document.getElementById("error-message");
const errCode = errorMessage.querySelector("#error-message .code");
const errMessage = errorMessage.querySelector("#error-message .messag-content");

function toggleErrorMessage({ code = "", message = "" }) {
  if (code) {
    errorMessage.classList.add("visible");
  } else {
    errorMessage.classList.remove("visible");
  }

  errCode.innerText = code;
  errMessage.innerHTML = message;
}

/* UI Functions */
async function updateUI({ entry, isNew = true }) {
  const weatherCardElem = await createWeatherCardElem({ ...entry, isNew });

  //Remove the element indicatinc that there is no history yet
  removeEmptyHistoryIndicator();

  //Add the new card to the history list
  historyList.innerHTML = weatherCardElem + historyList.innerHTML;

  //If the card is newly added and not loaded from the node server
  if (isNew) {
    //Remove newly added card styles
    setTimeout(removeNewCardHighlight.bind(this, entry.id), 1000);
  }

  //Reset form
  resetFormValues();

  //Change submit button status to NOT disabled
  setSubmitBtnStatus(false);
}

//Create a card markup template
//Takes 0.83s to update the UI
//Better performance than creating each element individually using "document.createElement()"
//The second method is commented bellow in case it's required to use it

function createWeatherCardElem({
  id,
  countryCode,
  city,
  feelings,
  date,
  weather,
  isNew,
}) {
  const template = `<li class="${isNew ? "new" : ""}" id="history-card-${id}">
    <div class="info-wrapper"> 
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
        <h3 class="country">${city}, ${countryCode.toUpperCase()}</h3>
        <time datetime="${date}">${date}</time>
        <p class="min-max">
          <span>min: ${weather.minTemp}<sup>°</sup></span> / 
          <span>max: ${weather.maxTemp}<sup>°</sup></span></p>
      </div>
    </div>
    <button class="feelings-btn" data-card="${id}">😊</button>
    <p class="feelings">${feelings}</p>
  </li>`;

  return template;
}

//New added card is highlited in yellow for 1s then it takes the normal styles
function removeNewCardHighlight(id) {
  const card = document.getElementById("history-card-" + id);
  card.classList.remove("new");
}

//Reset form inputs after submission
function resetFormValues() {
  countryCodeInput.value = "";
  zipCodeInput.value = "";
  feelingsInput.value = "";
}

//Remove empty-history element if the user has added weather readings
const emptyHistory = document.querySelector(".empty-history");

function removeEmptyHistoryIndicator() {
  if (emptyHistory) emptyHistory.remove();
}

//Toggle feelings visibility on emoji cick
historyList.addEventListener("click", toggleFeelingsVisibility);

function toggleFeelingsVisibility(e) {
  const target = e.target;
  if (target.classList.contains("feelings-btn")) {
    const cardId = target.dataset.card;
    const targetFeelingsElem = document.querySelector(
      `#history-card-${cardId} .feelings`
    );

    targetFeelingsElem.classList.toggle("visible");
  }
}

// Takes 1.55s on my machine to update the UI
// function createWeatherCardElem({
//   id,
//   countryCode,
//   city,
//   feelings,
//   date,
//   weather,
//   isNew,
// }) {
//   //creating elements
//   const li = document.createElement("li");
//   const infoWrapper = document.createElement("div");
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
//   const toggleFeelingsBtn = document.createElement("button");
//   const feelingsElem = document.createElement("feelings");

//   // Assigning attributes
//   //Main info
//   isNew ? li.setAttribute("class", "new") : null;
//   li.setAttribute("id", "history-card-" + id);
//   infoWrapper.setAttribute("class", "info-wrapper");
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
//   //feelings
//   toggleFeelingsBtn.setAttribute("class", "feelings-btn");
//   toggleFeelingsBtn.setAttribute("data-card", id);
//   feelingsElem.setAttribute("class", "feelings");

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
//   country.innerText = city + ", " + countryCode.toUpperCase();
//   time.innerText = date;
//   minTemp.innerText = "min:" + weather.minTemp;
//   maxTemp.innerText = "max:" + weather.maxTemp;
//   minMaxTemp.appendChild(minMaxTemp);
//   minMaxTemp.appendChild(maxTemp);
//   extraInfo.append(country);
//   extraInfo.append(time);
//   extraInfo.append(minMaxTemp);
//   //feelings
//   toggleFeelingsBtn.innerText = "😊";
//   feelingsElem.innerText = feelings;

//   infoWrapper.appendChild(mainInfo);
//   infoWrapper.appendChild(extraInfo);

//   li.appendChild(infoWrapper);
//   li.appendChild(toggleFeelingsBtn);
//   li.appendChild(feelingsElem);

//   return li;
// }
