import CmDriverConstants from '../Constants/CmDriverConstants';
import {dispatch, register} from '../Dispatchers/CmDriverDispatcher';
import {EventEmitter} from 'events';
import {NativeModules,Platform} from 'react-native';
const CHANGE_EVENT = 'change';
import {
  getOrderList,
  getDriverStatus,
} from '../Modules/AuthModule/Auth';

const OrderStore = Object.assign({},EventEmitter.prototype,{
  state:{
    orders_list: [],
    finshed_order_list:[],
    online: false,
    newOrderComing: 0,
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
  _calculateDistance(lat1, lon1, lat2, lon2){
    var p = 0.017453292519943295;
    var c = Math.cos;
    var a = 0.5 - c((lat2 - lat1) * p)/2 +
            c(lat1 * p) * c(lat2 * p) *
            (1 - c((lon2 - lon1) * p))/2;
    return 12742 * Math.asin(Math.sqrt(a)) * 1000; // returns in meters
  },
  updateByLocation(position, data){
    const realm_orders_list = getOrderList(data);
    let ordered_list_index = 0;
    const orders_list = [];
    for (let _order of realm_orders_list) {
      if (_order.order.is_ordered == 1) {
        if (ordered_list_index < 2) {
          ordered_list_index++;
          orders_list.push(JSON.parse(JSON.stringify(_order)));
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
          const distance = OrderStore._calculateDistance(
            position.latitude,
            position.longitude,
            target[0],
            target[1],
          );
          // push only distance < 500
          if (distance <= 500){
            orders_list.push(JSON.parse(JSON.stringify(_order)));
          }
        }
      } else if (_order.order.is_ordered == 0) {
        orders_list.push(JSON.parse(JSON.stringify(_order)));
        if (_order.order.status == 10 ||
            _order.order.status == 20 ||
            _order.order.status == 30
            ) {
        }
      }
    }
    this.state.orders_list = orders_list;
    if (data.newOrderComing > 0) {
      this.state.newOrderComing = data.newOrderComing;
    }
    OrderStore.emitChange();
  },
  updateScheduledOrderList(position, order_list) {
    const result_order_list = [];
    let _numOfDoing = 0;
    for (let _order of order_list) {
      if (_order.order.is_ordered == 1) {
        result_order_list.push(JSON.parse(JSON.stringify(_order)));
        _numOfDoing++;
        // if (_numOfDoing < 2 &&
        //     ((_order.order.status == 20 && _order.order.task_id.slice(-1) == 'P') || (_order.order.status == 30 && _order.order.task_id.slice(-1) == 'D'))) {
        //   result_order_list.push(JSON.parse(JSON.stringify(_order)));
        //   _numOfDoing++;
        // } else {
        //   // only orders in delivery
        //   let target = [];
        //   switch (_order.order.status) {
        //     case 20:{
        //       target = [_order.restaurant.lat, _order.restaurant.lng];
        //     }
        //       break;
        //     case 30:{
        //       target = [_order.address.lat, _order.address.lng];
        //     }
        //       break;
        //     default: break;
        //   }
        //   // calculate distance(straight line)
        //   const distance = OrderStore._calculateDistance(
        //     position.latitude,
        //     position.longitude,
        //     target[0],
        //     target[1],
        //   );
        //   // push only distance < 500
        //   if (distance <= 500){
        //     result_order_list.push(JSON.parse(JSON.stringify(_order)));
        //     _numOfDoing++;
        //   }
        // }
      } else if (_order.order.is_ordered == 0) {
        result_order_list.push(JSON.parse(JSON.stringify(_order)));
      }
    }
    this.state.orders_list = result_order_list;
    OrderStore.emitChange();
  },
  async updateOrders(data) {
    if(Platform.OS == 'ios'){
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (data.is_list_ordered) {
            // this.state.orders_list = data.order_list;
            OrderStore.updateScheduledOrderList(position.coords, data.order_list);
          } else {
            OrderStore.updateByLocation(position.coords, data)
          }
        },
        (error) => {
          console.log(error)
        },
        {enableHighAccuracy: true, timeout: 20000}
      );
    }else{
      try{
        let position = await NativeModules.MDWampBridge.getLocation();
        if (data.is_list_ordered) {
          // this.state.orders_list = data.order_list;
          OrderStore.updateScheduledOrderList(position, data.order_list);
        } else {
          OrderStore.updateByLocation(position, data);
        }
      }catch(e){
        console.log(e);
      }
    }
  },
  updateSingleOrder(data) {
    let temp_order_lists = this.state.orders_list;
    // console.log(temp_order_lists);
    const new_order_lists = temp_order_lists.map(_order => {
      if (_order.oid === data.updated_object.oid) {
        return data.updated_object;
      } else {
        return _order;
      }
    });
    this.state.orders_list = new_order_lists;
    OrderStore.emitChange();
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
  updateFinshedOrders(data) {
    this.state.finshed_order_list = data.order_list;
    OrderStore.emitChange();
  },
  cancelNotification() {
    this.state.newOrderComing = 0;
  },
  getState(){
    return this.state;
  },
	dispatcherIndex: register(function(action) {
	   switch(action.actionType){
				case CmDriverConstants.GET_ORDERS:
          OrderStore.updateOrders(action.data);
          break;
        case CmDriverConstants.GET_FINISHED_ORDERS:
          OrderStore.updateFinshedOrders(action.data);
					break;
        case CmDriverConstants.UPDATE_SINGLE_ORDER:
          OrderStore.updateSingleOrder(action.data);
          break;
        case CmDriverConstants.UPDATE_DRIVER_STATUS:
          OrderStore.updateDriverState(action.data);
          OrderStore.emitChange();
					break;
        case CmDriverConstants.CANCEL_NOTIFICATION:
          OrderStore.cancelNotification();
          OrderStore.emitChange();
          break;
        default:
         // do nothing
		  }

	})

});
module.exports = OrderStore;
