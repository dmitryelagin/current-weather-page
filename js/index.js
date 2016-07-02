// TODO for future
// Refactor this all
// Change pictures changing of preloading



// Location and API functions

function getWeatherData(position, callback) {
  var ask = '';
  switch (position.type) {
    case 'coords':
      ask = 'http://api.openweathermap.org/data/2.5/weather?lat=' +
            position.lati + '&lon=' + position.long +
            '&appid=20e6b4bb024441f12fe889046e1acbd6';
      break;
    case 'ip':
      ask = 'http://api.openweathermap.org/data/2.5/weather?zip=' +
            position.zip + ',' + position.counCode +
            '&appid=20e6b4bb024441f12fe889046e1acbd6';
      break;
    default:
      break;
  }
  $.getJSON(ask, function(weather) {
    callback(weather);
  }).fail(function() {
    callback('weatherError');
  });
}

function getLocation(callback) {
  $.getJSON('http://ip-api.com/json', function(ipLocation) {
    if (ipLocation.message === undefined) callback({
      type: 'ip',
      zip: ipLocation.zip,
      counCode: ipLocation.countryCode
    });
    else callback({
      type: 'error',
      error: ipLocation.message
    });
  }).fail(function() {
    callback({
      type: 'fatalError'
    });
  });
}

function getCoordsOrLocation(callback) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      callback({
        type: 'coords',
        lati: position.coords.latitude,
        long: position.coords.longitude
      });
    }, function() {
      getLocation(callback);
    });
  } else getLocation(callback);
}



// Interface support functions

function getWindDirection(degree) {
  if (degree >= 0 && degree < 22.5 || degree >= 337.5 && degree < 360) return 'N';
  else if (degree >= 22.5 && degree < 67.5) return 'NE';
  else if (degree >= 67.5 && degree < 112.5) return 'E';
  else if (degree >= 112.5 && degree < 157.5) return 'SE';
  else if (degree >= 157.5 && degree < 202.5) return 'S';
  else if (degree >= 202.5 && degree < 247.5) return 'SW';
  else if (degree >= 247.5 && degree < 292.5) return 'W';
  else return 'NW';
}

function tempConvert(temp, isImperial) {
  return isImperial ? temp * 9 / 5 - 459.67 : temp - 273.15;
}

function getTempSign(temp) {
  if (temp > 0 && temp < 100) return '+';
  else if (temp < 0 && temp > -100) return '−';
  else return '';
}

function getTempDecimal(temp) {
  if (temp > -10 && temp < 10) {
    var numStr = parseFloat(Number(temp).toFixed(1)) + '';
    if (numStr.indexOf('.') === -1) return '.0';
    else return numStr.replace(/.*(\.\d)/, '$1');
  }
  else return '';
}

function getWindSpeed(speed, isImperial) {
  if (isImperial) speed *= 2.23694;
  return parseFloat(Number(speed).toFixed(speed < 100 && speed > -100 ? 1 : 0));
}

function formatTime(val) {
  val += '';
  return val.length < 2 ? '0' + val : val;
}



// Functions for inserting info into interface

function setWeatherIcon(code) {
  switch (code) {
    case '01d':
      $('#clear-day').attr('class', 'icon');
      $('#back-img').attr('class', 'clear-day');
      break;
    case '01n':
      $('#clear-night').attr('class', 'icon');
      $('#back-img').attr('class', 'clear-night');
      break;
    case '02d':
      $('#cloudy-day').attr('class', 'icon');
      $('#back-img').attr('class', 'cloudy-day');
      break;
    case '02n':
      $('#cloudy-night').attr('class', 'icon');
      $('#back-img').attr('class', 'cloudy-night');
      break;
    case '03d': case '03n': case '04d': case '04n': case '50d': case '50n':
      $('#overcast').attr('class', 'icon');
      $('#back-img').attr('class', 'overcast');
      break;
    case '10d': case '10n':
      $('#precipitation').attr('class', 'icon');
      $('#back-img').attr('class', 'precipitation');
      break;
    case '09d': case '09n':
      $('#heavy-rain').attr('class', 'icon');
      $('#back-img').attr('class', 'heavy-rain');
      break;
    case '13d': case '13n':
      $('#heavy-snow').attr('class', 'icon');
      $('#back-img').attr('class', 'heavy-snow');
      break;
    case '11d': case '11n':
      $('#storm').attr('class', 'icon');
      $('#back-img').attr('class', 'storm');
      break;
    default:
      break;
  }
}

function showInfo() {
  $('#info, .back-grad').removeClass('empty');
  $('#wait').addClass('empty');
  setTimeout(function() {
    $('#back-img').removeClass('empty');
  }, 500);
}

function weatherOut(weather, isImperial) {
  var temp = tempConvert(weather.main.temp, isImperial);
  var time = new Date(weather.dt * 1000);
  $('#city').text(weather.name);
  $('#country').text(weather.sys.country);
  $('#time').text(formatTime(time.getHours()) + ':' + formatTime(time.getMinutes()));
  $('#date').text(formatTime(time.getDate()) + '/' +
                  formatTime(time.getMonth() + 1) + '/' + time.getFullYear());
  $('#sign').text(getTempSign(temp));
  $('#temp').text(Math.round(Math.abs(temp)));
  $('#temp-decimal').text(isImperial ? '' : getTempDecimal(temp));
  $('#degreeUnit').text(isImperial ? 'F' : 'C');
  $('.icon').attr('class', 'icon hidden');
  setWeatherIcon(weather.weather[0].icon);
  $('#direct').text(getWindDirection(weather.wind.deg));
  $('#speed').text(getWindSpeed(weather.wind.speed, isImperial));
  $('#speedUnit').text(isImperial ? 'm/h' : 'm/s');
}



// Variables, initialization and buttons events

$(document).ready(function() {
  
  var weatherData = {};
  var isImperial = false;
  var refreshSpeed = 720000;
  var slideSpeed = 500;
  
  // Simple images preloading
  var images = [];
  var imagesLinks = [
    'http://cs633627.vk.me/v633627450/163f/fFK--dIxZlU.jpg',
    'http://cs633627.vk.me/v633627450/162b/691NRSEyveI.jpg',
    'http://cs633627.vk.me/v633627450/1653/S2h58MqOwR4.jpg',
    'http://cs628729.vk.me/v628729450/22302/qjwznie_E_g.jpg',
    'http://cs627917.vk.me/v627917450/372f9/MQO8vGSrGVI.jpg',
    'http://cs633627.vk.me/v633627450/1617/-MKNWboCDdM.jpg',
    'http://cs633627.vk.me/v633627450/1667/Sv-o4MoA2zk.jpg',
    'http://cs633627.vk.me/v633627450/160d/M557s8Wc9Rw.jpg',
    'http://cs633627.vk.me/v633627450/165d/xQzi5fIF82U.jpg',
  ];
  for (var i = 0; i < imagesLinks.length; i++) {
    images[i] = new Image();
		images[i].src = imagesLinks[i];
  }
  // End
  
  function refreshWeather() {
    getCoordsOrLocation(function(data) {
      if (data.type === 'fatalError')
        $('#wait').text('Bad connection. Please, try again later.');
      else if (data.type === 'error')
        $('#wait').text('Could not recieve location. Please, enable browser geolocation.');
      else getWeatherData(data, function(weather) {
        if (weather === 'weatherError')
          $('#wait').text('Weather service not responding. Please, try again later.');
        else {
          weatherData = weather;
          weatherOut(weatherData, isImperial);
          showInfo();
        }
      });
    });
  }
  
  refreshWeather();
  var getInfo = setInterval(function() {
    refreshWeather();
  }, refreshSpeed);
  
  $('#changeUnits').on('click', function() {
    isImperial = !isImperial;
    weatherOut(weatherData, isImperial);
    $('#units-btn').text(isImperial ? 'metric' : 'imperial');
  });
  
  $('#changeColor').on('click', function() {
    $('.main').toggleClass('dark');
    $('#color-btn').text($('.main').hasClass('dark') ? 'black' : 'white');
  });
  
  $('#back-img').on('click', function() {
    $('.main, .back-grad').toggleClass('slideOut');
  });
  
});