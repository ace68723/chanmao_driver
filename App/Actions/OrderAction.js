import CmDriverConstants from '../Constants/CmDriverConstants';
import {dispatch, register} from '../Dispatchers/CmDriverDispatcher';
import OrderModule from '../Modules/OrderModule/OrderModule';
import {NativeModules} from 'react-native';
export default {
    async updateOrders(){
      try{
          // const token = await AuthModule.getToken();
          // const reqData = {rid,pretax,token,startAmount}
          console.log('In orderAction');
          const result = await OrderModule.updateOrders();
          if (result.ev_error == 0) {
            const data = result.ev_orders;
            dispatch({
                actionType: CmDriverConstants.UPDATE_ORDERS, data
            })
          }
      }catch (e){
      }
    },
}
