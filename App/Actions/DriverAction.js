import CmDriverConstants from '../Constants/CmDriverConstants';
import {dispatch, register} from '../Dispatchers/CmDriverDispatcher';
import DriverModule from '../Modules/DriverModule/DriverModule';
import {NativeModules} from 'react-native';
export default {
    async goOnline({geo_lat, geo_lng}) {
      try{
          const reqData = {
            duty: 2,
            geo_lat,
            geo_lng,
          };
          const data = await DriverModule.updateDriverStatus(reqData);
          dispatch({
            actionType: CmDriverConstants.UPDATE_DRIVER_STATUS, data
          });
      }catch (e){
      }
    },
    async goOffline({geo_lat, geo_lng}) {
      try{
          const reqData = {
            duty: 1,
            geo_lat,
            geo_lng,
          };
          const data = await DriverModule.updateDriverStatus(reqData);
          dispatch({
              actionType: CmDriverConstants.UPDATE_DRIVER_STATUS, data
          });
      }catch (e){
      }
    },
    async updateGeolocation({geo_lat, geo_lng}) {
      try{
          const reqData = {
            geo_lat,
            geo_lng,
          };
          const result = await DriverModule.updateGeolocation(reqData);
          if (result.ev_error == 0) {

          }
      }catch (e){
      }
    }
}
