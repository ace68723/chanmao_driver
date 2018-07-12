package com.cm_driver;

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

import rx.functions.Action0;
import rx.functions.Action1;
import rx.Subscription;
import ws.wamp.jawampa.WampClient;
import ws.wamp.jawampa.WampClientBuilder;
import ws.wamp.jawampa.connection.IWampConnectorProvider;
import ws.wamp.jawampa.transport.netty.NettyWampClientConnectorProvider;
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
                                            Log.d("Msg", "Received event test.event with value " + String.valueOf(t1));
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
    @ReactMethod
    public void disconnect (){
        client.close().toBlocking().last();
    }
}

























