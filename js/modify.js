define({

  convert: {
    // Degree to cardinal direction
    deg2cardinal(degree) {
      const CARDINAL = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
      return CARDINAL[~~((degree + 22.5) / 45)] || CARDINAL[0];
    },

    // Kelvin to degree Celsius
    K2degC(kelvin) {
      return kelvin - 273.15;
    },

    // Kelvin to degree Fahrenheit
    K2degF(kelvin) {
      return kelvin * 9 / 5 - 459.67;
    },

    // Meters per second to miles per hour
    ms2mph(ms) {
      return ms * 2.23694;
    },
  },

  format: {
    // Fix number length
    cutNumByLength(number, len = 2, fractionLen = 0) {
      const num = Math.abs(number).toFixed(fractionLen);
      return ('0'.repeat(len) + num).slice((fractionLen && -1) - len);
    },

    // String with number sign
    signString(num) {
      if (!num) return '';
      return +num > 0 ? '+' : '−';
    },
  },

});
