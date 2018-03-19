package com.cm_driver;

import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.media.RingtoneManager;
import android.net.Uri;
import android.support.v4.app.NotificationCompat;
import android.util.Log;

import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;


/**
 * Created by HongJay on 2016/12/10.
 */
public class MyFirebaseMessagingService extends FirebaseMessagingService {
    @Override
    public void onCreate() {
        super.onCreate();
        Log.i("Service", "消息服务已启动");
    }

    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {
        super.onMessageReceived(remoteMessage);
        Log.i("Service", "===============通知来啦=================");
//        Log.i("Service", "onMessageReceived: " + remoteMessage.getFrom());
        if (remoteMessage.getData().size() > 0) {
            Log.i("Service", "" + remoteMessage.getData());
        }
        if (remoteMessage.getNotification() != null) {
            Log.i("Service", "" + remoteMessage.getNotification().getBody());
            Log.i("Service1", "" + remoteMessage.getNotification().getTitle());
            Log.i("Service2", "" + remoteMessage.getNotification().getTag());
            Log.i("Service3", "" + remoteMessage.getNotification());
//            sendNotification(remoteMessage.getNotification().getBody());
        }


    }
}