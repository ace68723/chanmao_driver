import Auth from '../AuthModule/Auth';
import DriverApi from './DriverApi';
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
          return result;

        } catch (e) {
          console.log(e)
          const errorMessage = 'error';
          throw errorMessage;
        }
    }
}
