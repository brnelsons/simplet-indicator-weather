/**
 * Created by bnelson on 3/3/16.
 */
window.$ = window.jQuery = require('./js/jquery.js');

$(document).ready(function () {

    var shortToLong = {
        'Now': 'Now',
        'Today': 'Today',
        'Mon': 'Monday',
        'Tue': 'Tuesday',
        'Wed': 'Wednesday',
        'Thu': 'Thursday',
        'Fri': 'Friday',
        'Sat': 'Saturday',
        'Sun': 'Sunday'
    }

    function appendWeatherCard(day, label, current, high, low, imageUrl, degUnit) {
        var div = "<div class='weather-card col-xs-2'>";
        div += "<div class='bold centered-label'>" + shortToLong[day] + "</div>";
        if (current != null && current !== undefined)
            div += "<div class='centered-label'><span class='bold'>" + current + "</span>" + degUnit + "</div>";
        if (high != null && high !== undefined && low != null && low !== undefined) {
            div += "<div class='centered-label'>";
            div += "<span class='bold cold'>"+low+"</span>";
            div += "<span>"+degUnit+"</span>";
            div += "<span>/</span>";
            div += "<span class='bold warm'>"+high+"</span>";
            div += "<span>"+degUnit+"</span>";
            div += "</div>";
        }
        div += "<div class='weather-img-div'>";
        div += "<img src=\"" + imageUrl + "\" />";
        div += "</div>";
        if (label != null && label !== undefined)
            div += "<div class='centered-label'>" + label + "</div>";
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