import AppConstants from '../../Constants/AppConstants';

export default {
    _fetch(fetch_promise, timeout) {
      var abort_fn = null;

      //这是一个可以被reject的promise
      var abort_promise = new Promise(function(resolve, reject) {
             abort_fn = function() {
                reject('abort promise');
             };
      });

      //这里使用Promise.race，以最快 resolve 或 reject 的结果来传入后续绑定的回调
       var abortable_promise = Promise.race([
             fetch_promise,
             abort_promise
       ]);

       setTimeout(function() {
             abort_fn();
        }, timeout);

       return abortable_promise;
    },
    updateDriverStatus(reqData) {
      // const url = 'https://www.cmapi.ca/cm_driver/dev/api/v1/driver_status';
      const url = AppConstants.API_DRIVER_STATUS;
      let options = {
          method: 'POST',
          mode:'cors',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          }
      }
      options.headers = Object.assign(options.headers,{
          authortoken: reqData.token
      });
      options.body = JSON.stringify({
          duty: reqData.duty,
          geo_lat: reqData.geo_lat,
          geo_lng: reqData.geo_lng,
      });
      return fetch(url,options)
              .then((res) => res.json())
              .catch((error) => {throw error});
    },
    updateGeolocation(reqData) {
      const TIMEOUT_SEC = 10;

      const url = AppConstants.API_GEO_TRACE;
      let options = {
          method: 'POST',
          mode:'cors',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          timeout: 25000,
      }
      options.headers = Object.assign(options.headers,{
          authortoken: reqData.token
      });
      options.body = JSON.stringify({
          geo_lat: reqData.geo_lat,
          geo_lng: reqData.geo_lng,
      });

      return this._fetch(fetch(url, options), TIMEOUT_SEC * 1000)
        .then(function(res) {
            return res.json()
        }, function(err) {
            return;
        });
    }
};
