package com.cm_driver;

/**
 * Created by aiden on 2017-06-06.
 */


import android.widget.Toast;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.Map;


public class ToastModule extends ReactContextBaseJavaModule {
    ReactApplicationContext mReactContext;

    public ToastModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mReactContext=reactContext;
    }
    @Override
    public String getName() {
        return "ToastModule";
    }
    @ReactMethod
    public void show(String message, int duration) {
        Toast.makeText(getReactApplicationContext(), message, duration).show();
        NativeEvent nativeEvent = new NativeEvent(mReactContext);
//        nativeEvent.sendEventToJS();
    }
}