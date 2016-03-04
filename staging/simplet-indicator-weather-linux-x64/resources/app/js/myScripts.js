/**
 * Created by bnelson on 3/3/16.
 */
window.$ = window.jQuery = require('./js/jquery.js');

$(document).ready(function () {
    function appendWeatherCard(day, label, current, high, low, imageUrl, degUnit) {
        var div = "<div class='weather-card col-xs-2'>";
        div += "<div class='day-label'>" + day + "</div>";
        if (current != null && current !== undefined)
            div += "<div>" + current + degUnit + "</div>";
        if (high != null && high !== undefined && low != null && low !== undefined) {
            div += "<div>";
            div += "<span style='color:#0091EA'>"+low+"</span>";
            div += "<span>"+degUnit+"</span>";
            div += "<span>/</span>";
            div += "<span style='color:#D50000'>"+high+"</span>";
            div += "<span>"+degUnit+"</span>";
            div += "</div>";
        }
        div += "<img src=\"" + imageUrl + "\" />";
        if (label != null && label !== undefined)
            div += "<div>" + label + "</div>";
        div += "</div>";
        $('#main-row').append(div);
    }

    //weather = require('weather-js');
    require('electron').ipcRenderer.on('ping', function (event, message) {
        var weatherData = JSON.parse(message);
        const tempUnit = weatherData.units.temperature;
        const currentWeather = weatherData.item.condition;

        appendWeatherCard(
            "Now",
            currentWeather.text.replace('/', '-\n-'),
            currentWeather.temp,
            null,
            null,
            //"http://icons.wxug.com/i/c/k/" + currentWeather.skytext.replace(' ', '').toLowerCase() + ".gif",
            "http://blob.weather.microsoft.com/static/weather4/en-us/law/" + currentWeather.code + ".gif",
            tempUnit
        );

        $.each(weatherData.item.forecast, function(index, day){
            appendWeatherCard(
                index==0 ? "Today": day.day,
                day.text.replace('/', ' '),
                null,
                day.high,
                day.low,
                "http://blob.weather.microsoft.com/static/weather4/en-us/law/" + day.code + ".gif",
                //"http://icons.wxug.com/i/c/k/" + day.skytextday.replace(' ', '').toLowerCase() + ".gif",
                tempUnit
            );
        });
    });
});

// sample weather JSON
//[
//    {
//        "location": {
//            "name": "Wentzville, MO",
//            "lat": "38.812",
//            "long": "-90.854",
//            "timezone": "-6",
//            "alert": "",
//            "degreetype": "F",
//            "imagerelativeurl": "http://blob.weather.microsoft.com/static/weather4/en-us/"
//        },
//        "current": {
//            "temperature": "42",
//            "skycode": "9",
//            "skytext": "Light Rain",
//            "date": "2016-03-03",
//            "observationtime": "12:20:00",
//            "observationpoint": "Wentzville, MO",
//            "feelslike": "38",
//            "humidity": "92",
//            "winddisplay": "6 mph Northeast",
//            "day": "Thursday",
//            "shortday": "Thu",
//            "windspeed": "6 mph",
//            "imageUrl": "http://blob.weather.microsoft.com/static/weather4/en-us/law/9.gif"
//        },
//        "forecast": [
//            {
//                "low": "38",
//                "high": "45",
//                "skycodeday": "27",
//                "skytextday": "Cloudy",
//                "date": "2016-03-02",
//                "day": "Wednesday",
//                "shortday": "Wed",
//                "precip": ""
//            },
//            {
//                "low": "33",
//                "high": "46",
//                "skycodeday": "26",
//                "skytextday": "Cloudy",
//                "date": "2016-03-03",
//                "day": "Thursday",
//                "shortday": "Thu",
//                "precip": "90"
//            },
//            {
//                "low": "41",
//                "high": "50",
//                "skycodeday": "30",
//                "skytextday": "Partly Sunny",
//                "date": "2016-03-04",
//                "day": "Friday",
//                "shortday": "Fri",
//                "precip": "0"
//            },
//            {
//                "low": "32",
//                "high": "57",
//                "skycodeday": "32",
//                "skytextday": "Sunny",
//                "date": "2016-03-05",
//                "day": "Saturday",
//                "shortday": "Sat",
//                "precip": "0"
//            },
//            {
//                "low": "46",
//                "high": "57",
//                "skycodeday": "28",
//                "skytextday": "Mostly Cloudy",
//                "date": "2016-03-06",
//                "day": "Sunday",
//                "shortday": "Sun",
//                "precip": "60"
//            }
//        ]
//    }
//]