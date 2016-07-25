// TODO Test all methods
define(() => {
  // Assets storage class
  class Storage {

    constructor(loader) {
      this.loader = loader;
      this.assets = new Map();
      this.default = { retries: 2, delay: 200 };
    }

    get pool() {
      const pool = [];
      this.assets.forEach(asset => pool.push(asset));
      return pool;
    }

    get(links, { retries, delay } = this.default) {
      function downloadAsset(url, attempts = retries, wait = 0) {
        return new Promise(fn => setTimeout(fn, wait)).then(() => (
          this.loader(url).catch(error => (attempts
            ? downloadAsset.call(this, url, attempts - 1, delay)
            : new Error(`Asset was not loaded: ${error}`)))));
      }

      function getAsset(url) {
        const asset = this.assets.get(url);
        return asset === undefined || asset instanceof Error
          ? downloadAsset.call(this, url)
          : Promise.resolve(asset);
      }

      return new Promise((resolve, reject) => {
        Promise.all([].concat(links).map(getAsset, this)).then(results => {
          results.forEach((val, id) => { this.assets.set(links[id], val); });
          if (results.some(el => el instanceof Error)) reject(...results);
          else resolve(...results);
        });
      });
    }

    config(options) {
      Object.assign(this.default, options);
      return this;
    }

  }

  // Storages
  const images = new Storage(url => new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => { resolve(img); };
    img.onerror = () => { reject(url); };
    img.src = url;
  }));

  return { Storage, images };
});
