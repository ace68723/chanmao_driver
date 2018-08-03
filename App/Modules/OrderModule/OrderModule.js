import Auth from '../AuthModule/Auth';
import OrderApi from './OrderApi';
import {
  updateOrderList,
} from '../AuthModule/Auth';

export default  {
    async changeOrderStatus(oid, change) {
      try {
          const token = await Auth.getToken();
          const lo_data = {
            oid: oid,
            change: change,
            token: token,
          };
          const result = await OrderApi.changeOrderStatus(lo_data);
          return result;
        } catch (e) {
          console.log(e)
          const errorMessage = 'error';
          throw errorMessage
        }
    },
    async getOrderDetail(oid) {
      try {
          const token = await Auth.getToken();
          const lo_data = {
            order_id:oid,
            token,
          };
          const result = await OrderApi.getOrderDetail(lo_data);
          if(result.ev_error === 0 ){
            const eo_data = result.ev_order;
            return eo_data
          }else{
            const errorMessage = result.ev_error;
            throw errorMessage
          }
        } catch (e) {
          console.log(e)
          const errorMessage = 'error';
          throw errorMessage
        }
    },
    async getOrderHistory(start,end,driver_id) {
      try {

          const lo_data = {
            iv_start:start,
            iv_end:end,
            driver_id:driver_id,
          };
          const changeOrderStatusResult = await OrderApi.getOrderHistory(lo_data);
          if(changeOrderStatusResult.ev_error === 0 ){
            const eo_data =changeOrderStatusResult.ev_order_history;
            return eo_data
          }else{
            const errorMessage = changeOrderStatusResult.ev_error;
            throw errorMessage
          }
        } catch (e) {
          console.log(e)
          const errorMessage = 'error';
          throw errorMessage
        }
    },
    async getOrders() {
      try {
        const token = await Auth.getToken();
        const reqData = {
          token,
        }
        const result = await OrderApi.getOrders(reqData);
        if (result.ev_error == 0) {
          const update_result = await updateOrderList(result.ev_orders);
          if (update_result === 0) {
            return result;
          }
        }
      } catch (e) {
        console.log(e)
        const errorMessage = 'error';
        throw errorMessage;
      }
    },
}
