package com.cm_driver;

import android.app.Activity;
import android.os.Bundle;

import com.facebook.react.ReactActivity;

import cn.jpush.android.api.JPushInterface;

public class MainActivity extends ReactActivity {
    private static Activity mCurrentMainActivity = null;
    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "cm_driver";
    }
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mCurrentMainActivity = this;
        JPushInterface.init(this);
    }

    public static Activity getActivity() {
        Activity activity = mCurrentMainActivity;
        return activity;
    }
    @Override
    protected void onPause() {
        super.onPause();
        JPushInterface.onPause(this);
    }

    @Override
    protected void onResume() {
        super.onResume();
        JPushInterface.onResume(this);
    }
}
