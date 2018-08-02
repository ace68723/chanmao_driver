import CmDriverConstants from '../Constants/CmDriverConstants';
import {dispatch, register} from '../Dispatchers/CmDriverDispatcher';
import {EventEmitter} from 'events';
const CHANGE_EVENT = 'change';

const OrderStore = Object.assign({},EventEmitter.prototype,{
  state:{
    orders_list: [],
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
  updateOrders(data) {
      this.state.orders_list = data;
  },
  updateDriverState(data) {
    if (data === 2) {
      this.state.online = true;
    }
    else {
      this.state.online = false;
    }
  },
  getState(){
    return this.state;
  },
	dispatcherIndex: register(function(action) {
	   switch(action.actionType){
				case CmDriverConstants.GET_ORDERS:
          OrderStore.updateOrders(action.data);
          OrderStore.emitChange();
					break;
        case CmDriverConstants.GET_ORDERS_FAILED:
          // OrderStore.updateOrders(OrderStore.getState());
          OrderStore.emitChange();
					break;
        case CmDriverConstants.UPDATE_DRIVER_STATUS:
          OrderStore.updateDriverState(action.data);
          OrderStore.emitChange();
					break;
        default:
         // do nothing
		  }

	})

});
module.exports = OrderStore;
