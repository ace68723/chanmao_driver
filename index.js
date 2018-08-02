//
// import React, { Component } from 'react';
// import {
//   AppRegistry,
//   Platform,
// } from 'react-native';
// import AndroidApp from './androidApp';
// import IosApp from './iosApp';
// import test from './test';
//
//
// export default class cmDriver extends Component {
//
//
//   render() {
//       if (Platform.OS==='android'){
//       return (
//            <AndroidApp />
//       );
//
//     }else{
//       return (
//            <IosApp />
//       );
//     }
//   }
// }
//
// AppRegistry.registerComponent('cm_driver', () => cmDriver);


import {
  Platform,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
const { registerScreens } = require('./screens');

Navigation.events().registerAppLaunchedListener(() => {
  registerScreens();
  if (Platform.OS == 'ios') {
    Navigation.setRoot({
      root: {
        stack: {
          id: 'iosApp',
          children: [
            {
              component: {
                name: 'iosApp'
              }
            }
          ]
        }
      }
    });
  } else {
    Navigation.setRoot({
      root: {
        stack: {
          id: 'androidApp',
          children: [
            {
              component: {
                name: 'androidApp'
              }
            }
          ]
        }
      }
    });
  }
});
