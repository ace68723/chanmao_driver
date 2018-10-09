import CmDriverConstants from '../Constants/CmDriverConstants';
import {dispatch, register} from '../Dispatchers/CmDriverDispatcher';
import HistoryModule from '../Modules/HistoryModule/CmDriverHistoryModule';
import {NativeModules} from 'react-native';
export default {
    async getHistory(startTime, endTime){
      try{
          // const token = await AuthModule.getToken();
          // const reqData = {rid,pretax,token,startAmount}
          const result = await HistoryModule.getHistory(startTime, endTime);
          // console.log('action');
          // console.log(result);

            const data = result;
            dispatch({
                actionType: CmDriverConstants.GET_HISTORY, data
            })

      }catch (e){
      }
    },

}
