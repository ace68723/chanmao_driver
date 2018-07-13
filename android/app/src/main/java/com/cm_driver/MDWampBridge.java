package com.cm_driver;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Build;
import android.support.v4.app.NotificationCompat;
import android.util.Log;

import com.cm_driver.CmAuth;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.bridge.WritableNativeMap;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;


import org.msgpack.value.StringValue;

import java.util.Map;

import rx.functions.Action0;
import rx.functions.Action1;
import rx.Subscription;
import ws.wamp.jawampa.WampClient;
import ws.wamp.jawampa.WampClientBuilder;
import ws.wamp.jawampa.connection.IWampConnectorProvider;
import ws.wamp.jawampa.transport.netty.NettyWampClientConnectorProvider;

import static android.content.Context.NOTIFICATION_SERVICE;

/**
 * Created by aiden on 2017-06-07.
 */

public class MDWampBridge extends ReactContextBaseJavaModule {
    ReactApplicationContext mReactContext;
    WampClient client;
    Subscription eventSubscription;

    private static String _host = "23.92.16.26";
    private static String _port = "7474";

    public MDWampBridge(ReactApplicationContext reactContext) {
        super(reactContext);
        mReactContext=reactContext;
    }

    @Override
    public String getName() {
        return "MDWampBridge";
    }

    @ReactMethod
    public void startMDWamp(String token) {
        Log.d("Msg","token: "+token);
        IWampConnectorProvider connectorProvider = new NettyWampClientConnectorProvider();
        try {

            // Create a builder and configure the client
            WampClientBuilder builder = new WampClientBuilder();
            builder.withConnectorProvider(connectorProvider)
                    .withUri(String.format("ws://%s:%s/ws", _host, _port))
                    .withRealm("realm2")
                    .withStrictUriValidation(false)
                    .withAuthMethod(new CmAuth(token));
            // Create a client through the builder. This will not immediatly start
            // a connection attempt
            client = builder.build();
            statusChanged();
        } catch (Exception e) {
            // Catch exceptions that will be thrown in case of invalid configuration
            System.out.println(e);
            return;
        }
    }

    private void statusChanged(){

        client.statusChanged()
                .subscribe(new Action1<WampClient.State>() {
                    @Override
                    public void call(WampClient.State t1) {
                        if (t1 instanceof WampClient.ConnectedState) {
                            Log.d("Msg42", String.valueOf(((WampClient.ConnectedState) t1).welcomeDetails()));
                            String driver_id = ((WampClient.ConnectedState) t1).welcomeDetails().get("data").get("driver_id").textValue();

                            eventSubscription = client.makeSubscription(driver_id,ObjectNode.class)
                                    .subscribe(new Action1<ObjectNode>() {
                                        @Override
                                        public void call(ObjectNode t1) {
                                            Log.d("Msg", "Received event test.event with value1 " + String.valueOf(t1));
                                            String type=String.valueOf(t1);
                                            int index=type.indexOf("ord_in");
                                            if (index>0) sendNotification("new order"); else sendNotification("order cancel");
                                            t1.put("type","MDWamp");
                                            String data = String.valueOf(t1);
                                            NativeEvent nativeEvent = new NativeEvent(mReactContext);
                                            nativeEvent.sendStringToJS(data);
                                        }
                                    }, new Action1<Throwable>() {
                                        @Override
                                        public void call(Throwable t1) {
                                            Log.d("Msg","Completed event test.event with error " + t1);
                                        }
                                    }, new Action0() {
                                        @Override
                                        public void call() {
                                            Log.d("Msg","Completed event test.event");
                                        }

                                    });
                            Log.d("eventSubscription",  String.valueOf(eventSubscription.isUnsubscribed()));
                            Log.d("toString",eventSubscription.toString());
                            if(!eventSubscription.isUnsubscribed()){
                                WritableNativeMap data = new WritableNativeMap();
                                data.putString("driver_id",driver_id);
                                data.putString("type","MDWamp");
                                data.putString("scenario","subscribed");
                                NativeEvent nativeEvent = new NativeEvent(mReactContext);
                                nativeEvent.sendEventToJS(data);
                            }

                        }
                    }
                });
        client.open();
    }
    @ReactMethod
    public void call(String topic,ReadableArray ia_data){
        final String returnTopic = topic;
        Object[] array = new Object[ia_data.size()];
        for (int i = 0; i < ia_data.size(); i++) {
            ReadableType type = ia_data.getType(i);
            switch (type) {
                case Null:
                    array[i] = null;
                    break;
                case String:
                    array[i] = ia_data.getString(i);
                    break;
            }
        }
        client.call(topic, ObjectNode.class, array).subscribe(new Action1<ObjectNode>() {
            @Override
            public void call(ObjectNode t1) {
                Log.d("call successful", String.valueOf(t1));
                String scenario = t1.get("scenario").textValue();
                t1.put("type","MDWamp");
                String data = String.valueOf(t1);
                NativeEvent nativeEvent = new NativeEvent(mReactContext);
                nativeEvent.sendStringToJS(data);
//                WritableNativeMap data = new WritableNativeMap();
//                data.putString("data", String.valueOf(t1));

            }
        }, new Action1<Throwable>() {
            @Override
            public void call(Throwable t1) {
                Log.d("call error", String.valueOf(t1));
//                nrCalls--;
//                nrErrors++;
//                if (nrCalls != 0) {
//                    makeNextCall();
//                } else {
//                    stopTime = System.currentTimeMillis();
//                    waitLatch.countDown();
//                }
            }

        });
    }

    private void sendNotification(String topic) {
        Intent intent = new Intent(mReactContext, MainActivity.class);
        PendingIntent contentIntent = PendingIntent.getActivity(mReactContext, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT);
        final NotificationManager manager = (NotificationManager)mReactContext.getSystemService(NOTIFICATION_SERVICE);

        NotificationCompat.Builder b = new NotificationCompat.Builder(mReactContext);
        String channelID="channel1";
        String channelName="channel1";
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(channelID, channelName,  4);
            manager.createNotificationChannel(channel);
        }

        b.setAutoCancel(true)
                .setDefaults(Notification.DEFAULT_ALL)
                .setWhen(System.currentTimeMillis())
                .setSmallIcon(R.mipmap.ic_launcher)
                .setTicker("Hearty365")
                .setContentTitle(topic)
                .setContentText(topic)
                .setDefaults(Notification.DEFAULT_LIGHTS| Notification.DEFAULT_SOUND)
                .setContentIntent(contentIntent)
                .setContentInfo("Info")
                .setChannelId(channelID);

        NotificationManager notificationManager = (NotificationManager) mReactContext.getSystemService(NOTIFICATION_SERVICE);
        notificationManager.notify(1, b.build());
    }

    @ReactMethod
    public void disconnect (){
        client.close().toBlocking().last();
    }
}
