const apiKey = '20e6b4bb024441f12fe889046e1acbd6';

const assets = {
  url: [
    [['01d'], 'http://cs633627.vk.me/v633627450/163f/fFK--dIxZlU.jpg'],
    [['01n'], 'http://cs633627.vk.me/v633627450/162b/691NRSEyveI.jpg'],
    [['02d'], 'http://cs633627.vk.me/v633627450/1653/S2h58MqOwR4.jpg'],
    [['02n'], 'http://cs628729.vk.me/v628729450/22302/qjwznie_E_g.jpg'],
    [['03d', '03n', '04d', '04n', '50d', '50n'],
        'http://cs627917.vk.me/v627917450/372f9/MQO8vGSrGVI.jpg'],
    [['10d', '10n'], 'http://cs633627.vk.me/v633627450/1617/-MKNWboCDdM.jpg'],
    [['09d', '09n'], 'http://cs633627.vk.me/v633627450/1667/Sv-o4MoA2zk.jpg'],
    [['13d', '13n'], 'http://cs633627.vk.me/v633627450/160d/M557s8Wc9Rw.jpg'],
    [['11d', '11n'], 'http://cs633627.vk.me/v633627450/165d/xQzi5fIF82U.jpg'],
  ],
  getUrl(code) {
    return this.url.find(val => val[0].includes(code))[1];
  },
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

require(amdCfg, ['jquery', 'knockout', 'app/weather', 'app/viewmodel'], (
    $, ko, { OpenWeatherMap }, WeatherViewModel
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
      { city, country, temp, icon, speed, deg, dt: dt * 1000 });
  }

  getWeatherData().then(data => {
    weatherViewModel = new WeatherViewModel(
        data, assets, ['dark', 'light', 'color']);
    ko.applyBindings(weatherViewModel);
  });
});
