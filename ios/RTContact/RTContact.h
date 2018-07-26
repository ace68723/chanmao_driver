//
//  RTContact.h
//  realtimecontact
//
//  Created by 区梓贤 on 2018-06-20.
//  Copyright © 2018 Facebook. All rights reserved.
//

#ifndef RTContact_h
#define RTContact_h

#if __has_include("RCTBridgeModule.h")
#import "RCTBridgeModule.h"
#else
#import <React/RCTBridgeModule.h>
#endif

#import <UIKit/UIKit.h>
#import <CoreLocation/CoreLocation.h>

@interface RTContact : NSObject <UIApplicationDelegate,CLLocationManagerDelegate,RCTBridgeModule>

@property (nonatomic, strong) UIWindow *window;
@property (nonatomic, strong) CLLocation *location;
@property (nonatomic, strong) CLLocationManager *locationManager;
@property (nonatomic, strong) RCTResponseSenderBlock caller;
@property (nonatomic, strong) NSTimer *timer;
@property (nonatomic, copy) NSString *URL;
@property UIBackgroundTaskIdentifier bgTask;
@property (nonatomic, assign) BOOL isOnline;
- (id)init;
-(NSTimer *)createTimer;
-(void)runLooping;
-(NSString *) sendMessage;
-(void)cleanUp;
-(void)start;
@end

#endif /* RTContact_h */
