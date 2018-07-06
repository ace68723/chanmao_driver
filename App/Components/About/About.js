/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
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
          <View style={{
            alignItems:'center',
            backgroundColor:'white',
            flexDirection:'row',
            marginTop:0.06*height,
            height:0.08*height,
            width:width,
          }}>
            <Image
              style={styles.mainActionButton}
              source={require('./Image/delivered.png')}
            />
          </View>
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
