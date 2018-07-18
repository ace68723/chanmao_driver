/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
const  Realm          = require('realm');
const {height,width} = Dimensions.get('window');
import Auth from '../../Modules/AuthModule/Auth';
export default class About extends Component {
  constructor()
  {
    super();
    this._logout=this._logout.bind(this);

    // console.log(Auth.AppLogout)
  }
  async _logout()
  {
    console.log('logout');
    await Auth.AppLogout();
    this.props.showLogin();
    // this.props.reverseanimateMapView();
  }
  render() {
    return (
      <View style = {styles.container}>
        <View style = {{
          marginTop:10,
          width:width,
          height:height*0.1,
          alignItems:'center',
          justifyContent:'center',
        }}>
          <Text style={{
            fontSize:30,
            fontWeight:'bold',
          }}>
            ABOUT
          </Text>
        </View>
        <View style={{
          flex:1,
          backgroundColor:'#efefef',
        }}>
          <TouchableOpacity onPress={this._logout}>
            <View style={{
              alignItems:'center',
              backgroundColor:'white',
              flexDirection:'row',
              marginTop:0.06*height,
              height:0.08*height,
              width:width,
              flexDirection:'row',
            }}>
              <Image
                style={{
                  height:25,
                  width:25,
                  marginLeft:15,
                }}
                source={require('./Image/logout.png')}
              />
              <Text style={{
                color:'#a4afc0',
                fontSize:30,
                marginLeft:15,
              }}>
                LOG OUT
              </Text>

            </View>

          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
