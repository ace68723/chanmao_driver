import CmDriverHistoryAPI from './CmDriverHistoryAPI';
import AuthModule from '../AuthModule/Auth';

export default  {
  async getHistory(io_data) {
    try {
      const lo_data = {

      }
      const res = await CmDriverHistoryAPI.getHistory();
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
