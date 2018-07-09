
import React,{ Component } from 'react';
import ReactNative from 'react-native';
import {
  Dimensions,
  InteractionManager,
  StyleSheet,
  Text,
  View,
  Animated,
  Image
} from 'react-native';
import Button from './Button';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';


import icoMoonConfig from './fontConfig.json';
const Icon = createIconSetFromIcoMoon(icoMoonConfig);

const {width,height} = Dimensions.get('window');
let  tabBarHeight;
if(height == 812){
  tabBarHeight = 80;
  paddingBottom = 30;
}else{
  tabBarHeight = 50;
  paddingBottom = 10;
}

class DefaultTabBar extends Component {
  constructor(props) {
    super(props);
    this.renderTab   = this.renderTab.bind(this);
    this.state = {
      showTabBar:props.showTabBar,
      top:new Animated.Value(0),
    }
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.tabBarPosition == 'bottom' && this.state.top._value != 0){
        this.state.top.setValue(0);
    }else if (nextProps.tabBarPosition == 'overlayBottom' && this.state.top._value != height){
      this.state.top.setValue(height-50);
    }
    if(nextProps.showTabBar != this.props.showTabBar){
      if(nextProps.showTabBar){
        this._showTabBar()
      }else{
        this._hideTabBar()
      }
    }

  }
  _showTabBar(){
      Animated.timing(
        this.state.top,
        {toValue: height-50,
         duration: 200,
        }
      ).start();
  }
  _hideTabBar(){
      Animated.timing(
        this.state.top,
        {toValue: height,
         duration: 200,
        }
      ).start();
  }
  renderTabOption(name, page) {
  }

  renderTab(name, page, isTabActive, onPressHandler) {
        const activeTextColor = this.props.activeTextColor;
        const inactiveTextColor = this.props.inactiveTextColor;
        const textStyle = this.props.textStyle;
        const textColor = isTabActive ? activeTextColor : inactiveTextColor;

        const fontWeight = isTabActive ? 'bold' : 'normal';
        let iconName;
        let iconSize;
        let textMarginTop;
        let iconMarginTop;
        switch (page) {
          case 0:
            let order_inactive = require("./images/ordergrey.png");
            let order_active = require("./images/orderorange.png");
            iconName = (isTabActive) ? order_active : order_inactive;

            iconSize = 30;
            iconMarginTop = 0;
            textMarginTop = 0;
            break;
          case 1:
            let history_inactive = require("./images/historygrey.png");
            let history_active = require("./images/historyorange.png");
            iconName = (isTabActive) ? history_active : history_inactive;

            iconSize = 30;
            iconMarginTop = 0;
            textMarginTop = 0;
            break;
          case 2:
            let about_inactive = require("./images/aboutgrey.png");
            let about_active = require("./images/aboutorange.png");
            iconName = (isTabActive) ? about_active : about_inactive;

            iconSize = 30;
            iconMarginTop = 0;
            textMarginTop = 0;
            break;
          default:

        }
        return (
          <Button
              style={{flex: 1, }}
              key={name}
              accessible={true}
              accessibilityLabel={name}
              accessibilityTraits='button'
              onPress={() => onPressHandler(page)}
            >
              <View style={[styles.tab, this.props.tabStyle, ]}>
                <Image style={{top:5, marginTop: iconMarginTop}} source={iconName}></Image>
                <Text style={[{color: textColor,
                               fontWeight,
                               marginTop: textMarginTop + 2},
                               textStyle, ]}
                      allowFontScaling={false}>
                  {name}
                </Text>
              </View>
          </Button>
        );
      }

  render() {
    // bdc8d9
    return (
      <Animated.View style={[styles.tabs, {backgroundColor: this.props.backgroundColor,
                                           top:this.state.top,
                                           borderTopColor:"#bdc8d9",
                                           borderTopWidth:StyleSheet.hairlineWidth,
                                           },
                                           this.props.style, ]}>
        {this.props.tabs.map((name, page) => {
          const isTabActive = this.props.activeTab === page;
          const renderTab = this.props.renderTab || this.renderTab;
          return renderTab(name, page, isTabActive, this.props.goToPage);
        })}

      </Animated.View>
    );
  }
}

DefaultTabBar.defaultProps = {
  activeTextColor: 'navy',
  inactiveTextColor: 'black',
  backgroundColor: null,
};

export default DefaultTabBar;

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: paddingBottom,
  },
  tabs: {
    height: tabBarHeight,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderColor: '#ccc',
  },
});
