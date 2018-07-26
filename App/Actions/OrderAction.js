import CmDriverConstants from '../Constants/CmDriverConstants';
import {dispatch, register} from '../Dispatchers/CmDriverDispatcher';
import OrderModule from '../Modules/OrderModule/OrderModule';
import {NativeModules} from 'react-native';
export default {
    async getOrders({lat, lng}){
      try{
          // const token = await AuthModule.getToken();
          // const reqData = {rid,pretax,token,startAmount}
          const reqData = {lat, lng};
          const result = await OrderModule.getOrders(reqData);
          if (result.ev_error == 0) {
            const data = result.ev_orders;
            dispatch({
                actionType: CmDriverConstants.GET_ORDERS, data
            })
          }
      }catch (e){
      }
    },
    async updateOrderStatus(oid, change){
      try{
          const result = await OrderModule.changeOrderStatus(oid, change);
          if (result.ev_error == 0) {
            await this.getOrders();
          }
      }catch (e){
      }
    },
}
