'use strict';
import React, {
	Component,
} from 'react';
import {
	AppState,
  Animated,
  Dimensions,
  Image,
	ScrollView,
	TextInput,
  Platform,
	findNodeHandle,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import MainTab from '../MainTab';
import HistoryTab from '../History/HistoryTab';
import SettingTab from '../Setting/SettingTab';
import SearchTab from '../Restaurant/RestaurantSearch/CmRestaurantSearch';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import TabBar from './TabBar';
import CMLabel from '../../Constants/AppLabel';
import HomeAction from '../../Actions/HomeAction';
import TabsStore from '../../Stores/TabsStore';
const {width,height} = Dimensions.get('window');


export default class Tabs extends Component {

  constructor(){
    super()
		this._hideTabBar = this._hideTabBar.bind(this);
	  this._showTabBar = this._showTabBar.bind(this);
    this._onChange = this._onChange.bind(this);
		this._handleAppStateChange = this._handleAppStateChange.bind(this);
  }
	componentDidMount(){
    TabsStore.addChangeListener(this._onChange);
		AppState.addEventListener('change', this._handleAppStateChange);
	}
  componentWillUnmount(){
		TabsStore.removeChangeListener(this._onChange);
		AppState.removeEventListener('change', this._handleAppStateChange);
	}
  _onChange() {
    if(TabsStore.getState().goToHistory){
      this.tabView.goToPage(2);
      this.props.navigator.popToRoot({animated: false,});
      setTimeout( () => {
        this.props.navigator.push({
          screen: 'CmEatHistory',
          animated: true,
          navigatorStyle: {navBarHidden: true},
        });
      }, 1000);

    }
  }
	_handleAppStateChange = (nextAppState) => {
		if (nextAppState === 'active') {
			HomeAction.getHomeData();
		}
	}
	_hideTabBar(){
		if(this.state.showTabBar){
			this.setState({
				tabBarPosition:'overlayBottom',
				showTabBar:false,
			})
		}
	}
	_showTabBar(){
		if(!this.state.showTabBar){
			this.setState({
				showTabBar:true,
			})
			// setTimeout(() =>{
			// 	this.setState({
			// 		tabBarPosition:'bottom',
			// 	})
			// }, 300);
		}
	}
	// <HistoryTab tabLabel='我的订单'
	// 						navigator={this.props.navigator}
	// 						hideTabBar = {this._hideTabBar}
	// 						showTabBar = {this._showTabBar}/>

  render(){

    // tabBarPosition={this.state.tabBarPosition}
    //
    // showTabBar={this.state.showTabBar}
    return(

		 <ScrollableTabView  ref={(tabView) => { this.tabView = tabView; }}
												 tabBarBackgroundColor={'#fff'}
												 tabBarActiveTextColor={'#ff8b00'}
												 tabBarTextStyle={{fontSize:12,fontFamily:'FZZhunYuan-M02S',top:5}}
												 tabBarInactiveTextColor={'#666666'}
												 initialPage={0}
												 prerenderingSiblingsNumber={3}
												 renderTabBar={() => <TabBar />}
                         tabBarPosition={'bottom'}
												 contentProps={{
													 keyboardDismissMode: "on-drag",
													 keyboardShouldPersistTaps: 'always'
												 }}>

							<MainTab
								tabLabel= {CMLabel.getCNLabel('MAIN_TAB')}
								hideTabBar = {this._hideTabBar}
								showTabBar = {this._showTabBar}
                navigator={this.props.navigator}/>

							<SearchTab
								tabLabel = {CMLabel.getCNLabel('AREA_SEARCH')}
								navigator={this.props.navigator}
								hideTabBar = {this._hideTabBar}
								showTabBar = {this._showTabBar}
                />
							<SettingTab tabLabel={CMLabel.getCNLabel('MY_TAB')}
                    navigator={this.props.navigator}
                    handleBackToHome={this.props.handleBackToHome}/>

		 </ScrollableTabView>

    )
  }
}

const styles = StyleSheet.create({

});
