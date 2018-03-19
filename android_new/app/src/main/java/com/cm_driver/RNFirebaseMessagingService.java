package com.cm_driver;

import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.uimanager.IllegalViewOperationException;
import com.google.firebase.iid.FirebaseInstanceId;
import com.facebook.react.bridge.Promise;

/**
 * Created by aiden on 2017-06-13.
 */

public class RNFirebaseMessagingService extends ReactContextBaseJavaModule {
    ReactApplicationContext mReactContext;

    @Override
    public String getName() {
        return "RNFirebaseMessagingService";
    }
    public RNFirebaseMessagingService (ReactApplicationContext reactContext){
        super(reactContext);
        mReactContext=reactContext;
    }

    @ReactMethod
    public void getDeviceToken(Promise promise){
        Log.d("test1","11111");
        try {
            String deviceToken = FirebaseInstanceId.getInstance().getToken();
            promise.resolve(deviceToken);
        }catch (IllegalViewOperationException e) {
            promise.reject("error",e);
        }

    }
}
