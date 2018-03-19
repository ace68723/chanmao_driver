/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
const styles = StyleSheet.create({
    firstButtonBox: {
        flexDirection: 'row',
        marginTop: 30,
        height: 50,
    },
    buttonText: {
        fontSize: 20,
        color: '#fff',
    },
    button: {
        flex: 1,
        backgroundColor: '#ff8b00',
        borderColor: '#ff8b00',
        borderWidth: 1,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default class Button extends Component {
  render() {
      return (
          <View style={styles.firstButtonBox}>
            <TouchableOpacity
                activeOpacity={0.4}
                onPress={this.props.handleSubmit}
                style={styles.button}
            >
                <Text allowFontScaling={false}
                    style={styles.buttonText}
                >
                  Login
                </Text>
            </TouchableOpacity>
         </View>
       );
  }
}
