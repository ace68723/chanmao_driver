import CmDriverConstants from '../Constants/CmDriverConstants';
import {dispatch, register} from '../Dispatchers/CmDriverDispatcher';
import OrderModule from '../Modules/OrderModule/OrderModule';
import {NativeModules} from 'react-native';
export default {
    async getOrders(){
      try{
          const result = await OrderModule.getOrders();
          const data = {
            filter_start_time: result.ev_data.filter_start_time,
            filter_end_time: result.ev_data.filter_end_time,
            newOrderComing: result.newOrderComing,
            is_list_ordered: false,
            order_list: result.ev_data.order_list,
          }
          if (result.ev_data.order_list[0].order.is_ordered == 1) {
            data.is_list_ordered = true;
            data.newOrderComing = 0;
          }
          dispatch({
              actionType: CmDriverConstants.GET_ORDERS, data
          });
      }catch (e){
      }
    },
    async getFinishedOrders(){
      try{
          const result = await OrderModule.getFinishedOrders();
          console.log(result);
          const data = {
            filter_start_time: result.ev_data.filter_start_time,
            filter_end_time: result.ev_data.filter_end_time,
            order_list: result.ev_data.order_list,
          }
          dispatch({
              actionType: CmDriverConstants.GET_FINISHED_ORDERS, data
          });
      }catch (e){
      }
    },
    async getOrderDetail(io_data){
        try{
          const data = await OrderModule.getOrderDetail(io_data);
          dispatch({
              actionType: CmDriverConstants.GET_TASK_DETAIL, data
          })
        }catch(error){
          console.log(error)
        }
      },
    async updateOrderStatus(oid, change, is_ordered){
      try{
          const updated_object = await OrderModule.changeOrderStatus(oid, change, is_ordered);
          if (is_ordered && updated_object) {
            await this.getOrders();
          } else {
            const data = {
              updated_object
            };0
            dispatch({
                actionType: CmDriverConstants.UPDATE_SINGLE_ORDER, data
            });
          }
          // if (result.ev_error == 0) {
          //   console.log(result);
          //   await this.getOrders();
          // }
      }catch (e){
      }
    },
    async cancelNotification() {
      try{
        dispatch({
            actionType: CmDriverConstants.CANCEL_NOTIFICATION,
        })
      }catch (e){
      }
    }
}
