import CmDriverConstants from '../Constants/CmDriverConstants';
import {dispatch, register} from '../Dispatchers/CmDriverDispatcher';
import HistoryModule from '../Modules/HistoryModule/CmDriverHistoryModule';
import {NativeModules} from 'react-native';
export default {
    async getHistory(startTime, endTime){
      try{
          const result = await HistoryModule.getHistory(startTime, endTime);


            const data = result;
            dispatch({
                actionType: CmDriverConstants.GET_HISTORY, data
            })

      }catch (e){
      }
    },

}
