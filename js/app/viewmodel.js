define(['knockout', 'mapping', 'jscookie',
        'app/config', 'app/assets', 'app/format'], (
        knockout, mapping, Cookies,
        { cookie, decor, asset }, { images: loader }, format
) => {
  const ko = knockout;
  ko.mapping = mapping;

  // View model constructor
  return function WeatherViewModel(data) {
    const mapData = Object.assign({}, data, decor);
    const mapCfg = {};

    // Make mapping config
    Object.keys(mapData).forEach(key => {
      mapCfg[key] = {};
      if (Array.isArray(mapData[key])) mapCfg[key].create = elem => elem.data;
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

    // Make computed output data formats for view model unit values
    Object.keys(decor.units[0]).forEach(name => {
      const compute = {
        [`${name}Mod`]: () => wvm.units()[0][name].convert(wvm[name]()),
        [`${name}Sign`]: () => format.numSignStr(wvm[`${name}Mod`]()),
        [`${name}Int`]: () => `${~~wvm[`${name}Mod`]()}`,
        [`${name}Fract`]: () => wvm[`${name}Mod`]()
            .toFixed(wvm.fractLen()[0](wvm[`${name}Int`]().length))
            .replace(/\d*/, ''),
        [`${name}Val`]: () => `${wvm[`${name}Int`]()}${wvm[`${name}Fract`]()}`,
        [`${name}Unit`]: () => wvm.units()[0][name].symbol,
        [`${name}System`]: () => wvm.units()[0][name].sys,
      };
      Object.keys(compute).forEach(p => { wvm[p] = ko.computed(compute[p]); });
    });

    // Apply defaults and define functions for decorators
    Object.keys(decor).forEach(prop => {
      wvm[prop].push(...wvm[prop].splice(0, +Cookies.get(prop) || 0));
      wvm[`${prop}Next`] = function scrollAndSave() {
        wvm[prop].push(wvm[prop].shift());
        Cookies.set(prop, mapData[prop].findIndex(v => v === wvm[prop]()[0]),
            { expires: cookie.lifeDays });
      };
    });

    // Make miscellaneous computed values
    wvm.colorScheme = ko.computed(() => wvm.colors()[0]);
    wvm.iconID = ko.computed(() => asset.icon.get(wvm.icon()));
    wvm.cardinalDir = ko.computed(() => format.cardinalDir(wvm.deg()));
    wvm.date = ko.computed(() => (
        format.date(new Date(wvm.dt()), wvm.dateFormat()[0])));

    // Load and set image to background
    wvm.background = ko.observable('');
    ko.computed(() => {
      loader.get(asset.pic.get(wvm.icon(), wvm.temp(), wvm.speed(), wvm.dt()))
          .then(img => { wvm.background(img.src); })
          .catch(() => { wvm.background(''); });
    }).extend({ deferred: true });

    // Define hiding functionality
    wvm.isHidden = ko.observable(!!+Cookies.get(cookie.key.hidden) || false);
    wvm.toggleVisibility = () => {
      wvm.isHidden(!wvm.isHidden());
      Cookies.set(cookie.key.hidden, +wvm.isHidden(),
          { expires: cookie.lifeDays });
    };

    return wvm;
  };
});
