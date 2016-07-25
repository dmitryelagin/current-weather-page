// TODO Make change load method to get to return request from pool if loaded
define(() => {
  // Assets storage class
  class Storage {

    constructor(loader) {
      this.loader = loader;
      this.pool = [];
    }

    load(links, retries = 2, delay = 200) {
      function loadAsset(url, i, a, attempts = retries, wait = 0) {
        return new Promise(fn => setTimeout(fn, wait)).then(() => (
          this.loader(url).catch(error => (attempts
            ? loadAsset.call(this, url, i, a, attempts - 1, delay)
            : new Error(`Asset was not loaded: ${error}`)))));
      }

      return new Promise((resolve, reject) => {
        Promise.all([].concat(links).map(loadAsset, this)).then(results => {
          this.pool.push(...results);
          if (results.some(e => e instanceof Error)) reject(...results);
          else resolve(...results);
        });
      });
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
