
import React, { Component } from 'react';
import {
  AppRegistry,
  Image,
  PermissionsAndroid,
  View,
} from 'react-native';
import App from './App/App';
import CodePush from "react-native-code-push";
import { RNFirebaseMessagingService } from 'NativeModules';

const Realm = require('realm');
const realm = new Realm();

const requestPermission = () => {
  console.log('requestPermission');
  PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
          title: '权限请求',
          message:
            '该应用需要如下权限 ' + PermissionsAndroid.ACCESS_FINE_LOCATION +
            ' 请授权!'
        })
}
requestPermission();

const  getDeviceToken = async ()=>{
  try {
    const deviceToken = await RNFirebaseMessagingService.getDeviceToken();
    realm.write(() => {
        realm.create('AppUserInfo', { param: 'deviceToken', value: deviceToken }, true);
    });
  } catch (e) {

  } finally {

  }
}
getDeviceToken()

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
      // <Image source={require('./App/Image/Loading_dots_orange.gif')}  style={{width:45,height:15}}/>
    return(
      <View style={{position:'absolute',top:0,left:0,right:0,bottom:0,backgroundColor:'#ffffff',alignItems:'center',justifyContent:'center',}}>

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
                        installMode: CodePush.InstallMode.ON_NEXT_RESTART};
// cmDriver = CodePush(codePushOptions)(cmDriver);
cmDriver = CodePush(cmDriver);

AppRegistry.registerComponent('cm_driver', () => cmDriver);
