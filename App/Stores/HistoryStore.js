import CmDriverConstants from '../Constants/CmDriverConstants';
import {dispatch, register} from '../Dispatchers/CmDriverDispatcher';
import {EventEmitter} from 'events';
const CHANGE_EVENT = 'change';

const HistoryStore = Object.assign({},EventEmitter.prototype,{
  state:{
    orderHistory:{},
    online: false,
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
  updateHistory(data) {
      this.state.orderHistory = data;
  },

  getState(){
    return this.state;
  },
	dispatcherIndex: register(function(action) {
	   switch(action.actionType){
				case CmDriverConstants.GET_HISTORY:
          HistoryStore.updateHistory(action.data);
          HistoryStore.emitChange();
					break;
        default:
         // do nothing
		  }

	})

});
module.exports = HistoryStore;
