const axios = require('axios');
const credentials = require('./credentials.json');

let getWeatherBtn = document.getElementById("GetWeather");
getWeatherBtn.addEventListener('click' , (event) => {
    displayData();
});

async function displayData() {
    const weatherData = await fetchData();
    const data = getNeededData(weatherData);
    changeLabels(data);
}

function changeLabels(data) {
    let location = document.getElementById('locationText');
    let country = document.getElementById('country');
    let region = document.getElementById('region');
    let time = document.getElementById('time');

    let temp = document.getElementById('temp');
    let condition = document.getElementById('condition');
    let wind = document.getElementById('wind');
    let humidity = document.getElementById('humidity');

    let image = document.getElementById('weatherImage');
    image.setAttribute('src', "https:" + data.icon);

    location.textContent = data.local.name;
    country.textContent = data.local.country;
    region.textContent = data.local.region;
    time.textContent = data.local.time;

    temp.textContent = data.values.temp + "ºC";
    condition.textContent = data.values.condition;
    wind.textContent = data.values.wind_kph + " Kph";
    humidity.textContent = data.values.humidity;
}

function getNeededData(data) {
    let neededData = {
        local: {
            name: data.location.name,
            region: data.location.region,
            country: data.location.country,
            time: data.location.localtime
        },
        values: {
            temp: data.current.temp_c,
            condition: data.current.condition.text,
            wind_kph: data.current.wind_kph,
            humidity: data.current.humidity,
            feelslike: data.current.feelslike_c
        },
        icon: data.current.condition.icon
    };

    return neededData;
}

async function fetchData() {
    try {

        axios.defaults.headers.post['Content-Type'] = 'aplication/json';
        const response = await axios.get('http://api.weatherapi.com/v1/current.json', {
            params: {
                key: credentials.apiKey,
                q: document.getElementById("cityInput").value,
                aqi: "no"
            },
        });

        return response.data;

    } catch (err) {
        console.error('Error fetching data:', err.message);

        if (err.response && err.response.status === 400) {
            window.alert("Type a valid city!");
        }
    }
}