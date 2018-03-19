/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
export default class DrawerMenu extends Component {
 //  state={
 //   drawerOpen: false,
 //   drawerDisabled: false,
 // };
 constructor() {
   super();
   this.state = {
     drawerOpen: false,
     drawerDisabled: false,
   }
 }
 componentDidMount() {
   this.openDrawer();
 }

  render() {
    return (
     <View>
     </View>
   )
 }
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  }
})
