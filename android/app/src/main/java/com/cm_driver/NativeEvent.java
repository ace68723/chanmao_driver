package com.cm_driver;

/**
 * Created by aiden on 2017-06-06.
 */


import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import java.util.Map;

public class NativeEvent extends ReactContextBaseJavaModule {
    ReactApplicationContext mReactContext;

    public NativeEvent(ReactApplicationContext reactContext) {
        super(reactContext);
        mReactContext=reactContext;
    }
    @Override
    public String getName() {
        return "NativeEvent";
    }
    public void sendEventToJS(WritableNativeMap data) {
        mReactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("NativeEvent",data);
    }
    public void sendStringToJS(String data) {
        mReactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("NativeEvent",data);
    }
}