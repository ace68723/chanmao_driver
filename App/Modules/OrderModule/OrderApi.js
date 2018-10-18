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

    changeOrderStatus(io_data) {
        // const url = 'https://www.cmapi.ca/cm_driver/dev/api/v1/orders/' + io_data.oid;
        const url = AppConstants.API_ORDERS + io_data.oid;
        let options = {
            method: 'PUT',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        };

        options.headers = Object.assign(options.headers, {
            authortoken: io_data.token,
        });
        options.body = JSON.stringify({
            task: io_data.change,
        });

        return fetch(url, options)
                .then((res) => res.json())
                .catch((error) => {throw error;});
    },
    getOrderDetail(io_data){
      // const url = 'https://www.cmapi.ca/cm_driver/api/v1/orders/' + io_data.order_id
      const url = AppConstants.API_ORDERS + io_data.oid;
      let options = {
          method: 'GET',
          mode:'cors',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
      }
      options.headers = Object.assign(options.headers,{
          authortoken: io_data.token,
      })
      return fetch(url,options)
              .then((res) => res.json())
              .catch((error) => {throw error});
    },
    getOrders(io_data) {
      const TIMEOUT_SEC = 10;
      const url = AppConstants.API_ORDERS;
      let options = {
          method: 'GET',
          mode:'cors',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          timeout: 50000,
      }
      options.headers = Object.assign(options.headers,{
          authortoken: io_data.token,
      })
      return this._fetch(fetch(url, options), TIMEOUT_SEC * 1000)
        .then(function(res) {
            return res.json()
        }, function(err) {
            return ;
        });
    },
    getFinishedOrders(io_data) {
        const TIMEOUT_SEC = 10;
        const url = AppConstants.API_FINISHED_ORDERS;
        let options = {
            method: 'GET',
            mode:'cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            timeout: 25000,
        }
        options.headers = Object.assign(options.headers,{
            authortoken: io_data.token,
        })
        return this._fetch(fetch(url, options), TIMEOUT_SEC * 1000)
          .then(function(res) {
              return res.json()
          }, function(err) {
              return ;
          });
      }
};
