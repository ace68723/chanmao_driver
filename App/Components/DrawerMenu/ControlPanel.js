/* @flow */

import React, { Component } from 'react';
import {
  PropTypes,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
export default class ControlPanel extends Component {


  render() {
    let {closeDrawer} = this.props
    return (
      <ScrollView style={styles.container}>
        <Text allowFontScaling={false} style={styles.controlText}>Control Panel</Text>
        <TouchableOpacity style={styles.button} onPress={closeDrawer}>
          <Text allowFontScaling={false} style={{fontFamily:'FZZhunYuan-M02S'}}>Close Drawer</Text>
        </TouchableOpacity>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'black',
  },
  controlText: {
    color: 'white',
    fontFamily:'FZZhunYuan-M02S'
  },
  button: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
  }
})
