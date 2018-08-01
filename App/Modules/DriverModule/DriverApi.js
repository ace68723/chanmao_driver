import AppConstants from '../../Constants/AppConstants';
export default {
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
      // const url = 'https://www.cmapi.ca/cm_driver/dev/api/v1/geo_trace';
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
      return fetch(url,options)
              .then((res) => res.json())
              .catch((error) => {throw error});
    }
};
