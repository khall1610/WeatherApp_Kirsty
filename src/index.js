function refreshWeather(response) {
  let temperatureElement = document.querySelector("#current-temp");
  let temperature = response.data.temperature.current;
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windSpeedElement = document.querySelector("#wind-speed");
  let currentDayElement = document.querySelector("#day");
  let currentTimeElement = document.querySelector("#time");
  let currentDate = new Date();
  let iconElement = document.querySelector("#icon");

  cityElement.innerHTML = response.data.city;
  currentDayElement.innerHTML = formatDay(currentDate);
  currentTimeElement.innerHTML = formatTime(currentDate);
  descriptionElement.innerHTML = titleCase(response.data.condition.description);
  temperatureElement.innerHTML = Math.round(temperature);
  humidityElement.innerHTML = `${response.data.temperature.humidity}%`;
  windSpeedElement.innerHTML = `${response.data.wind.speed}km/h`;
  iconElement.innerHTML =
    iconElement.innerHTML = `<img src="${response.data.condition.icon_url}" class="weather-app-icon" />`;

  getForecast(response.data.city);
}

function formatTime(date) {
  let minutes = date.getMinutes();
  let hours = date.getHours();

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  if (hours < 10) {
    hours = `0${hours}`;
  }
  return `${hours}:${minutes}`;
}

function formatDay(date) {
  let day = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let formattedDay = days[day];
  return `${formattedDay}`;
}

function formatForecastDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"];

  return days[date.getDay()];
}

function searchCity(city) {
  let apiKey = "cfd74d4742a02oe0341423faf5c9a0bt";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(refreshWeather);
}

function handleSearchSubmit(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-form-input");
  searchCity(searchInput.value);
}

function getForecast(city) {
  let apiKey = `cfd74d4742a02oe0341423faf5c9a0bt`;
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;
  axios(apiUrl).then(displayForecast);
}

function displayForecast(response) {
  let forecastHtml = " ";

  response.data.daily.forEach(function (day, index) {
    if (index < 5) {
      forecastHtml =
        forecastHtml +
        `
        <div class="forecast-column">
            <div class="forecast-day">${formatForecastDay(day.time)}</div>
            <img src = "${day.condition.icon_url}" class="forecast-icon" />

            <div class="forecast-temp" id="high-forecast"><strong>${Math.round(
              day.temperature.maximum
            )}°C</strong></div>
            <div class="forecast-temp" id="low-forecast">${Math.round(
              day.temperature.minimum
            )}°C</div>
        </div>
      `;
    }
  });

  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = forecastHtml;
}

let searchFormElement = document.querySelector("#search-form");
searchFormElement.addEventListener("submit", handleSearchSubmit);

function titleCase(str) {
  return str
    .toLowerCase()
    .replace(/(^|\s)\S/g, (firstLetter) => firstLetter.toUpperCase());
}

searchCity("Bath");
