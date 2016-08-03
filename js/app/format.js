define({
  cardinalDir(degree) {
    const CARDINAL = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return CARDINAL[~~((degree + 22.5) / 45)] || CARDINAL[0];
  },

  numSignStr(num) {
    if (!num) return '';
    return num > 0 ? '+' : '−';
  },

  date(dateObj = Date.now(), format = 'H:m, D.M.Y', utc = false) {
    return [
      ['s', 'Seconds'],
      ['m', 'Minutes'],
      ['H', 'Hours'],
      ['h', 'Hours', date => date % 12 || 12],
      ['D', 'Date'],
      ['M', 'Month', date => date + 1],
      ['Y', 'FullYear'],
      ['P', 'Hours', date => (date >= 12 ? 'PM' : 'AM')],
      ['p', 'Hours', date => (date >= 12 ? 'p.m.' : 'a.m.')],
    ].reduce((str, args) => (
        str.replace(new RegExp(`(${args[0]}+)`, 'g'), match => {
          let number = dateObj[`get${utc ? 'UTC' : ''}${args[1]}`]();
          if (args[2]) number = args[2](number);
          return `${'0'.repeat(match.length)}${number}`
              .slice(-Math.max(match.length, `${number}`.length));
        })), format);
  },

  dateFormat: [
    'HH:mm, DD.MM.Y',
    'HH:mm, Y-MM-DD',
    'h:mm P, M/D/Y',
  ],
});
