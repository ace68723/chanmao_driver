import CmDriverConstants from '../Constants/CmDriverConstants';
import {dispatch, register} from '../Dispatchers/CmDriverDispatcher';
import {EventEmitter} from 'events';
const CHANGE_EVENT = 'change';
import {
  getOrderList,
  getDriverStatus,
} from '../Modules/AuthModule/Auth';

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
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const realm_orders_list = getOrderList();
          let ordered_list_index = 0;
          const orders_list = [];
          let _numOfDoing = 0;
          for (let _order of realm_orders_list) {
            if (_order.order.is_ordered == 1) {
              if (ordered_list_index < 2) {
                ordered_list_index++;
                orders_list.push(_order);
                _numOfDoing++;
              } else {
                // only orders in delivery
                let target = [];
                switch (_order.order.task_id.slice(-1)) {
                  case 'P':{
                    target = [_order.restaurant.lat, _order.restaurant.lng];
                  }
                    break;
                  case 'D':{
                    target = [_order.address.lat, _order.address.lng];
                  }
                    break;
                  default: break;
                }
                // calculate distance(straight line)
                const distance = this._calculateDistance(
                  position.coords.latitude,
                  position.coords.longitude,
                  target[0],
                  target[1],
                );
                // push only distance < 500
                if (distance <= 500){
                  orders_list.push(_order);
                  _numOfDoing++;
                }
              }
            } else if (_order.order.is_ordered == 0) {
              if (_order.order.status == 10 ||
                  _order.order.status == 20 ||
                  _order.order.status == 30
                  ) {
                orders_list.push(_order);
                _numOfDoing++;
              }
            }
          }
          for (let _order of realm_orders_list) {
            if (_order.order.status != 10 &&
                _order.order.status != 20 &&
                _order.order.status != 30
              ) {
                orders_list.push(_order);
              }
          }
          this.state.orders_list = orders_list;
          OrderStore.emitChange();
        },
        (error) => {
          console.log(error)
        },
        {enableHighAccuracy: true, timeout: 20000}
      );
  },
  updateDriverState(data) {
    const realm_driver_status = getDriverStatus();
    if (realm_driver_status === 'online') {
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
