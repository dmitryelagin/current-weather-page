// TODO Test background subscribtion
define(['knockout', 'mapping', 'app/assets'], (knockout, mapping,
    { images: imgLoader }
) => {
  const ko = knockout;
  ko.mapping = mapping;

  const CARDINAL = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const config = {
    units: [{
      name: 'metric',
      temp: { convert(val) { return val - 273.15; }, symbol: 'C' },
      speed: { convert(val) { return val; }, symbol: 'm/s' },
    }, {
      name: 'imperial',
      temp: { convert(val) { return val * 9 / 5 - 459.67; }, symbol: 'F' },
      speed: { convert(val) { return val * 2.2369363; }, symbol: 'mph' },
    }],
    dateFormat: ['d.m.y', 'y-m-d', 'm/d/y'],
    colorScheme: ['dark', 'light', 'color'],
    tempFractionLen: 1,
    numFixedLen: 2,
  };

  return function WeatherViewModel(data, assets, cfg = config) {
    const wvm = ko.mapping.fromJS(Object.assign({}, data, cfg));

    // Support functions
    const leadZero = value => (
        `${'0'.repeat(wvm.numFixedLen())}${value}`.slice(-wvm.numFixedLen()));
    const setBackground = () => {
      const id = assets.id.findIndex(codes => codes.includes(wvm.icon()));
      imgLoader.load(assets.url[id]).then(img => { wvm.background(img.src); });
    };
    const scrollArray = arr => arr.push(arr.shift());

    // Compute date and time
    wvm.dt = ko.computed(() => new Date(wvm.measured()));
    wvm.time = ko.computed(() => (
        `${leadZero(wvm.dt().getHours())}:${leadZero(wvm.dt().getMinutes())}`));
    wvm.date = ko.computed(() => {
      const date = {
        d: leadZero(wvm.dt().getDate()),
        m: leadZero(wvm.dt().getMonth() + 1),
        y: wvm.dt().getFullYear(),
      };
      return Array.prototype.reduce.call(wvm.dateFormat()[0],
          (str, part) => `${str}${date[part] || part}`, '');
    });

    // Compute temperature
    wvm.tempMod = ko.computed(() => wvm.units()[0].temp.convert(wvm.temp()));
    wvm.tempUnit = ko.computed(() => wvm.units()[0].temp.symbol());

    wvm.tempInt = ko.computed(() => `${~~wvm.tempMod()}`);
    wvm.tempFraction = ko.computed(() => (
        wvm.tempMod().toFixed(wvm.tempFractionLen()).replace(/\d*\./, '.')));
    wvm.tempSign = ko.computed(() => {
      if (!wvm.tempMod() || wvm.tempInt().length > 2) return '';
      return wvm.tempMod() > 0 ? '+' : '−';
    });

    // Compute wind
    wvm.speedMod = ko.computed(() => wvm.units()[0].speed.convert(wvm.speed()));
    wvm.speedUnit = ko.computed(() => wvm.units()[0].speed.symbol());

    wvm.speedVal = ko.computed(() => (
        wvm.speedMod().toFixed(wvm.tempFractionLen())));
    wvm.cardinal = ko.computed(() => (
        CARDINAL[~~((wvm.deg() + 22.5) / 45)] || CARDINAL[0]));

    // Compute visuals
    wvm.pageColorScheme = ko.computed(() => wvm.colorScheme()[0]);

    wvm.background = ko.observable('');
    wvm.icon.subscribe(setBackground);
    setBackground();

    // Set buttons
    wvm.nextUnitSystem = () => { scrollArray(wvm.units); };
    wvm.nextDateFormat = () => { scrollArray(wvm.dateFormat); };
    wvm.nextColorScheme = () => { scrollArray(wvm.colorScheme); };

    return wvm;
  };
});
