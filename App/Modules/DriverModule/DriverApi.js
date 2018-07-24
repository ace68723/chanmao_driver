export default {
    updateDriverStatus(reqData) {
      const url = 'https://www.cmapi.ca/cm_driver/dev/api/v1/driver';
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
    }
};
