import { Navigation } from 'react-native-navigation';
import iosApp from './iosApp';
import androidApp from './androidApp';

export function registerScreens() {
  Navigation.registerComponent('iosApp', () => iosApp);
  Navigation.registerComponent('androidApp', () => androidApp);
}
