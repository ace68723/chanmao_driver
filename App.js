import React, { Component } from 'react';
import {
  AppRegistry,
  Image,
  PushNotificationIOS,
  Platform,
  View,
} from 'react-native';
import AndroidApp from './androidApp';
import IosApp from './iosApp';

export default class cmDriver extends Component {


  render() {
      if (Platform.OS==='android'){
      return (

           <AndroidApp />

      );

    }else{
      return (

           <IosApp />

      );
    }
  }
}


AppRegistry.registerComponent('cm_driver', () => cmDriver);
