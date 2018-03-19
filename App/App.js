/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import Login from './Components/Login/Login';
import Home from './Components/Home/Home';

export default class MyComponent extends Component {
  render() {
      return (
        <Home />
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
