import CmDriverTaskDetailAPI from './CmDriverTaskDetailAPI';
import AuthModule from '../AuthModule/Auth';

export default  {
  async getTaskDetail(io_data) {
    try {
      const lo_data = {
        oid: io_data.oid,
        authortoken: AuthModule.getToken(),
      }
      const res = await CmDriverTaskDetailAPI.getTaskDetail(lo_data);
      if(res.ev_error == 0 ){
        return res.ev_order
      } else {
        throw res.ev_message;
      }
    } catch (e) {
      throw e;
    }
  }
}
