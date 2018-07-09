/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
const {height,width} = Dimensions.get('window');

export default class About extends Component {
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
          <TouchableOpacity>
            <View style={{
              alignItems:'center',
              justifyContent:'center',
              backgroundColor:'white',
              flexDirection:'row',
              marginTop:0.06*height,
              height:0.08*height,
              width:width,
            }}>
              <Text style={{
                color:'#485465',
                fontSize:30,
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
