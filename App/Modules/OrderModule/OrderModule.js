import Auth from '../AuthModule/Auth';
import OrderApi from './OrderApi';
import {
  updateOrderList,
  updateSingleOrder,
} from '../AuthModule/Auth';

export default  {
    async changeOrderStatus(oid, change, is_ordered) {
      try {
          const token = await Auth.getToken();
          const lo_data = {
            oid: oid,
            change: change,
            token: token,
          };
          const result = await OrderApi.changeOrderStatus(lo_data);
          if (result.ev_error == 0) {
              if(result.ev_order.order.version >= '2.8.4') {
                result.ev_order.order.comment = '小费已收| ' + result.ev_order.order.comment;
              } else if (result.ev_order.order.version < '2.8.4'&& result.ev_order.order.payment_channel !== 0){
               result.ev_order.order.charge_total = (parseFloat(result.ev_order.order.total) + parseFloat(result.ev_order.order.tips)).toString();
               result.ev_order.order.comment = '小费已收| ' + result.ev_order.order.comment;
             }else if (result.ev_order.order.version < '2.8.4' && result.ev_order.order.payment_channel == 0) {
                result.ev_order.order.comment = '小费未收| ' + result.ev_order.order.comment;
                result.ev_order.order.charge_total = result.ev_order.order.total
              } 
            if (!is_ordered) {
              await updateSingleOrder(result.ev_order);
            }
            return result.ev_order;
          }
        } catch (e) {
          console.log(e)
          const errorMessage = 'error';
          throw errorMessage
        }
    },
    async getOrderDetail(io_data) {
      try {
        const token = await Auth.getToken();
        const lo_data = {
          oid: io_data.oid,
          token,
        }
        const res = await OrderApi.getOrderDetail(lo_data);
        if(res.ev_error == 0 ){
          return res.ev_order
        } else {
          throw res.ev_message;
        }
      } catch (e) {
        throw e;
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
            result.ev_data.order_list.forEach((item)=>{
             if(item.order.version >= '2.8.4') {
               item.order.comment = '小费已收| ' + item.order.comment;
               } else if (item.order.version < '2.8.4'&& item.order.payment_channel !== 0){
              item.order.charge_total = (parseFloat(item.order.total) + parseFloat(item.order.tips)).toString();
              item.order.comment = '小费已收| ' + item.order.comment;
              } else if (item.order.version < '2.8.4' && item.order.payment_channel == 0) {
               item.order.comment = '小费未收| ' + item.order.comment;
               item.order.charge_total = item.order.total
              } 
            })
            result.ev_data.order_list.forEach((item)=>{
                if(item.order.payment_channel !== 0) {
                   if(item.order.charge_total !== item.order.first_charge) {
                     if(parseFloat(item.order.charge_total) - parseFloat(item.order.first_charge) > 0) {
                       item.order.diff = '应多收客人' + ((parseFloat(item.order.charge_total) - parseFloat(item.order.first_charge)).toFixed(2)).toString() 
                     } else if (parseFloat(item.order.charge_total) - parseFloat(item.order.first_charge) < 0) {
                      item.order.diff = '应退还客人' + ((parseFloat(item.order.first_charge) - parseFloat(item.order.charge_total)).toFixed(2)).toString()
                     } else {
                      item.order.diff = ""
                     }
                   }
                } else {
                  item.order.diff = ""
                }
            })
         if (result.ev_data.order_list.length !== 0 && result.ev_data.order_list[0].order.is_ordered == 0) {
          const update_result = await updateOrderList(result.ev_data);
          result.newOrderComing = update_result;
        }
        console.log(result)

        return result;
        
        }
      } catch (e) {
        console.log(e)
        const errorMessage = 'error';
        throw errorMessage;
      }
    },
    async getFinishedOrders() {
      try {
        const token = await Auth.getToken();
        const reqData = {
          token,
        }
        const result = await OrderApi.getFinishedOrders(reqData);
        if (result.ev_error == 0) {
          result.ev_data.order_list.forEach((item)=>{
            if(item.order.version >= '2.8.4') {
              item.order.comment = '小费已收| ' + item.order.comment;
            } else if (item.order.version < '2.8.4'&& item.order.payment_channel !== 0){
             item.order.charge_total = (parseFloat(item.order.total) + parseFloat(item.order.tips)).toString();
             item.order.comment = '小费已收| ' + item.order.comment;
           }else if (item.order.version < '2.8.4' && item.order.payment_channel == 0) {
              item.order.comment = '小费未收| ' + item.order.comment;
              item.order.charge_total = item.order.total
            } 
        })
        result.ev_data.order_list.forEach((item)=>{
          if(item.order.payment_channel !== 0) {
             if(item.order.charge_total !== item.order.first_charge) {
               if(parseFloat(item.order.charge_total) - parseFloat(item.order.first_charge) > 0) {
                 item.order.diff = '应多收客人' + ((parseFloat(item.order.charge_total) - parseFloat(item.order.first_charge)).toFixed(2)).toString() 
               } else if (parseFloat(item.order.charge_total) - parseFloat(item.order.first_charge) < 0) {
                item.order.diff = '应退还客人' + ((parseFloat(item.order.first_charge) - parseFloat(item.order.charge_total)).toFixed(2)).toString()
               } else {
                item.order.diff = ""
               }
             }
          } else {
            item.order.diff = ""
          }
      })
          return result;
        }
      } catch (e) {
        console.log(e)
        const errorMessage = 'error';
        throw errorMessage;
      }
    },
}
