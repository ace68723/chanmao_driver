import CmDriverConstants from '../Constants/CmDriverConstants';
import {dispatch, register} from '../Dispatchers/CmDriverDispatcher';
import {EventEmitter} from 'events';
const CHANGE_EVENT = 'change';

const CmDriverTaskDetailStore = Object.assign({},EventEmitter.prototype,{
  state:{
    items: [],
    loading: true,
  },
	emitChange() {
			this.emit(CHANGE_EVENT)
	},
	addChangeListener(callback) {
			this.on(CHANGE_EVENT, callback)
	},
	removeChangeListener(callback) {
			this.removeListener(CHANGE_EVENT, callback)
	},
  updateState(io_data) {
    console.log(io_data);
    const items = io_data.items;
    const created = io_data.created;
    const name = io_data.name;
    const total = io_data.total;
    const oid = io_data.oid;
    const user_name = io_data.user_name;
    const user_addr = io_data.user_unit + ' - ' + io_data.user_addr + ' (buzz:' + io_data.user_buzz + ')';
    const comment = io_data.comment;
    const payment_channel = io_data.payment_channel;
    const newState = Object.assign({},{items, created, name, total, oid, user_name, user_addr, comment, payment_channel});
    this.state = Object.assign({}, this.state, newState);
  },
  getState(){
    return this.state;
  },
	dispatcherIndex: register(function(action) {
	   switch(action.actionType){
				case CmDriverConstants.GET_TASK_DETAIL:
          CmDriverTaskDetailStore.updateState(action.data);
          CmDriverTaskDetailStore.emitChange();
					break;
        default:
         // do nothing
		  }

	})

});
module.exports = CmDriverTaskDetailStore;
