// TODO Relink images
define({
  MS_PER_DAY: 86400000,

  API: {
    key: '20e6b4bb024441f12fe889046e1acbd6',
    refreshRate: '900000',
  },

  misc: {
    transitionSpeed: { fast: 300, slow: 2000 },
    baseOpacity: 1,
  },

  cookie: {
    dataPrefix: 'data-',
    lifeDays: 7,
    key: {
      refresh: 'serviceRefreshed',
      hidden: 'infoIsHidden',
    },
  },

  decor: {
    colors: ['dark', 'light', 'color'],
    fractLen: [intLen => (intLen <= 2 ? 1 : 0)],
    dateFormat: ['HH:mm, DD.MM.Y', 'HH:mm, Y-MM-DD', 'h:mm P, M/D/Y'],
    units: [{
      temp: { convert: n => n - 273.15, symbol: 'C', sys: 'metric' },
      speed: { convert: n => n, symbol: 'm/s', sys: 'metric' },
    }, {
      temp: { convert: n => (n * 1.8) - 459.67, symbol: 'F', sys: 'imperial' },
      speed: { convert: n => n * 2.2369363, symbol: 'mph', sys: 'imperial' },
    }],
  },

  asset: {
    pic: {
      url: [
        [['01d'], '//cs633627.vk.me/v633627450/163f/fFK--dIxZlU.jpg'],
        [['01n'], '//cs633627.vk.me/v633627450/162b/691NRSEyveI.jpg'],
        [['02d'], '//cs633627.vk.me/v633627450/1653/S2h58MqOwR4.jpg'],
        [['02n'], '//cs628729.vk.me/v628729450/22302/qjwznie_E_g.jpg'],
        [['03d', '03n', '04d', '04n', '50d', '50n'],
            '//cs627917.vk.me/v627917450/372f9/MQO8vGSrGVI.jpg'],
        [['10d', '10n'], '//cs633627.vk.me/v633627450/1617/-MKNWboCDdM.jpg'],
        [['09d', '09n'], '//cs633627.vk.me/v633627450/1667/Sv-o4MoA2zk.jpg'],
        [['13d', '13n'], '//cs633627.vk.me/v633627450/160d/M557s8Wc9Rw.jpg'],
        [['11d', '11n'], '//cs633627.vk.me/v633627450/165d/xQzi5fIF82U.jpg'],
      ],
      get(code) { return this.url.find(img => img[0].includes(code))[1]; },
    },
    icon: {
      index: [
        [['01d'], 0],
        [['01n'], 1],
        [['02d'], 2],
        [['02n'], 3],
        [['03d', '03n', '04d', '04n', '50d', '50n'], 4],
        [['11d', '11n'], 5],
        [['10d', '10n'], 6],
        [['09d', '09n'], 7],
        [['13d', '13n'], 8],
      ],
      get(code) { return this.index.find(icon => icon[0].includes(code))[1]; },
    },
  },
});
