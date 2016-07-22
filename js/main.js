// TODO Make exeptions on server failure
// TODO Refactor it later, also make separate config
// TODO Refresh timings are unstable and untested
const apiKey = '20e6b4bb024441f12fe889046e1acbd6';
const dataPrefix = 'data-';
const msPerDay = 86400000;
const refresh = { key: 'serviceRefreshed', rate: 900000 };

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

require(amdCfg, ['knockout', 'jscookie', 'app/weather', 'app/viewmodel'], (
    ko, Cookies, { OpenWeatherMap }, WeatherViewModel
) => {
  const weatherService = new OpenWeatherMap(apiKey);
  let weatherViewModel = {};

  function getWeatherData() {
    function getFromService() {
      console.log('from service');
      return weatherService.requestData().then(data => {
        const {
          name: city, sys: { country }, dt, main: { temp },
          weather: { 0: { icon } }, wind: { deg, speed },
        } = data;
        Cookies.set(refresh.key, Date.now(),
            { expires: refresh.rate / msPerDay });
        return { city, country, temp, icon, speed, deg, dt: dt * 1000 };
      });
    }

    function getFromCookies() {
      console.log('from cookie');
      const cookie = Cookies.get();
      const data = {};
      Object.keys(cookie)
          .filter(key => key.startsWith(dataPrefix))
          .forEach(key => {
            data[key.replace(dataPrefix, '')] = +cookie[key] || cookie[key];
          });
      return Promise.resolve(data);
    }

    return Cookies.get(refresh.key) ? getFromCookies() : getFromService();
  }

  function refreshData() {
    getWeatherData().then(data => ko.mapping.fromJS(data, weatherViewModel));
  }

  getWeatherData().then(data => {
    weatherViewModel = new WeatherViewModel(data, assets,
        ['dark', 'light', 'color']);
    ko.applyBindings(weatherViewModel);
  });

  console.log(refresh.rate - (Date.now() - Cookies.get(refresh.key) || 0));

  setTimeout(() => {
    refreshData();
    setInterval(() => { refreshData(); }, refresh.rate);
  }, refresh.rate - (Date.now() - Cookies.get(refresh.key) || 0));
});
