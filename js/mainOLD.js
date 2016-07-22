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
