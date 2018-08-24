import OrderModule from '../../Modules/OrderModule/OrderModule';
import OrderAction from '../../Actions/OrderAction';
import OrderStore from '../../Stores/OrderStore';
import DriverAction from '../../Actions/DriverAction';

import {NativeModules, AppState} from 'react-native';
module.exports = async (taskData) => {
    // 要做的事情
    let state;
    do{
        state = Object.assign({},OrderStore.getState());
        await getData();
    }while(state.online);
}

function getData(){
    return new Promise((resolve)=>{
        let timeOut = setTimeout(async()=>{
                try{
                    if(AppState.currentState != 'active'){
                        let result = await OrderModule.getOrders();
                        if(result && result.ev_error == 0 && result.newOrderComing != 0){
                            NativeModules.MDWampBridge.sendNotification('New Order: #' + result.newOrderComing);
                        }
                    }else{
                        OrderAction.getOrders();
                    }
                    let obj =  await NativeModules.MDWampBridge.getLocation();
                    DriverAction.updateGeolocation({geo_lat: obj.latitude, geo_lng: obj.longitude});
                    resolve(1)
                }catch(e){
                    console.log(e)
                }
        },30000)
       
    });
}
