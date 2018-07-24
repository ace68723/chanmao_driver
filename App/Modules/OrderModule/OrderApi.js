export default {
    changeOrderStatus(io_data) {
        const url = 'https://www.chanmao.ca/index.php?r=MobDriver10/OrderChange';

        let options = {
            method: 'POST',
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
            oid: io_data.oid,
            task: io_data.change,
        });

        return fetch(url, options)
                .then((res) => res.json())
                .catch((error) => {throw error;});
    },
    getOrderDetail(io_data){
      // const url = 'http://norgta.com/api/driver/v1/get_order_detail'
      const url = 'https://www.cmapi.ca/cm_driver/api/v1/orders/' + io_data.order_id
      let options = {
          method: 'GET',
          mode:'cors',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          }
      }
      options.headers = Object.assign(options.headers,{
          Authortoken:'w6jqxH/*M9eR~Q:*$(qfk^m`E"5fGXj'
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
    getOrders() {
      const url = 'https://www.cmapi.ca/cm_driver/dev/api/v1/orders/';
      let options = {
          method: 'GET',
          mode:'cors',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          }
      }
      options.headers = Object.assign(options.headers,{
          authortoken:'w6jqxH/*M9eR~Q:*$(qfk^m`E"5fGXj'
      })
      return fetch(url,options)
              .then((res) => res.json())
              .catch((error) => {throw error});
    }
};
