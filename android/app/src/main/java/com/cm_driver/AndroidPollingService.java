package com.cm_driver;
import android.content.Intent;
import android.os.Bundle;
import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.jstasks.HeadlessJsTaskConfig;
<<<<<<< HEAD
import android.app.Notification;

import android.app.Service;
import android.os.IBinder;
import android.os.Binder;

import android.content.ServiceConnection;
import android.content.ComponentName;
import android.content.Context;
import android.os.RemoteException;

public class AndroidPollingService extends HeadlessJsTaskService {
  MyServiceConnection myServiceConnection;
  IBinder myBinder;
  @Override
    public void onCreate() {
        super.onCreate();
        myServiceConnection = new MyServiceConnection();
  }
  @Override
  public int onStartCommand(Intent intent, int flags, int startId) {
      //startForeground(startId, new Notification());
      // Intent innerIntent = new Intent(this, GrayInnerService.class);
      // startService(innerIntent);
      // startForeground(GRAY_SERVICE_ID, new Notification());
      AndroidPollingService.this.bindService(new Intent(AndroidPollingService.this, RemoteSurvivalService.class), myServiceConnection, Context.BIND_IMPORTANT);
      //return super.onStartCommand(intent, flags, startId);
      return START_STICKY;
  }
=======
public class AndroidPollingService extends HeadlessJsTaskService {

>>>>>>> 5394924c71a52075d090ad56ef7353a5b2a04d56
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
<<<<<<< HEAD
  @Override
  public IBinder onBind(Intent arg0) {
      myBinder = new MyBinder();
      return myBinder;
  }
    class MyServiceConnection implements ServiceConnection {

      @Override
      public void onServiceConnected(ComponentName arg0, IBinder service) {
          DualSurvivalInterface dualSurvivalInterface = DualSurvivalInterface.Stub.asInterface(service);
          System.out.println("远程服务连接成功");
      }

      @Override
      public void onServiceDisconnected(ComponentName arg0) {
          // 连接出现了异常断开了，RemoteService被杀掉了
          System.out.println("RemoteService被杀掉了");
          // 启动RemoteCastielService
          AndroidPollingService.this.startService(new Intent(AndroidPollingService.this, RemoteSurvivalService.class));
          AndroidPollingService.this.bindService(new Intent(AndroidPollingService.this, RemoteSurvivalService.class), myServiceConnection, Context.BIND_IMPORTANT);
      }

    }
    private class MyBinder extends DualSurvivalInterface.Stub{
        @Override
        public String getServiceName() throws RemoteException {
            return AndroidPollingService.class.getName();
        }

    }
}


=======
}
>>>>>>> 5394924c71a52075d090ad56ef7353a5b2a04d56
