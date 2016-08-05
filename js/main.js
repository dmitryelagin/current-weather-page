// TODO Make exeptions on server failure
// TODO Refresh timings are unstable and untested
const amd = {
  baseUrl: 'js/lib',
  paths: { app: '../app' },
};
const deps = [
  'jquery', 'knockout', 'mapping', 'jscookie',
  'app/config',
  'app/bindings', 'app/weather', 'app/viewmodel',
];

require(amd, deps, (
    $, knockout, mapping, Cookies,
    { API, cookie, MS_PER_DAY, misc: { transitionSpeed, baseOpacity } },
    bindings, { OpenWeatherMap }, WeatherViewModel
) => {
  const ko = knockout;
  ko.mapping = mapping;
  Object.assign(ko.bindingHandlers, {
    textFading: new bindings.Fading('text', transitionSpeed.fast, baseOpacity),
    attrFading: new bindings.Fading('attr', transitionSpeed.fast, baseOpacity),
  });

  const weatherService = new OpenWeatherMap(API.key);
  let weatherViewModel = {};

  function getWeatherData() {
    function fromService() {
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

    function fromCookies() {
      const cks = Cookies.get();
      const data = {};
      Object.keys(cks)
          .filter(key => key.startsWith(cookie.dataPrefix))
          .forEach(key => {
            data[key.replace(cookie.dataPrefix, '')] = +cks[key] || cks[key];
          });
      return Promise.resolve(data);
    }

    return Cookies.get(cookie.key.refresh) ? fromCookies() : fromService();
  }

  function refreshData() {
    getWeatherData().then(data => ko.mapping.fromJS(data, weatherViewModel));
  }

  getWeatherData().then(data => {
    weatherViewModel = new WeatherViewModel(data);
    ko.applyBindings(weatherViewModel);
  });

  // Added for testing
  $('.icon').on('click', () => { weatherViewModel.icon('01d'); });
  console.log(API.refreshRate - (Date.now() - Cookies.get(cookie.key.refresh) || 0));
  // Delete after finish
  // Also delete JQuery dependency from this file

  setTimeout(() => {
    refreshData();
    setInterval(() => { refreshData(); }, API.refreshRate);
  }, API.refreshRate - (Date.now() - Cookies.get(cookie.key.refresh) || 0));
});
