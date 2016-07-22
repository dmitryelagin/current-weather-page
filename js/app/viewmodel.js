// TODO Test background subscribtion
// TODO Make icon changing
// TODO Think about exeptions
// TODO Save weather data and hiding state in cookies
define(['knockout', 'mapping', 'jscookie', 'app/assets', 'app/format'], (
    knockout, mapping, Cookies, { images: loader }, format
) => {
  const ko = knockout;
  ko.mapping = mapping;

  const resources = {
    units: [{
      name: 'metric',
      temp: { convert(val) { return val - 273.15; }, symbol: 'C' },
      speed: { convert(val) { return val; }, symbol: 'm/s' },
    }, {
      name: 'imperial',
      temp: { convert(val) { return val * 9 / 5 - 459.67; }, symbol: 'F' },
      speed: { convert(val) { return val * 2.2369363; }, symbol: 'mph' },
    }],
    dateFormat: ['HH:mm, DD.MM.Y', 'HH:mm, Y-MM-DD', 'h:mm P, M/D/Y'],
  };

  // View model constructor
  return function WeatherViewModel(data, assets, colors = [],
      cfg = { tempFractionLen: 1, numFixedLen: 2 },
      defaults = { units: 0, dateFormat: 0, colors: 0 },
      cookie = { lifeDays: 7, dataPrefix: 'data-' }
  ) {
    const mapData = Object.assign({ colors }, data, resources, cfg);
    const mapCfg = {};

    // Make mapping config
    Object.keys(mapData).forEach(key => {
      mapCfg[key] = {};
      if (Array.isArray(mapData[key])) {
        mapCfg[key].create = elem => elem.data;
      }
      if (data[key] !== undefined) {
        mapCfg[key].update = elem => {
          Cookies.set(`${cookie.dataPrefix}${key}`, elem.data,
              { expires: cookie.lifeDays });
          return elem.data;
        };
      }
    });

    // Map data in new view model
    const wvm = ko.mapping.fromJS(mapData, mapCfg);

    // Define support functions
    const scrollArray = name => {
      wvm[name].push(wvm[name].shift());
    };
    const saveState = name => {
      Cookies.set(name, mapData[name].findIndex(v => v === wvm[name]()[0]),
          { expires: cookie.lifeDays });
    };
    const scrollAndSave = name => {
      scrollArray(name);
      saveState(name);
    };
    const setBackground = () => {
      loader.load(assets.getUrl(wvm.icon(), wvm.temp(), wvm.speed(), wvm.dt()))
          .then(img => { wvm.background(img.src); });
    };

    // Apply defaults
    Object.keys(defaults).forEach(p => {
      for (let i = Math.max(+defaults[p] || +Cookies.get(p) || 0, 0); i--;) {
        scrollArray(p);
      }
    });

    // Compute date and time
    wvm.date = ko.computed(() => (
        format.date(new Date(wvm.dt()), wvm.dateFormat()[0])));

    // Compute temperature
    wvm.tempMod = ko.computed(() => wvm.units()[0].temp.convert(wvm.temp()));
    wvm.tempUnit = ko.computed(() => wvm.units()[0].temp.symbol);
    wvm.tempInt = ko.computed(() => `${~~wvm.tempMod()}`);
    wvm.tempFraction = ko.computed(() => (
        wvm.tempMod().toFixed(wvm.tempFractionLen()).replace(/\d*\./, '.')));
    wvm.tempSign = ko.computed(() => (
        wvm.tempInt().length > 2 ? '' : format.numSignStr(wvm.tempMod())));

    // Compute wind
    wvm.speedMod = ko.computed(() => wvm.units()[0].speed.convert(wvm.speed()));
    wvm.speedUnit = ko.computed(() => wvm.units()[0].speed.symbol);
    wvm.speedVal = ko.computed(() => (
        wvm.speedMod().toFixed(wvm.tempFractionLen())));
    wvm.cardinal = ko.computed(() => format.cardinalDir(wvm.deg()));

    // Define visuals
    wvm.background = ko.observable('');
    wvm.colorScheme = ko.computed(() => wvm.colors()[0]);
    if (assets) {
      wvm.icon.subscribe(setBackground);
      setBackground();
    }

    // Define buttons
    wvm.nextUnitSystem = () => { scrollAndSave('units'); };
    wvm.nextDateFormat = () => { scrollAndSave('dateFormat'); };
    wvm.nextColorScheme = () => { scrollAndSave('colors'); };
    wvm.toggleVisibility = () => { wvm.isHidden(!wvm.isHidden()); };

    wvm.isHidden = ko.observable(false);
    return wvm;
  };
});
