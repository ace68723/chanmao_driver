import CmDriverConstants from '../Constants/CmDriverConstants';
import {dispatch, register} from '../Dispatchers/CmDriverDispatcher';
import DriverModule from '../Modules/DriverModule/DriverModule';
import {NativeModules} from 'react-native';
export default {
    async logIn({geo_lat, geo_lng}){
      try{
          // const token = await AuthModule.getToken();
          const reqData = {
            duty: 2,
            geo_lat,
            geo_lng,
          };
          const result = await DriverModule.updateDriverStatus(reqData);
          if (result.ev_error == 0) {
            const data = result.ev_duty;
            dispatch({
                actionType: CmDriverConstants.UPDATE_DRIVER_STATUS, data
            })
          }
      }catch (e){
      }
    },
    async logOut({geo_lat, geo_lng}){
      try{
          // const token = await AuthModule.getToken();
          const reqData = {
            duty: 1,
            geo_lat,
            geo_lng,
          };
          const result = await DriverModule.updateDriverStatus(reqData);
          if (result.ev_error == 0) {
            const data = result.ev_duty;
            dispatch({
                actionType: CmDriverConstants.UPDATE_DRIVER_STATUS, data
            })
          }
      }catch (e){
      }
    },
}
