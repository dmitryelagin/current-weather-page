define({
  numSignStr(num) {
    if (!num) return '';
    return num > 0 ? '+' : '−';
  },

  numMinLen(num = 0, len = 2) {
    return `${'0'.repeat(len)}${num}`.slice(-Math.max(len, `${num}`.length));
  },

  date(dateObj = Date.now(), format = 'H:m, D.M.Y', utc = false) {
    const DT = [
      ['s', 'Seconds'],
      ['m', 'Minutes'],
      ['H', 'Hours'],
      ['h', 'Hours', date => date % 12 || 12],
      ['D', 'Date'],
      ['M', 'Month', date => date + 1],
      ['Y', 'FullYear'],
      ['P', 'Hours', date => (date >= 12 ? 'PM' : 'AM')],
      ['p', 'Hours', date => (date >= 12 ? 'p.m.' : 'a.m.')],
    ];
    return DT.reduce((str, args) => (
        str.replace(new RegExp(`(${args[0]}+)`, 'g'), match => {
          let value = dateObj[`get${utc ? 'UTC' : ''}${args[1]}`]();
          if (args[2]) value = args[2](value);
          return this.numMinLen(value, match.length);
        })), format);
  },

  cardinalDir(degree) {
    const CARDINAL = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return CARDINAL[~~((degree + 22.5) / 45)] || CARDINAL[0];
  },
});
