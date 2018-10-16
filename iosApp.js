import React, {Component} from 'react';
import {AppRegistry, Image, PushNotificationIOS, Platform, View} from 'react-native';
import App from './App/App';
import CodePush from "react-native-code-push";

import {getRealm} from './App/Modules/AuthModule/Auth';
const realm = getRealm();

const DEPLOYMENT_KEY = 'C_xLtYebjYVDRqviZOkIXHlHvkktH1TTPtmiQ';

if (Platform.OS === 'ios') {
  setTimeout(() => {
    PushNotificationIOS.requestPermissions();
    PushNotificationIOS.addEventListener('register', (deviceToken) => {
      console.log(deviceToken);
      realm.write(() => {
        realm.create('AppUserInfo', {
          param: 'deviceToken',
          value: deviceToken
        }, true);
      });
    });
    PushNotificationIOS.addEventListener('registrationError', (error) => {
      console.log('here');
      console.log(error);
    });
    PushNotificationIOS.addEventListener('notification', (notification) => {
      console.log(notification);
      console.log('get data', notification.getData());
    });
  }, 500);
}
export default class cmDriver extends Component {
  constructor() {
    super()
    this.state = {
      isUpdating: true
    }
  }

  componentWillMount() {
    this._checkForUpdate();
  }

  _checkForUpdate(){
    CodePush.checkForUpdate(DEPLOYMENT_KEY).then((update) => {
      if (!update) {
        console.log("[CodePush] The app is up to date!");
        this.setState({isUpdating: false});
      } else {
        console.log("[CodePush] Found new update");
        this.setState({isUpdating: true});

        CodePush.sync({
          deploymentKey: DEPLOYMENT_KEY,
          checkFrequency: CodePush.CheckFrequency.ON_APP_START,
          installMode: CodePush.InstallMode.IMMEDIATE
        }, (status) => {
          if (status == 2 || status == 3 || status == 7){
            //  Check status code on https://docs.microsoft.com/en-us/appcenter/distribution/codepush/react-native#api-reference
            this.setState({isUpdating: true});
          }
          else{
            this.setState({isUpdating: false});
          }
        })
      }});
  }
  
  _renderUpdateView() {
    return (<View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
      <Image source={require('./App/Image/Loading_dots_orange.gif')} style={{
          width: 45,
          height: 15
        }}/>
    </View>)
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <App/>
        {this.state.isUpdating ? this._renderUpdateView() : null}
      </View>
  );
  }
}
