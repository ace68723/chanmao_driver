'use strict';
import React, { Component } from 'react';
import TabBar from './TabBar';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import History from '../History/History'
import About from '../About/About'
import Home from '../Home/Home';

export default class TaskList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialPage: props.directingPage
    }
  }

  render() {
    return (
      <ScrollableTabView
                tabBarBackgroundColor={'#fff'}
                tabBarActiveTextColor={'#ff8b00'}
                tabBarTextStyle={{fontSize:12, top:5}}
                tabBarInactiveTextColor={'#666666'}
                initialPage={this.state.initialPage}
                prerenderingSiblingsNumber={3}
                renderTabBar={() => <TabBar />}
                tabBarPosition={'bottom'}
                contentProps={{
                 keyboardDismissMode: "on-drag",
                 keyboardShouldPersistTaps: 'always'
                }}>
               <Home tabLabel="Home"/>
               <History tabLabel="History" style={[this.props.styles,{marginTop:67,flex:1}]}/>

               <About tabLabel="About"
                      showLogin={this._showLogin}
                      goOffline={this.props.goOffline}
                      reverseanimateMapView={this._reverseanimateMapView}
                      style={[this.props.styles,{marginTop:67,flex:1}]}/>


 		 </ScrollableTabView>

    );
  }
}
