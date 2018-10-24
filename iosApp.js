import React, { Component } from 'react';
import {
  AppRegistry,
  Image,
  PushNotificationIOS,
    Platform,
  View,
} from 'react-native';
import App from './App/App';
import CodePush from "react-native-code-push";
// const Realm = require('realm');
// const realm = new Realm();
import { getRealm } from './App/Modules/AuthModule/Auth';
const realm = getRealm();
if (Platform.OS==='ios'){
setTimeout(() => {
    PushNotificationIOS.requestPermissions();
    PushNotificationIOS.addEventListener('register', (deviceToken) => {
        console.log(deviceToken);
        realm.write(() => {
            realm.create('AppUserInfo', { param: 'deviceToken', value: deviceToken }, true);
        });
    });
    PushNotificationIOS.addEventListener('registrationError', (error) => {
        console.log(error);
    });
    PushNotificationIOS.addEventListener('notification', (notification) => {
        console.log(notification);

        console.log('get data', notification.getData());
    });
}, 500);
}
export default class cmDriver extends Component {
  constructor(){
    super()
    this.state = {
      isUpdate:false,
    }
  }

  componentDidMount(){
    setTimeout( () =>{
      this.setState({
        isUpdate:false,
      })
    }, 5000);
  }
  codePushStatusDidChange(status) {

      switch(status) {
          case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
              console.log("Checking for updates.");
              break;
          case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
              console.log("Downloading package.");
              this.setState({
                isUpdate:true,
              })
              break;
          case CodePush.SyncStatus.INSTALLING_UPDATE:
              console.log("Installing update.");
              break;
          case CodePush.SyncStatus.UP_TO_DATE:
              console.log("Up-to-date.");
              break;
          case CodePush.SyncStatus.UPDATE_INSTALLED:
              console.log("Update installed.");
              break;
      }
  }
  _renderUpdateView(){
    return(
      <View style={{position:'absolute',top:0,left:0,right:0,bottom:0,backgroundColor:'#ffffff',alignItems:'center',justifyContent:'center',}}>
        <Image source={require('./App/Image/Loading_dots_orange.gif')}  style={{width:45,height:15}}/>
      </View>
    )
  }

  render() {
      return (
        <View style={{flex:1}}>
           <App />
          {this.state.isUpdate? this._renderUpdateView():null}
        </View>
      );
  }
}
let  codePushOptions = {checkFrequency: CodePush.CheckFrequency.ON_APP_START,
                        installMode: CodePush.InstallMode.IMMEDIATE};
cmDriver = CodePush(codePushOptions)(cmDriver);
