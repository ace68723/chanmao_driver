import { Navigation } from 'react-native-navigation';
import iosApp from './iosApp';
import androidApp from './androidApp';
import Login from './App/Components/Login/Login';
import History from './App/Components/History/History';
import About from './App/Components/About/About';

export function registerScreens() {
  Navigation.registerComponent('iosApp', () => iosApp);
  Navigation.registerComponent('androidApp', () => androidApp);
  Navigation.registerComponent('Login', () => Login);
  Navigation.registerComponent('History', () => History);
  Navigation.registerComponent('About', () => About);
}
