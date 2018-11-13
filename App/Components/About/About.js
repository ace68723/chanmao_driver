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
    'title': '司机App使用文档',
    'file': 'driver_guide.png'
  },
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
  }
  async _logout() {
    this.props.showLogin();
    this.props.goOffline();
    await Auth.AppLogout();
  }


  render() {
    return (<View style={styles.container}>
      <View style={{
          marginTop: 0,
          width: width,
          height: height * 0.1,
          alignItems: 'center',
          justifyContent: 'center'
        }}>
      </View>
      <View style={{
          flex: 1,
          backgroundColor: '#efefef'
        }}>


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
            <Text allowFontScaling={false}
            style={{
                color: '#a4afc0',
                fontSize: 18,
                marginLeft: 15,
                fontFamily:'FZZhunYuan-M02S'
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
