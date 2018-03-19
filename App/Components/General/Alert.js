'use strict';
import {
  Alert
} from 'react-native';
const AlertModule = {
  errorAlert(message){
    Alert.alert(
      '馋猫订餐提醒您',
      message.toString(),
      [
        {text: 'OK', onPress: () => {}},
      ]
    )
  }
}

module.exports = AlertModule;
