// TODO Test background subscribtion
// TODO Make icon changing
// TODO Think about exeptions
define(['knockout', 'mapping', 'jscookie', 'app/assets', 'app/format'], (
    knockout, mapping, Cookie, { images: loader }, format
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
  return function WeatherViewModel(data, assets, colors,
      defaults = { units: 0, dateFormat: 0, colors: 0 },
      cfg = { tempFractionLen: 1, numFixedLen: 2, cookieDays: 3 }
  ) {
    if (colors) resources.colors = colors;

    const wvm = ko.mapping.fromJS(Object.assign({}, data, cfg, resources), {
      units: { create: options => options.data },
    });

    // Support functions
    const scrollArray = name => { wvm[name].push(wvm[name].shift()); };
    const changeOnPress = name => {
      scrollArray(name);
      Cookie.set(name, resources[name].findIndex(v => v === wvm[name]()[0]),
          { expires: cfg.cookieDays });
    };
    const setBackground = () => {
      loader.load(assets.getUrl(wvm.icon(), wvm.temp(), wvm.dt())).then(img => {
        wvm.background(img.src);
      });
    };

    // Applying defaults
    Object.keys(defaults).forEach(prop => {
      for (let i = +Cookie.get(prop) || +defaults[prop] || 0; i--;) {
        scrollArray(prop);
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

    // Visuals
    wvm.background = ko.observable('');
    if (wvm.colors) wvm.colorScheme = ko.computed(() => wvm.colors()[0]);
    if (assets) {
      wvm.icon.subscribe(setBackground);
      setBackground();
    }

    // Buttons
    wvm.nextUnitSystem = () => { changeOnPress('units'); };
    wvm.nextDateFormat = () => { changeOnPress('dateFormat'); };
    wvm.nextColorScheme = () => { changeOnPress('colors'); };
    wvm.toggleVisibility = () => { wvm.isHidden(!wvm.isHidden()); };

    wvm.isHidden = ko.observable(false);
    return wvm;
  };
});
