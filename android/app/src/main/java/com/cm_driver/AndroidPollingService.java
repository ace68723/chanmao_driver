package com.cm_driver;
import android.content.Intent;
import android.os.Bundle;
import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.jstasks.HeadlessJsTaskConfig;
import android.app.Notification;
public class AndroidPollingService extends HeadlessJsTaskService {
  @Override
  public int onStartCommand(Intent intent, int flags, int startId) {
      startForeground(startId, new Notification());
      return START_STICKY;
  }
  @Override
  protected HeadlessJsTaskConfig getTaskConfig(Intent intent) {
    Bundle extras = intent.getExtras();
    if (extras != null) {
      return new HeadlessJsTaskConfig(
          "AndroidBGContact",
          Arguments.fromBundle(extras),
          0, // 任务的超时时间
          true // 可选参数：是否允许任务在前台运行，默认为false
        );
    }
    return null;
  }
  
}

