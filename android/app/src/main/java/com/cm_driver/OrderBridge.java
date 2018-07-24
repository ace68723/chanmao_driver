package com.cm_driver;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class OrderBridge extends ReactContextBaseJavaModule {
    ReactApplicationContext mReactContext;
    public OrderBridge(ReactApplicationContext reactContext) {
        super(reactContext);

        mReactContext=reactContext;
    }

    @Override
    public String getName() {
        return "OrderBridge";
    }

    public static boolean isRecursionEnable = true;

//    void runInBackground() {
//        if (!isRecursionEnable)
//            return;    // Handle not to start multiple parallel threads
//
//        // isRecursionEnable = false; when u want to stop
//        // on exception on thread make it true again
//        new Thread(new Runnable() {
//            @Override
//            public void run() {
//                // DO your work here
//                // get the data
//                if (activity_is_not_in_background) {
//                    runOnUiThread(new Runnable() {
//                        @Override
//                        public void run() {
//                            //uddate UI
//                            runInBackground();
//                        }
//                    });
//                } else {
//                    runInBackground();
//                }
//            }
//        }).start();
//    }


}
