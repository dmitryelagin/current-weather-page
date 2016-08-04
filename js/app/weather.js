define(() => {
  const service = {
    weather: '//api.openweathermap.org/data/2.5/weather',
    ipGeo: '//freegeoip.net/json/',
    ip: '//api.ipify.org',
  };

  // Base class for work with weather API
  class Weather {

    constructor(ipGeoServiceUrl = service.ipGeo, ipServiceUrl = service.ip) {
      this.ipGeoServiceUrl = ipGeoServiceUrl;
      this.ipServiceUrl = ipServiceUrl;
    }

    requestByUrl(url, timeout = 10000) {
      return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.timeout = timeout;
        request.ontimeout = () => { reject(`Connection timed out: ${url}`); };
        request.onerror = () => { reject(`Connection error: ${url}`); };
        request.onload = () => {
          if (+request.status === 200) resolve(request.response);
          else reject(`Error ${request.status}: ${request.statusText}; ${url}`);
        };
        request.send();
      });
    }

    coordinate() {
      return new Promise((resolve, reject) => {
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
              position => { resolve(position.coords); },
              () => { reject('Can not access browser geolocation.'); });
        } else {
          reject('Browser has no geolocation.');
        }
      });
    }

    locate() {
      return this.requestByUrl(this.ipServiceUrl)
          .then(ip => this.requestByUrl(`${this.ipGeoServiceUrl}${ip}`))
          .then(data => JSON.parse(data));
    }

  }

  // Class for openweathermap.org
  class OpenWeatherMap extends Weather {

    constructor(apiKey, weatherServiceUrl = service.weather, ...ipServices) {
      if (!apiKey) throw new Error('API key is required.');
      super(...ipServices);
      this.weatherServiceUrl = weatherServiceUrl;
      this.key = apiKey;
    }

    makeRequestUrlByCoords({ latitude, longitude }) {
      return `${this.weatherServiceUrl}?` +
          `lat=${latitude}&lon=${longitude}&appid=${this.key}`;
    }

    requestData() {
      return this.coordinate().then(data => this.makeRequestUrlByCoords(data),
          () => this.locate().then(data => this.makeRequestUrlByCoords(data)))
          .then(url => this.requestByUrl(url))
          .then(data => JSON.parse(data));
    }

  }

  return { Weather, OpenWeatherMap };
});
