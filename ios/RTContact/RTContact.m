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
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0),^{
      UIApplication *app = [UIApplication sharedApplication];
      //create new uiBackgroundTask
      self.bgTask = [app beginBackgroundTaskWithExpirationHandler:^{
        [app endBackgroundTask:self.bgTask];
        self.bgTask = UIBackgroundTaskInvalid;
      }];
      [self runLooping];
    });
  }
}
-(NSTimer *)createTimer{
  NSTimer *timer =  [NSTimer scheduledTimerWithTimeInterval:4.0 repeats:YES block:^(NSTimer * _Nonnull timer) {
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
  self.location = [[CLLocation alloc] init];
  NSMutableURLRequest *request = [[NSMutableURLRequest alloc] init];
  [request setHTTPMethod:@"GET"];
  [request setValue:[[NSUserDefaults standardUserDefaults]
                     stringForKey:@"Authortoken"] forHTTPHeaderField:@"Authortoken"];
  self.URL = [[NSUserDefaults standardUserDefaults]
              stringForKey:@"APIurl"];
  [request setURL:[NSURL URLWithString: self.URL]];
  
  NSNumber *log = [NSNumber numberWithDouble:self.location.coordinate.longitude];
  NSNumber *lat = [NSNumber numberWithDouble:self.location.coordinate.latitude];
  [request setValue:[log stringValue] forHTTPHeaderField:@"log"];
  [request setValue:[lat stringValue] forHTTPHeaderField:@"lat"];
  //  NSDictionary *HttpBody = @{
  //                             @"driver_id" : @"123",
  //                             @"log" : [log stringValue],
  //                             @"lat" : [lat stringValue]};
  NSError *error = nil;
  //  [request setHTTPBody:[NSJSONSerialization dataWithJSONObject:HttpBody options:0 error:nil]];
  
  NSHTTPURLResponse *responseCode = nil;
  
  NSData *oResponseData = [NSURLConnection sendSynchronousRequest:request returningResponse:&responseCode error:&error];
  
  if([responseCode statusCode] != 200){
    NSLog(@"Error: %ld",(long)[responseCode statusCode]);
    return nil;
    
  }
  
  return [[NSString alloc] initWithData:oResponseData encoding:NSUTF8StringEncoding];
}
-(void)cleanUp{
  [[NSUserDefaults standardUserDefaults] removeObjectForKey:@"Authortoken"];
  [[NSUserDefaults standardUserDefaults] removeObjectForKey:@"isOnline"];
  [[UIApplication sharedApplication] endBackgroundTask: self.bgTask];
  self.bgTask = UIBackgroundTaskInvalid;
  if(self.timer){
    //CFRunLoopStop(CFRunLoopGetCurrent());
    [self.timer invalidate];
    self.timer = nil;
  }
}
@end
