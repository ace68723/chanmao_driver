import Auth from '../AuthModule/Auth';
import OrderApi from './OrderApi';
export default  {
    async changeOrderStatus(oid, change) {
      try {
          const token = await Auth.getToken();
          const lo_data = {
            oid: oid,
            change: change,
            token: token,
          };
          const changeOrderStatusResult = await OrderApi.changeOrderStatus(lo_data);

          if(changeOrderStatusResult.result === 0 ){
            const eo_data ={}
            return eo_data
          }else{
            const errorMessage = changeOrderStatusResult.message;
            throw errorMessage
          }
        } catch (e) {
          console.log(e)
          const errorMessage = 'error';
          throw errorMessage
        }
    },
    async getOrderDetail(oid) {
      try {

          const lo_data = {
            order_id:oid,
          };
          const changeOrderStatusResult = await OrderApi.getOrderDetail(lo_data);
          // console.log('777', changeOrderStatusResult.ev_error);
          if(changeOrderStatusResult.ev_error === 0 ){
            const eo_data =changeOrderStatusResult.ev_order;
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
    async updateOrders() {
      try {
        console.log('In orderModule');
        const result = await OrderApi.updateOrders();
        console.log(result);
        return result;
      } catch (e) {
        console.log(e)
        const errorMessage = 'error';
        throw errorMessage;
      }
    }
}
