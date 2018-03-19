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
      console.log(res)
      if(res.result == 0 ){
        return res
      } else {
        throw res.message;
      }
    } catch (e) {
      throw e;
    }
  }
}
