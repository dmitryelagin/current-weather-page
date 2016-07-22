// TODO Test JSON requesting
// TODO Weather should not be the only one constructor
define(() => {
  // Base class for work with weather API
  class Weather {

    constructor(ipServiceUrl = '//freegeoip.net/json') {
      this.ipServiceUrl = ipServiceUrl;
    }

    requestByUrl(url, timeout = 10000) {
      return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.timeout = timeout;
        request.ontimeout = () => { reject('Connection timed out.'); };
        request.onerror = () => { reject('Connection error.'); };
        request.onload = () => {
          if (+request.status === 200) resolve(JSON.parse(request.response));
          else reject(`Error ${request.status}: ${request.statusText}`);
        };
        request.send();
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
      return this.requestByUrl(this.ipServiceUrl).then(data => {
        if (data.message) throw data.message;
        return { zip: data.zip_code, countryCode: data.country_code };
      });
    }

  }

  // Class for openweathermap.org
  class OpenWeatherMap extends Weather {

    constructor(apiKey,
        weatherServiceUrl = '//api.openweathermap.org/data/2.5/weather',
        ipServiceUrl
    ) {
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
          .then(url => this.requestByUrl(url));
    }

  }

  return { Weather, OpenWeatherMap };
});
