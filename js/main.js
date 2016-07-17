// TODO Rework assets object
const apiKey = '20e6b4bb024441f12fe889046e1acbd6';
const assetsCfg = {
  id: [
    ['01d'], ['01n'], ['02d'], ['02n'],
    ['03d', '03n', '04d', '04n', '50d', '50n'],
    ['10d', '10n'], ['09d', '09n'], ['13d', '13n'], ['11d', '11n'],
  ],
  url: [
    'http://cs633627.vk.me/v633627450/163f/fFK--dIxZlU.jpg',
    'http://cs633627.vk.me/v633627450/162b/691NRSEyveI.jpg',
    'http://cs633627.vk.me/v633627450/1653/S2h58MqOwR4.jpg',
    'http://cs628729.vk.me/v628729450/22302/qjwznie_E_g.jpg',
    'http://cs627917.vk.me/v627917450/372f9/MQO8vGSrGVI.jpg',
    'http://cs633627.vk.me/v633627450/1617/-MKNWboCDdM.jpg',
    'http://cs633627.vk.me/v633627450/1667/Sv-o4MoA2zk.jpg',
    'http://cs633627.vk.me/v633627450/160d/M557s8Wc9Rw.jpg',
    'http://cs633627.vk.me/v633627450/165d/xQzi5fIF82U.jpg',
  ],
};

const amdCfg = {
  baseUrl: 'js/lib',
  paths: { app: '../app' },
  deps: ['knockout', 'mapping'],
  callback(knockout, mapping) {
    const ko = knockout;
    ko.mapping = mapping;
  },
};

require(amdCfg, ['jquery', 'knockout', 'app/weather', 'app/viewmodel'], ($, ko,
    { OpenWeatherMap }, WeatherViewModel
) => {
  const weatherService = new OpenWeatherMap(apiKey);
  let weatherViewModel = {};

  function getWeatherData() {
    // weatherService.requestData().then...
    const {
      name: city, sys: { country }, dt, main: { temp },
      weather: { 0: { icon } }, wind: { deg, speed },
    } = {  // data;
      coord: {
        lon: 145.77,
        lat: -16.92,
      },
      weather: [{
        id: 803,
        main: 'Clouds',
        description: 'broken clouds',
        icon: '01d',
      }],
      base: 'cmc stations',
      main: {
        temp: 321.55,
        pressure: 1019,
        humidity: 83,
        temp_min: 289.82,
        temp_max: 295.37,
      },
      wind: {
        speed: 65.1,
        deg: 150,
      },
      clouds: {
        all: 75,
      },
      rain: {
        '3h': 3,
      },
      dt: 1435658272,
      sys: {
        type: 1,
        id: 8166,
        message: 0.0166,
        country: 'AU',
        sunrise: 1435610796,
        sunset: 1435650870,
      },
      id: 2172797,
      name: 'Cairns',
      cod: 200,
    };
    return Promise.resolve(
      { city, country, temp, icon, speed, deg, measured: dt * 1000 });
  }

  getWeatherData().then(data => {
    weatherViewModel = new WeatherViewModel(data, assetsCfg);
    ko.applyBindings(weatherViewModel);
  });
});
