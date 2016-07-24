// TODO Make exeptions on server failure
// TODO Refresh timings are unstable and untested
const amd = {
  baseUrl: 'js/lib',
  paths: { app: '../app' },
};
const deps = [
  'knockout', 'mapping', 'jscookie',
  'app/config', 'app/weather', 'app/viewmodel',
];

require(amd, deps, (
    knockout, mapping, Cookies,
    { API, cookie, MS_PER_DAY }, { OpenWeatherMap }, WeatherViewModel
) => {
  const ko = knockout;
  ko.mapping = mapping;

  const weatherService = new OpenWeatherMap(API.key);
  let weatherViewModel = {};

  function getWeatherData() {
    function getFromService() {
      console.log('from service');
      return weatherService.requestData().then(data => {
        const {
          name: city, sys: { country }, dt, main: { temp },
          weather: { 0: { icon } }, wind: { deg, speed },
        } = data;
        Cookies.set(cookie.key.refresh, Date.now(),
            { expires: API.refreshRate / MS_PER_DAY });
        return { city, country, temp, icon, speed, deg, dt: dt * 1000 };
      });
    }

    function getFromCookies() {
      console.log('from cookie');
      const cks = Cookies.get();
      const data = {};
      Object.keys(cks)
          .filter(key => key.startsWith(cookie.dataPrefix))
          .forEach(key => {
            data[key.replace(cookie.dataPrefix, '')] = +cks[key] || cks[key];
          });
      return Promise.resolve(data);
    }

    return Cookies.get(cookie.key.refresh) ? getFromCookies() : getFromService();
  }

  function refreshData() {
    getWeatherData().then(data => ko.mapping.fromJS(data, weatherViewModel));
  }

  getWeatherData().then(data => {
    weatherViewModel = new WeatherViewModel(data);
    ko.applyBindings(weatherViewModel);
  });

  console.log(API.refreshRate - (Date.now() - Cookies.get(cookie.key.refresh) || 0));

  setTimeout(() => {
    refreshData();
    setInterval(() => { refreshData(); }, API.refreshRate);
  }, API.refreshRate - (Date.now() - Cookies.get(cookie.key.refresh) || 0));
});
