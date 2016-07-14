define(['knockout', 'mapping'], (knockout, mapping) => {
  const ko = knockout;
  ko.mapping = mapping;

  const CARDINAL = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const RESOURCES = {
    units: [['metric', 'c', 'm/s'], ['imperial', 'f', 'mph']],
    dateFormat: ['dmy', 'ymd', 'mdy'],
    backTone: ['dark', 'light'],
  };

  return function WeatherViewModel(data,
      cfg = { tempFractionLen: 1, numFixedLen: 2 }
  ) {
    const wvm = ko.mapping.fromJS(Object.assign({}, data, cfg, RESOURCES));
    const leadZero = value => (
        `${'0'.repeat(wvm.numFixedLen())}${value}`.slice(-wvm.numFixedLen()));
    const scrollArray = arr => arr.push(arr.shift());

    wvm.dt = ko.computed(() => new Date(wvm.measured()));
    wvm.time = ko.computed(() => (
        `${leadZero(wvm.dt().getHours())}:${leadZero(wvm.dt().getMinutes())}`));

    wvm.date = ko.computed(() => {
      const date = {
        d: leadZero(wvm.dt().getDate()),
        m: leadZero(wvm.dt().getMonth() + 1),
        y: wvm.dt().getFullYear(),
      };
      return Array.prototype.reduce
          .call(wvm.dateFormat()[0], (str, part) => `${str}${date[part]}/`, '')
          .slice(0, -1);
    });

    wvm.tempModified = ko.computed(() => {
      switch (wvm.units()[0][0]) {
        case 'metric': return wvm.temp() - 273.15;
        case 'imperial': return wvm.temp() * 9 / 5 - 459.67;
        default: return wvm.temp();
      }
    });

    wvm.tempInt = ko.computed(() => ~~wvm.tempModified());
    wvm.tempFraction = ko.computed(() => (
      wvm.tempModified().toFixed(wvm.tempFractionLen()).replace(/\d*\./, '.')));
    wvm.tempUnit = ko.computed(() => wvm.units()[0][1].toUpperCase());
    wvm.tempSign = ko.computed(() => {
      if (!wvm.tempModified()) return '';
      return wvm.tempModified() > 0 ? '+' : '−';
    });

    wvm.speedModified = ko.computed(() => {
      switch (wvm.units()[0][0]) {
        case 'imperial': return wvm.speed() * 2.2369363;
        default: return wvm.speed();
      }
    });

    wvm.speedVal = ko.computed(() => (
        wvm.speedModified().toFixed(wvm.tempFractionLen())));
    wvm.speedUnit = ko.computed(() => wvm.units()[0][2]);
    wvm.cardinal = ko.computed(() => (
        CARDINAL[~~((wvm.deg() + 22.5) / 45)] || CARDINAL[0]));

    wvm.nextUnitSystem = () => { scrollArray(wvm.units); };
    wvm.nextDateFormat = () => { scrollArray(wvm.dateFormat); };

    return wvm;
  };
});
