function setWeatherIcon(code) {
  function setIcon(id) {
    $(`#${id}`).attr('class', 'icon');
    $('#back-img').attr('class', id);
  }

  switch (code) {
    case '01d': return setIcon('clear-day');
    case '01n': return setIcon('clear-night');
    case '02d': return setIcon('cloudy-day');
    case '02n': return setIcon('cloudy-night');
    case '03d': case '03n': case '04d': case '04n': case '50d': case '50n':
      return setIcon('overcast');
    case '10d': case '10n': return setIcon('precipitation');
    case '09d': case '09n': return setIcon('heavy-rain');
    case '13d': case '13n': return setIcon('heavy-snow');
    case '11d': case '11n': return setIcon('storm');
    default: break;
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
  $('.icon').attr('class', 'icon hidden');
  setWeatherIcon(weather.weather[0].icon);
}



// Variables, initialization and buttons events
$(document).ready(function() {

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

  refreshWeather();
  var getInfo = setInterval(function() {
    refreshWeather();
  }, refreshSpeed);

  $('#changeColor').on('click', function() {
    $('.main').toggleClass('dark');
    $('#color-btn').text($('.main').hasClass('dark') ? 'black' : 'white');
  });

  $('#back-img').on('click', function() {
    $('.main, .back-grad').toggleClass('slideOut');
  });

});
