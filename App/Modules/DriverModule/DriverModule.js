import Auth from '../AuthModule/Auth';
import DriverApi from './DriverApi';
import {
  updateDriverOnlineStatus,
} from '../AuthModule/Auth';

export default  {
    async updateDriverStatus(reqData) {
      try {
          const token = await Auth.getToken();
          const lo_data = {
            token: token,
            duty: reqData.duty,
            geo_lat: reqData.geo_lat,
            geo_lng: reqData.geo_lng,
          };
          const result = await DriverApi.updateDriverStatus(lo_data);
          if (result.ev_error == 0) {
            const update_result = await updateDriverOnlineStatus(result.ev_duty);
            if (update_result === 0) {
              return result.ev_duty;
            }
          }

        } catch (e) {
          console.log(e)
          const errorMessage = 'error';
          throw errorMessage;
        }
    },
    async updateGeolocation({geo_lat, geo_lng}) {
      try {
          const token = await Auth.getToken();
          const lo_data = {
            token,
            geo_lat,
            geo_lng,
          };
          const result = await DriverApi.updateGeolocation(lo_data);
          return result;

        } catch (e) {
          console.log(e)
          const errorMessage = 'update Geolocation error';
          throw errorMessage;
        }
    }
}
