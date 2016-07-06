// TODO Apply singleton pattern
define(['jquery'], $ => {
  // Base class for work with weather API
  class Weather {

    constructor(ipServiceUrl = 'http://ip-api.com/json') {
      this.ipServiceUrl = ipServiceUrl;
    }

    request(requestUrl) {
      return new Promise((resolve, reject) => {
        $.getJSON(requestUrl, data => { resolve(data); })
            .fail((j, status, error) => { reject(`${status}, ${error}`); });
      });
    }

    coordinate() {
      return new Promise((resolve, reject) => {
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
              position => { resolve(position.coords); },
              () => { reject('Can not access geolocation.'); });
        } else {
          reject('Browser has no geolocation.');
        }
      });
    }

    locate() {
      return this.request(this.ipServiceUrl).then(data => {
        if (data.message) throw data.message;
        return { zip: data.zip, countryCode: data.countryCode };
      });
    }

  }

  // Class for openweathermap.org
  class OpenWeatherMap extends Weather {

    constructor(apiKey,
        weatherServiceUrl = 'http://api.openweathermap.org/data/2.5/weather',
        ipServiceUrl) {
      if (!apiKey) throw new Error('API key is required.');
      super(ipServiceUrl);
      this.weatherServiceUrl = weatherServiceUrl;
      this.key = apiKey;
    }

    makeRequestUrlByCoords({ latitude, longitude }) {
      return `${this.weatherServiceUrl}?` +
          `lat=${latitude}&lon=${longitude}&appid=${this.key}`;
    }

    makeRequestUrlByLocation({ zip, countryCode }) {
      return `${this.weatherServiceUrl}?` +
          `zip=${zip},${countryCode}&appid=${this.key}`;
    }

    requestData() {
      return this.coordinate().then(data => this.makeRequestUrlByCoords(data),
          () => this.locate().then(data => this.makeRequestUrlByLocation(data)))
          .then(url => this.request(url));
    }

  }

  return { Weather, OpenWeatherMap };
});
