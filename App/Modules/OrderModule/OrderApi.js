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
      const url = AppConstants.API_ORDERS + io_data.order_id;
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
    getOrderHistory(io_data){
      const url = 'http://norgta.com/api/driver/v1/get_order_history'
      let options = {
          method: 'POST',
          mode:'cors',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          }
      }
      options.headers = Object.assign(options.headers,{
          Authortoken:'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOiIxMDYxMSIsImV4cGlyZWQiOjE0ODc3OTM2MDAsImxhc3Rsb2dpbiI6MTQ4MTc0MjU2N30.ZHwmJEBV_1cO5uxR729Hd49rRIpRdCEDbX-uVDgVee0'
      })
      options.body = JSON.stringify({
        'iv_start':io_data.iv_start,
        'iv_end':io_data.iv_end,
        'driver_id':io_data.driver_id,
      })
      return fetch(url,options)
              .then((res) => res.json())
              .catch((error) => {throw error});
    },
    getOrders(io_data) {
      const TIMEOUT_SEC = 10;
      // let requestTimeout = setTimeout(function(){
      //   alert('服务器开小差了');
      //   clearTimeout(requestTimeout);
      //   dispatch({
      //       actionType: CmDriverConstants.GET_ORDERS_FAILED
      //   })
      // }, 1000 * TIMEOUT_SEC);

      const url = AppConstants.API_ORDERS;
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
            return null;
        });

      // return fetch(url,options)
      //         .then((res) => {
      //           clearTimeout(requestTimeout);
      //           return res.json();
      //         })
      //         .catch((error) => {throw error});
    }
};
