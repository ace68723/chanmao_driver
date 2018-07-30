import CmDriverHistoryAPI from './CmDriverHistoryAPI';
import Auth from '../AuthModule/Auth';

export default  {
  async getHistory() {
    try {
      const token = await Auth.getToken();
      const reqData = {
        token,
      }
      const res = await CmDriverHistoryAPI.getHistory(reqData);
      if(res.ev_error == 0 ){
        return res.ev_orders
      } else {
        throw res.ev_message;
      }
    } catch (e) {
      throw e;
    }
  }
}
