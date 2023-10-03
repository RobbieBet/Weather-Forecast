
//This will make my previous cities load in from local storage
window.addEventListener('load', function () {
    loadPreviousCities();
});
//This will handle fetching the weather as well as using the previous cities button
document.getElementById('fetchWeather').addEventListener('click', fetchWeatherByInput);

document.getElementById('previousCities').addEventListener('click', function (event) {
    if (event.target && event.target.nodeName === 'LI') {
        const cityName = event.target.textContent;
        fetchWeatherByCityName(cityName);
    }
});

//This will handle using the user's input to fetch weather
function fetchWeatherByInput() {
    const cityName = document.getElementById('city').value;
    fetchWeatherByCityName(cityName);
}


//Here I use my API key for the 5 day forecast I'm using
function fetchWeatherByCityName(cityName) {
    const apiKey = '99f3ac11c887a77188c8b2db35c1b8d1'; 
//The URL of my API so that my code knows where to get it
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`;
//API request
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            displayWeatherData(data);
            saveCity(cityName);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
//This function is involved in actually setting the weather data on the page
function displayWeatherData(data) {
    const weatherDataDiv = document.getElementById('weatherData');
    const dailyForecasts = data.list.filter(item => item.dt_txt.includes('12:00:00'));

    const html = dailyForecasts.map(item => {
        const date = new Date(item.dt * 1000);
        const temperatureInKelvin = item.main.temp;
        const temperatureInCelsius = (temperatureInKelvin - 273.15).toFixed(2);
        const windSpeed = item.wind.speed;
        const humidity = item.main.humidity;

        const weatherDescription = item.weather[0].description;
        const conditionCode = item.weather[0].icon;
        const iconUrl = `http://openweathermap.org/img/w/${conditionCode}.png`;

        return `<div class="forecast">
                    <p>Date: ${date.toDateString()}</p>
                    <p>Temperature: ${temperatureInCelsius}°C</p>
                    <img src="${iconUrl}" alt="${weatherDescription}">
                    <p>Weather: ${weatherDescription}</p>
                    <p>Wind Speed: ${windSpeed} m/s</p>
                    <p>Humidity: ${humidity}%</p>
                    <hr>
                </div>`;
    }).join('');

    weatherDataDiv.innerHTML = html;
}
//This will load the previous cities so the user can quickly select them instead of manually typing them in 
function loadPreviousCities() {
    const previousCitiesList = document.getElementById('previousCities');
    const previousCities = getStoredCities();

    previousCitiesList.innerHTML = previousCities.map(city => `<li class="previous-city">${city}</li>`).join('');
}

function getStoredCities() {
    const storedCities = localStorage.getItem('previousCities');
    return storedCities ? JSON.parse(storedCities) : [];
}
//Saves the city to my list if user has entered it
function saveCity(cityName) {
    let previousCities = getStoredCities();

    if (!previousCities.includes(cityName)) {
        previousCities.push(cityName);
        localStorage.setItem('previousCities', JSON.stringify(previousCities));

        
        loadPreviousCities();
    }
}



