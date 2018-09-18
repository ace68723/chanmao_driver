package com.cm_driver;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import android.content.Intent;
import android.os.Bundle;
import java.util.Map;
import java.util.HashMap;

public class PollingBridgeModule extends ReactContextBaseJavaModule {
    private Intent startIntent = null;
    private Bundle bundle = null;
    private ReactApplicationContext applicationContext = null; 

    private Intent remoteIntent;
    private Bundle remoteBundle;
    public PollingBridgeModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.applicationContext = reactContext; 

    }

    @Override
    public String getName() {
        return "PollingAndroid";
    }

    @ReactMethod
    public void startPolling() {
        if(this.startIntent == null){
            this.bundle = new Bundle();
            this.bundle.putString("polling", "local");
            this.startIntent = new Intent(this.applicationContext, AndroidPollingService.class);
            this.startIntent.putExtras(this.bundle);
            this.applicationContext.startService(this.startIntent);

            this.remoteBundle = new Bundle();
            this.remoteBundle.putString("polling", "remote");
            this.remoteIntent = new Intent(this.applicationContext, RemoteSurvivalService.class);
            this.remoteIntent.putExtras(this.remoteBundle);
            this.applicationContext.startService(this.remoteIntent);
        }
            
    }
    @ReactMethod
    public void stopPolling() {
       if(this.startIntent != null){
            this.applicationContext.stopService(this.startIntent);
            this.bundle.clear();
            this.startIntent = null;
            this.bundle = null;
            
            this.applicationContext.stopService(this.remoteIntent);
            this.remoteBundle.clear();
            this.remoteIntent = null;
            this.remoteBundle = null;

       }
            
    }
}