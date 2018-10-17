import CmDriverHistoryAPI from './CmDriverHistoryAPI';
import Auth from '../AuthModule/Auth';

export default  {
  async getHistory(startTime, endTime) {
    try {
      const start_time =  Date.parse(startTime)/1000 + 60*60*6;
      const end_time = Date.parse(endTime)/1000 + 60*60*30;
      const token = await Auth.getToken();
      const reqData = {
        token,
        start_time,
        end_time
      }
      const res = await CmDriverHistoryAPI.getHistory(reqData);
      if(res.ev_error == 0 ){
        return res.result
      } else {
        throw res.ev_message;
      }
    } catch (e) {
      console.log(e)
      throw e;
    }
  }
}
