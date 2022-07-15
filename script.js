var apiKey = "ea3b6d9f05d682993b7fd9cd27284122";
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

var getWeatherIcon = function(iconcode) {
    return `https://openweathermap.org/img/w/${iconCode}.png`;
}

var renderCityInfo = function

