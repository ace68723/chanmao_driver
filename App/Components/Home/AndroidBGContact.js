import OrderModule from './App/Modules/OrderModule/OrderModule';
import OrderAction from './App/Actions/OrderAction';
import OrderStore from './App/Stores/OrderStore';
import DriverAction from './App/Actions/DriverAction';

import {NativeModules} from 'react-native';
module.exports = async (taskData) => {
    // 要做的事情
    await getData();
}

function getData(){
    return new Promise((resolve)=>{
        setInterval(()=>{
            const state = Object.assign({},OrderStore.getState());
            console.log("running server")
            if(state.online){
                console.log("get data from server")
                navigator.geolocation.getCurrentPosition(
                    async(position) => {
                        try{
                            let result = await OrderModule.getOrders();
                            if(result && result.ev_error == 0 && result.ev_data.order_list[0].oid != 0){
                                console.log(JSON.stringify(result.newOrderComing))
                                NativeModules.MDWampBridge.sendNotification('New Order: #' + result.newOrderComing);
                            }
                        }catch(e){
                            console.log(e)
                        }
                        DriverAction.updateGeolocation({geo_lat: position.coords.latitude, geo_lng: position.coords.longitude});
                    },
                    (error) => {console.log(error)},
                    {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000}
                  );
            }
        },30000)
    });
}
