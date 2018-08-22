import { AppRegistry } from 'react-native';
import App from './App';


AppRegistry.registerHeadlessTask('AndroidBGContact', () => require('./App/Components/Home/AndroidBGContact'));
AppRegistry.registerComponent('cm_driver', () => App);
