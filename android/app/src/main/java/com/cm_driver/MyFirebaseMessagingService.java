package com.cm_driver;

import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.media.AudioRecord;
import android.media.RingtoneManager;
import android.net.Uri;
import android.support.v4.app.NotificationCompat;
import android.util.Log;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

import java.util.Map;

import static android.app.PendingIntent.FLAG_CANCEL_CURRENT;
import static android.content.ClipData.newIntent;
import static java.lang.Thread.sleep;

/**
 * Created by aiden on 2017-06-13.
 */

public class MyFirebaseMessagingService extends FirebaseMessagingService {

    @Override
    public void onCreate(){
        super.onCreate();
        Log.d("service", "onCreate MyFirebaseMessagingService");
    }

    public static final int DEFAULT_NOTIFICATION_ID = 1;

    @Override
    public void onMessageReceived(RemoteMessage remoteMessage){
//        super.onMessageReceived(remoteMessage);
        Log.d("service", "onMessageReceived: ");
        if(remoteMessage.getData().size()>0){
            Log.d("service", "onMessageReceived: " + remoteMessage.getData());
            sendNotification(remoteMessage.getData());
            //play sound and vibrate
//            Uri notification = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
//            Ringtone r = RingtoneManager.getRingtone(getApplicationContext(), notification);
//            r.play();
//
//            Vibrator vibrator = (Vibrator) getSystemService(Context.VIBRATOR_SERVICE);
//            vibrator.vibrate(200);
        }
        if(remoteMessage.getNotification() != null){
            Log.d("service","111114");
            Log.d("service2",String.valueOf(remoteMessage));
//            sendNotification(remoteMessage.getNotification().getBody());


            //play sound and vibrat
//            Uri notification = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
//            Ringtone r = RingtoneManager.getRingtone(getApplicationContext(), notification);
//            r.play();
//
//            Vibrator vibrator = (Vibrator) getSystemService(Context.VIBRATOR_SERVICE);
//            vibrator.vibrate(200);
//            Intent intent = new Intent(this, MainActivity.class);
//            intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
//            PendingIntent pendingIntent = PendingIntent.getActivity(this, 0 /* Request code */, intent,
//                    PendingIntent.FLAG_ONE_SHOT);
//
////            Uri defaultSoundUri= RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
//
//            NotificationCompat.Builder notificationBuilder = new NotificationCompat.Builder(this)
//                    .setSmallIcon(R.drawable.ic_stat_ic_notification)
//                    .setContentTitle("FCM Message")
//                    .setContentText("FCM Message")
//                    .setAutoCancel(true)
//                    .setTicker( "通知到来" )
//                    // 通知首次出现在通知栏，带上升动画效果的
//                    .setWhen( System.currentTimeMillis() )
//                    // 通知产生的时间，会在通知信息里显示
//                    // 向通知添加声音、闪灯和振动效果的最简单、最一致的方式是使用当前的用户默认设置，使用defaults属性，可以组合：
//                    .setDefaults( Notification.DEFAULT_VIBRATE | Notification.DEFAULT_ALL | Notification.DEFAULT_SOUND )
//                    .setContentIntent(pendingIntent);
//
//            NotificationManager notificationManager =
//                    (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
//            notificationManager.notify(DEFAULT_NOTIFICATION_ID, notificationBuilder.build());



//            NotificationCompat.Builder notifyBuilder =
//                    new NotificationCompat.Builder( mContext ).setContentTitle( "FCM Message" )
//                            .setContentText( "FCM Message" )
//                            .setSmallIcon( R.drawable.ic_stat_ic_notification )
//                            // 点击消失
//                            .setAutoCancel( true )
//                            // 设置该通知优先级
//                            .setPriority( Notification.PRIORITY_MAX )
//                            .setLargeIcon( BitmapFactory.decodeResource( mContext.getResources(), R.drawable.ic_stat_ic_notification ) )
//                            .setTicker( "FCM Message" )
//                            // 通知首次出现在通知栏，带上升动画效果的
//                            .setWhen( System.currentTimeMillis() )
//                            // 通知产生的时间，会在通知信息里显示
//                            // 向通知添加声音、闪灯和振动效果的最简单、最一致的方式是使用当前的用户默认设置，使用defaults属性，可以组合：
//                            .setDefaults( Notification.DEFAULT_VIBRATE | Notification.DEFAULT_ALL | Notification.DEFAULT_SOUND );
//            PendingIntent resultPendingIntent =
//                    PendingIntent.getActivity( mContext, 0, mResultIntent, PendingIntent.FLAG_UPDATE_CURRENT );
//            notifyBuilder.setContentIntent( resultPendingIntent );
//            mNotifyMgr.notify( mNotificationId, notifyBuilder.build() );



//            NotificationCompat.Builder mBuilder =
//                    new NotificationCompat.Builder(this)
//                            .setSmallIcon(R.drawable.ic_media_play)
//                            .setContentTitle("My notification")
//                            .setContentText("Hello World!")
//                            .setDefaults(Notification.DEFAULT_ALL)
//                            .setPriority(Notification.PRIORITY_HIGH);

        }
    }

    private void sendNotification(Map message) {
        Intent intent = new Intent(this, MainActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent pendingIntent = PendingIntent.getActivity(this, 0 /* Request code */, intent,
                PendingIntent.FLAG_ONE_SHOT);

        Uri defaultSoundUri= RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
        NotificationCompat.Builder notificationBuilder = new NotificationCompat.Builder(this)
                .setColor(Color.RED)
                .setLargeIcon(BitmapFactory.decodeResource(getResources(),R.mipmap.ic_launcher))
                .setContentTitle((String) message.get("title"))
                .setContentText((String) message.get("body"))
                .setAutoCancel(true)
                .setSound(defaultSoundUri)
                .setContentIntent(pendingIntent)
                .setPriority(Notification.PRIORITY_MAX)
                .setDefaults(Notification.DEFAULT_VIBRATE);

        NotificationManager notificationManager =
                (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);

        notificationManager.notify(0 /* ID of notification */, notificationBuilder.build());
    }
    @Override
    public void onMessageSent(String s)
    {
        super.onMessageSent(s);
    }


}

