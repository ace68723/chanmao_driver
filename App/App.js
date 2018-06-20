/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import Login from './Components/Login/Login';

import OrderDetail from './Components/OrderDetail/OrderDetail';
import PastWeeks from './Components/PastWeeks/PastWeeks';
import Home from './Components/Home/Home';
import History from './Components/History/History'
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
