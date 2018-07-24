import CmLocationAPI from './CmLocationAPI';

export default  {
  async sendLocation(io_data) {
    try {
      const res = await CmLocationAPI.sendLocation(io_data);
      console.log(res)
      if(res.ev_error == 0 ){
        return res.ev_message;
      } else {
        throw res.ev_message;
      }
    } catch (e) {
      throw e;
    }
  }
}
