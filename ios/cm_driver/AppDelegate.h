/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <UIKit/UIKit.h>
#import "RTContact.h"

static NSString *appKey = @"45949d1322eb554d66c31478";    //填写appkey

static NSString *channel = @"";    //填写channel  一般为nil

static BOOL isProduction = false;  //填写isProdurion  平时测试时为false ，生产时填写true

@interface AppDelegate : UIResponder <UIApplicationDelegate>

@property (nonatomic, strong) UIWindow *window;
@property (nonatomic, strong) RTContact *testContact;
@end
