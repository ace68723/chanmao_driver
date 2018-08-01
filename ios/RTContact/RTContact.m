//
//  RTContact.m
//  realtimecontact
//
//  Created by 区梓贤 on 2018-06-20.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "RTContact.h"
#import <UserNotifications/UserNotifications.h>

@implementation RTContact
RCT_EXPORT_MODULE();
RCT_EXPORT_METHOD(initial:(NSString *)url
                  Authortoken:(NSString *)authortoken){
  NSString *urlToSave = url;
  [[NSUserDefaults standardUserDefaults] setObject:urlToSave forKey:@"APIurl"];
  [[NSUserDefaults standardUserDefaults] synchronize];
  
  NSString *tokenToSave = authortoken;
  [[NSUserDefaults standardUserDefaults] setObject:tokenToSave forKey:@"Authortoken"];
  [[NSUserDefaults standardUserDefaults] synchronize];
}
RCT_EXPORT_METHOD(turnOn:(BOOL)onlineStatus){
  [self setOnlineStatus:onlineStatus];
  if(onlineStatus == NO){
//    [[NSUserDefaults standardUserDefaults] removeObjectForKey:@"Authortoken"];
//    [[NSUserDefaults standardUserDefaults] removeObjectForKey:@"isOnline"];
    [[UIApplication sharedApplication] endBackgroundTask: self.bgTask];
    self.bgTask = UIBackgroundTaskInvalid;
     [self.locationManager stopUpdatingLocation];
     //CFRunLoopStop(CFRunLoopGetCurrent());
    if(self.timer){
      [self.timer invalidate];
      self.timer = nil;
    }
  }
}
- (id)init {
  //给super发送init消息：执行父类中实现的init方法
  self = [super init];//self是系统关键字。 self在方法中指代当前方法的调用者。
  //判断从父类继承过来的init方法是否初始化成功
  if (self) {
    //初始化设置
    self.locationManager = [[CLLocationManager alloc] init];
    self.locationManager.distanceFilter = kCLDistanceFilterNone;
    self.locationManager.desiredAccuracy = kCLLocationAccuracyBestForNavigation;
    
    //  if([[UIDevice currentDevice].systemVersion floatValue] >= 8.0){
    // 定位管理者需要一直请求定位服务
    [self.locationManager requestAlwaysAuthorization];
    //  }
    //  if([[UIDevice currentDevice].systemVersion floatValue] >= 9.0){
    // 需要允许后台更新数据更新
    [self.locationManager setAllowsBackgroundLocationUpdates:YES];
    //  }
    // 设置不允许暂停自动刷新数据功能
    self.locationManager.pausesLocationUpdatesAutomatically = NO;
    
  }
  //返回初始化完成的对象
  return self;
}
-(void)setOnlineStatus:(BOOL)onlineStatus{
  BOOL statusToSave = onlineStatus;
  [[NSUserDefaults standardUserDefaults] setBool:statusToSave  forKey:@"isOnline"];
  [[NSUserDefaults standardUserDefaults] synchronize];
}
-(BOOL)getOnlineStatus{
  return [[NSUserDefaults standardUserDefaults] boolForKey:@"isOnline"];
}
-(void)start{
  if([self getOnlineStatus]){
    UIApplication *app = [UIApplication sharedApplication];
    //create new uiBackgroundTask
    self.bgTask = [app beginBackgroundTaskWithExpirationHandler:^{
      dispatch_async(dispatch_get_main_queue(),^{
        if(self.bgTask != UIBackgroundTaskInvalid){
          [app endBackgroundTask:self.bgTask];
          self.bgTask = UIBackgroundTaskInvalid;
        }
      });
    }];
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0),^{
        [self.locationManager startUpdatingLocation];
        [self runLooping];
        dispatch_async(dispatch_get_main_queue(),^{
          if(self.bgTask !=UIBackgroundTaskInvalid){
            [app endBackgroundTask:self.bgTask];
            self.bgTask = UIBackgroundTaskInvalid;
          }
        });
    });
  }
 
}
-(NSTimer *)createTimer{
  NSTimer *timer =  [NSTimer scheduledTimerWithTimeInterval:30.0 repeats:YES block:^(NSTimer * _Nonnull timer) {
    NSString *result = [self sendMessage];
    NSLog(@"RESULT: %@", result);
  }];
  return timer;
}
-(void)runLooping{

  self.timer = [self createTimer];
  NSRunLoop *loop =[NSRunLoop currentRunLoop];
  [loop addTimer:self.timer forMode:NSDefaultRunLoopMode];
  [loop run];
  
}
- (NSString *) sendMessage{
  NSMutableURLRequest *request = [[NSMutableURLRequest alloc] init];
  [request setHTTPMethod:@"POST"];
  [request setValue:[[NSUserDefaults standardUserDefaults]
                     stringForKey:@"Authortoken"] forHTTPHeaderField:@"Authortoken"];
  request.timeoutInterval = 2;
  self.URL = [[NSUserDefaults standardUserDefaults]
              stringForKey:@"APIurl"];
  [request setURL:[NSURL URLWithString: self.URL]];
  
  
  NSLog(@"latitude: %lf", self.locationManager.location.coordinate.latitude);
  NSLog(@"longitude: %lf", self.locationManager.location.coordinate.longitude);
  NSNumber *log = [NSNumber numberWithDouble:self.locationManager.location.coordinate.longitude];
  NSNumber *lat = [NSNumber numberWithDouble:self.locationManager.location.coordinate.latitude];
//  [request setValue:[log stringValue] forHTTPHeaderField:@"log"];
//  [request setValue:[lat stringValue] forHTTPHeaderField:@"lat"];
  [request setValue:@"application/json" forHTTPHeaderField:@"Content-Type"];
    NSDictionary *HttpBody = @{
                    
                               @"geo_lng" : [log stringValue],
                               @"geo_lat" : [lat stringValue]};
  NSError *error = nil;
    [request setHTTPBody:[NSJSONSerialization dataWithJSONObject:HttpBody options:0 error:nil]];
  
  NSHTTPURLResponse *responseCode = nil;
  
  NSData *oResponseData = [NSURLConnection sendSynchronousRequest:request returningResponse:&responseCode error:&error];
  
  if([responseCode statusCode] != 200){
    NSLog(@"Error: %ld",(long)[responseCode statusCode]);
    return nil;
  }
  
  return [[NSString alloc] initWithData:oResponseData encoding:NSUTF8StringEncoding];
}
-(void)cleanUp{
  [[UIApplication sharedApplication] endBackgroundTask: self.bgTask];
  self.bgTask = UIBackgroundTaskInvalid;
  [self.locationManager stopUpdatingLocation];
  
  if(self.timer){
    //CFRunLoopStop(CFRunLoopGetCurrent());
    [self.timer invalidate];
    self.timer = nil;
  }
}
@end
