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
    }
}
