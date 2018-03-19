import CmDriverConstants from '../Constants/CmDriverConstants';
import {dispatch, register} from '../Dispatchers/CmDriverDispatcher';
import CmDriverTaskDetailModule from '../Modules/CmDriverTaskDetailModule/CmDriverTaskDetailModule';
export default {
  async getTaskDetailAction(io_data){
      try{
        const data = await CmDriverTaskDetailModule.getTaskDetail(io_data);
        dispatch({
            actionType: CmDriverConstants.GET_TASK_DETAIL, data
        })
      }catch(error){
        console.log(error)
      }
    },
}
