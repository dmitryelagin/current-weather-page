define(['jquery'], $ => (
  // Class for openweathermap.org
  class OpenWeatherMap {

    constructor(apiKey) {
      if (!apiKey) throw new Error('API key is required.');
      this.key = apiKey;
    }

    static get weatherServiceUrl() {
      return 'http://api.openweathermap.org/data/2.5/weather';
    }

    static get ipServiceUrl() {
      return 'http://ip-api.com/json';
    }

    requestData(requestUrl) {
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
      return this.requestData(this.constructor.ipServiceUrl).then(data => {
        if (data.message) throw data.message;
        return { zip: data.zip, countryCode: data.countryCode };
      });
    }

    makeRequestUrlByCoords({ latitude, longitude }) {
      return `${this.constructor.weatherServiceUrl}?` +
          `lat=${latitude}&lon=${longitude}&appid=${this.key}`;
    }

    makeRequestUrlByLocation({ zip, countryCode }) {
      return `${this.constructor.weatherServiceUrl}?` +
          `zip=${zip},${countryCode}&appid=${this.key}`;
    }

    request() {
      return this.coordinate().then(data => this.makeRequestUrlByCoords(data),
          () => this.locate().then(data => this.makeRequestUrlByLocation(data)))
          .then(url => this.requestData(url));
    }

  }
));
