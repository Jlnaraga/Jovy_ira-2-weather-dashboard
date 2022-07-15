var apiKey = "ea3b6d9f05d682993b7fd9cd27284122";
var apiURL = `https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}`
var day = moment().format('dddd');
var today = moment().format('L');
var searchHistoryList = [];
var queryUrl = `https://api.openweathermap.org/data/3.0/weather?=${cityName}&appid=${apiKey}`;
var iconCode = cityWeatherResponse.weather[0].icon;
var iconURL = `https://openweathermap.org/img/w/${iconCode}.png`;


var getWeatherCity = async function(cityName) {
    return fetch (`https://api.openweathermap.org/data/3.0/weather?=${cityName}&appid=${apiKey}`)
    .then (response => response.jason()) 
    .then(data=>data)
}

var getUvIndex = asyncfunction(latitude,longtitude){
    return fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude={part}&appid=${apiKey}`)
    .then( function(response){ // response +> response.json()
        return response.json()
    })
    .then(data=>data)
}

var getWeatherIcon = function(iconcode) {
    return `https://openweathermap.org/img/w/${iconCode}.png`;
}

var renderCityInfo = async function (cityInfo) {
    var iconCode = cityInfo.weather[0].icon;
    var iconURL = getWeatherIcon(iconCode);
    var uvIndex = await getUvIndex(cityInfo.coord.lon);

    var currentCity = `
    <h2 id="currentCity">
                ${cityInfo.name} <img src="${iconURL}" alt="${cityInfo.weather[0].description}" />
            </h2>
            <h3 id="currentDay">
                ${day} ${today} 
            </h3>
            <p>Temperature: ${cityInfo.main.temp} °F</p>
            <p>Wind Speed: ${cityInfo.wind.speed} MPH</p>
            <p>Humidity: ${cityInfo.main.humidity}\%</p>
            <p>UV Index:
                <span id="uv-index-color" class="px-2 py-2 rounded">${uvIndex.value}</span>
                </p>
        `;


        document.getElementById("city-weather-details").innerHTML = currentCity;
        showColorUvIndex(uvIndex.value);
        displayWeatherContent(true);
        console.log(cityInfo);
}

var showColorUvIndex = function(uvIndex){
    var colorUvIndex = document.getElementById("color-uv-index")
    if (uvIndex > 0 && uvIndex < 3) {
        colorUvIndex.style.backgroundColor = "#3EA72D";
        colorUvIndex.style.color = "white";
    } else if (uvIndex > 3 && uvIndex < 6) {
        colorUvIndex.style.backgroundColor = "#FFF300";
    } else if (uvIndex > 6 && uvIndex < 8) {
        colorUvIndex.style.backgroundColor = "#F18B00";
    } else if (uvIndex > 8 && uvIndex < 11) {
        colorUvIndex.style.backgroundColor = "#E53210"
        colorUvIndex.style.backgroundColor = "white";
    } else {
        colorUvIndex.style.backgroundColor = "#B567A4";
        colorUvIndex.style.color = "white";
    };
}
