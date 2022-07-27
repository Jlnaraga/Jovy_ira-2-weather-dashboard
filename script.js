var apiKey = "ea3b6d9f05d682993b7fd9cd27284122";
var apiURL = `https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}`
var day = moment().format('dddd');
var today = moment().format('L');

var getWeatherCity = async function(cityName) {
    return fetch (`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`)
    .then (response => response.json()) 
    .then(data=>data)
}

var getUvIndex = async function(lat, lon) {
    return fetch(`https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`)
    .then(function(response){
        return response.json()
    })
    .then(data=>data)
}

var getWeatherIcon = function(iconCode) {
    return `https://openweathermap.org/img/w/${iconCode}.png`;
}

var getNextFiveDaysForecast = async function (lat, lon) {
    return fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=current,minutely,hourly,alerts&appid=${apiKey}`)
    .then(function(response){
        return response.json()
    })
    .then(data=>data)
}


var renderCityInfo = async function (cityInfo) {
    var iconCode = cityInfo.weather[0].icon;
    var iconURL = getWeatherIcon(iconCode);
    var uvIndex = await getUvIndex(cityInfo.coord.lat, cityInfo.coord.lon);
    var fiveDayForecast = await getNextFiveDaysForecast(cityInfo.coord.lat, cityInfo.coord.lon);
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

    document.getElementById("cityCondition").innerHTML = currentCity;
    showColorUvIndex(uvIndex.value);
    displayWeatherContent(true);
    renderNextFiveDaysForecast(fiveDayForecast);
}

var showColorUvIndex = function(uvIndex){
    var colorUvIndex = document.getElementById("uv-index-color")
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


var getSearchHistory = function (){
    var listofCityNames = localStorage.getItem('searchHistory')
    return listofCityNames === null ? [] : JSON.parse(listofCityNames);
}

var displayWeatherContent = function (isdisplay){
    if (isdisplay===true)
    document.getElementById("currentCondition").style.display = "block";
    else
    document.getElementById("currentCondition").style.display = "none";
}

//local storage
var saveCityNameToLocalStorage = function (cityName){
    let searchHistory = getSearchHistory();
    if(searchHistory.includes(cityName)===false){
        searchHistory.push(cityName);
    }
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
}

var renderSearchHistory = function (){
    var searchHistory = getSearchHistory();
    var searchHistorySection = document.getElementById('previousCities');
    searchHistorySection.innerHTML = "";
    searchHistory.forEach(cityName => {
        var element = document.createElement('li');
        element.style.cursor="pointer";
        element.textContent = cityName;
        element.addEventListener("click", async (Event) => {
            Event.preventDefault();
            var cityInfo = await getWeatherCity(Event.target.textContent);
            renderCityInfo(cityInfo);
        })
        searchHistorySection.append(element);
    })
}

var renderNextFiveDaysForecast = function (fiveDayForecast) {
    document.getElementById("fiveDayCondition").innerHTML = "";
    for(var i = 0; i<5; i++ ){
        const day = fiveDayForecast.daily[i];
        console.log(day)
        var currDate = moment.unix(day.dt).format("MM/DD/YYYY");
        var currDay = moment.unix(day.dt).format("dddd")

        var iconCode = day.weather[0].icon;
        var iconURL = getWeatherIcon(iconCode);

        var element = document.createElement('div');
        element.classList.add("pl-3");
        element.innerHTML = ` 
            <div class="card pl-3 pt-3 mb-3 bg-primary text-light" style="width: 12rem;>
                <div class="card-body">
                    <h5>${currDate}</h5>
                    <h5>${currDay}</h5>
                    <p><img src="${iconURL}" alt="${day.weather[0].description}" /></p>
                    <p>Temp: ${day.temp.day} °F</p>
                    <p>Humidity: ${day.humidity}\%</p>
                    <P>Wind Speed: ${day.wind_speed} MPH</p>
                </div>
            </div>
        `;

        document.getElementById("fiveDayCondition").appendChild(element);
    }
}

//search button event
document.getElementById("searchBtn").addEventListener("click", async (Event)=>{
    Event.preventDefault();
    var cityName = document.getElementById("submitCity").value;
    var cityInfo = await getWeatherCity(cityName);
    renderCityInfo(cityInfo);
    saveCityNameToLocalStorage(cityInfo.name);
    renderSearchHistory();
})

window.addEventListener('load',(Event) => {
    renderSearchHistory();
})