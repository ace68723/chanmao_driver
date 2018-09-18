package com.cm_driver;
import android.app.Service;
import android.os.IBinder;
import android.os.Binder;
import android.content.ServiceConnection;
import android.content.ComponentName;
import android.content.Intent;
import android.app.Notification;
import android.content.Context;
import android.os.RemoteException;

import android.support.v4.app.NotificationCompat;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.os.Build;
public class RemoteSurvivalService extends Service {
    MyServiceConnection myServiceConnection;
    MyBinder myBinder;
    @Override
    public void onCreate() {
        super.onCreate();
        myServiceConnection = new MyServiceConnection();
        
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        System.out.println("Start remote!!!");
        this.bindService(new Intent(this, AndroidPollingService.class), myServiceConnection, Context.BIND_IMPORTANT);
        
        NotificationManager manager = (NotificationManager)getSystemService(NOTIFICATION_SERVICE);
        String channelID="channel2";
        String channelName="channel2";
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(channelID, channelName,  NotificationManager.IMPORTANCE_HIGH);
            manager.createNotificationChannel(channel);
        }
        NotificationCompat.Builder b = new NotificationCompat.Builder(this);
        b.setAutoCancel(true)
        .setSmallIcon(R.mipmap.ic_launcher)
        .setContentTitle("Chanmao")
        .setContentText("馋猫正在后台运行。")
        .setOngoing(true)
        .setChannelId(channelID);

        manager.notify(2, b.build());
        //设置service为前台进程，避免手机休眠时系统自动杀掉该服务
        //startForeground(startId, new Notification());
        return START_STICKY;
    }
   

    class MyServiceConnection implements ServiceConnection {

        @Override
        public void onServiceConnected(ComponentName arg0, IBinder service) {
            DualSurvivalInterface dualSurvivalInterface = DualSurvivalInterface.Stub.asInterface(service);
            System.out.println("连接成功!");
        }

        @Override
        public void onServiceDisconnected(ComponentName arg0) {
            System.out.println("连接断开!");
            // 启动LocalCastielService
            RemoteSurvivalService.this.startService(new Intent(RemoteSurvivalService.this, AndroidPollingService.class));
            RemoteSurvivalService.this.bindService(new Intent(RemoteSurvivalService.this, AndroidPollingService.class), myServiceConnection, Context.BIND_IMPORTANT);
        }

    }

     @Override
    public IBinder onBind(Intent arg0) {
        myBinder = new MyBinder();
        return myBinder;
    }
    private class MyBinder extends DualSurvivalInterface.Stub{

        @Override
        public String getServiceName() throws RemoteException {
            return RemoteSurvivalService.class.getName();
        }

    }

}