/* @flow */

import React, {Component} from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActionSheetIOS,
  Alert,
  Platform,
  Linking,

} from 'react-native';
const Realm = require('realm');
const {height, width} = Dimensions.get('window');
import Auth from '../../Modules/AuthModule/Auth';

const fileServer = 'https://www.chanmao.ca/driver/Images/';
const docsArray = [
  {
    'title': '配送意外情况处理流程',
    'file': 'unexpected_situation.pdf'
  },
  {
    'title': '司机结算及到账流程',
    'file': 'drivers_payment.pdf'
  },
  {
    'title': '配送员规范守则',
    'file': 'drivers_rules.pdf'
  },
  {
    'title': '配送员管理及处罚条例',
    'file': 'drivers_management.pdf'
  },
];

export default class About extends Component {
  constructor() {
    super();
    this._logout = this._logout.bind(this);
    this._jumpGuide = this._jumpGuide.bind(this);
  }
  async _logout() {
    await Auth.AppLogout();
    this.props.showLogin();
  }
  _jumpGuide() {
    if (Platform.OS === 'ios'){
      let titles = docsArray.map(item => item.title);
      titles.push('取消');
      ActionSheetIOS.showActionSheetWithOptions({
        options: titles,
        tintColor: '#f68a1d',
        cancelButtonIndex: docsArray.length,
      },
      async (buttonIndex) => {
        if (buttonIndex < docsArray.length){
          Linking.openURL(fileServer + docsArray[buttonIndex].file);
        }
      });
    }
    else{
      let buttons = docsArray.map(
        function(item) {
          return {
            text: item.title,
            onPress: async () => {
              Linking.openURL(fileServer + item.file);
            }
          };
        });
      Alert.alert(
        '请选择需要查看的文档',
        null,
        buttons,
        { cancelable: false }
      )
    }
  }

  render() {
    return (<View style={styles.container}>
      <View style={{
          marginTop: 70,
          width: width,
          height: height * 0.1,
          alignItems: 'center',
          justifyContent: 'center'
        }}>
        <Text style={{
            fontSize: 30,
            fontWeight: 'bold'
          }}>
          ABOUT
        </Text>
      </View>
      <View style={{
          flex: 1,
          backgroundColor: '#efefef'
        }}>

        <TouchableOpacity onPress={this._jumpGuide}>
          <View style={{
              alignItems: 'center',
              backgroundColor: 'white',
              flexDirection: 'row',
              marginTop: 0.04 * height,
              marginLeft: 12,
              marginRight: 12,
              height: 0.12 * height,
              flexDirection: 'row',
              borderWidth: 2,
              borderColor: 'grey',
              borderStyle: 'dashed',
              borderRadius: 4,
              justifyContent: 'center'
            }}>
            <Text style={{
                color: '#a4afc0',
                fontSize: 18
              }}>
              Chanmao driver's guide
            </Text>
            <Image style={{
                height: 70,
                width: 70,
                marginLeft: 15,
                justifyContent: 'flex-end'
              }} source={require('./Image/flash.png')}/>
          </View>

        </TouchableOpacity>

        <TouchableOpacity onPress={this._logout}>
          <View style={{
              alignItems: 'center',
              backgroundColor: 'white',
              flexDirection: 'row',
              marginTop: 0.04 * height,
              height: 0.08 * height,
              width: width,
              flexDirection: 'row'
            }}>
            <Image style={{
                height: 25,
                width: 25,
                marginLeft: 15
              }} source={require('./Image/logout.png')}/>
            <Text style={{
                color: '#a4afc0',
                fontSize: 18,
                marginLeft: 15
              }}>
              Log Out
            </Text>

          </View>

        </TouchableOpacity>

      </View>
    </View>);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
