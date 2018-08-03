
import React, { Component } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
} from 'react-native';
import History from '../History/History'
import About from '../About/About'
import TaskCard from './CmDriverTaskCard';

import TaskCardAuto from './CmDriverTaskCardAuto';
import TaskDetail from './CmDriverTaskDetailViewController';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import TabBar from '../Tabs/TabBar';

var reverse = require('lodash.reverse');
const {height,width} = Dimensions.get('window');



export default class TaskList extends Component {
  constructor(props) {
    super(props);
    this.state={
      data:[],
      refreshtiming:0,
      showTaskDetail:false,
      initialPage: props.directingPage
    }
    this._renderTaskItem = this._renderTaskItem.bind(this);
    this._openComment = this._openComment.bind(this);
    this._closeComment = this._closeComment.bind(this);
    this._showLogin=this._showLogin.bind(this);
    this._reverseanimateMapView=this._reverseanimateMapView.bind(this);
    this._setPage=this._setPage.bind(this);
    this._renderListFooter=this._renderListFooter.bind(this);
    this._renderRestButton=this._renderRestButton.bind(this);

    this._routeAction = this._routeAction.bind(this);
    this._getTargetLocation = this._getTargetLocation.bind(this);
    this._jumpToMapWithLocations = this._jumpToMapWithLocations.bind(this);
    this._calculateDistance = this._calculateDistance.bind(this);

  }
  
  _reverseanimateMapView(){
    this.props.reverseanimateMapView();
  }
  _openComment(oid,status,order,restaurant,address){
    this.setState({
        showTaskDetail:true,
        od_oid:oid,
    })
    this.props.showOfflineBtn();
  }
  _closeComment(){
    this.setState({
        showTaskDetail:false,
        od_oid:"",
    })
    this.props.showOfflineBtn();
  }
  _setPage()
  {
    this.setState({initialPage:0});
  }
  _showLogin()
  {

    this.scrollView.goToPage(0);
    this.props.showLogin();
  }
  _calculateDistance(lat1, lon1, lat2, lon2){
    var p = 0.017453292519943295;
    var c = Math.cos;
    var a = 0.5 - c((lat2 - lat1) * p)/2 +
            c(lat1 * p) * c(lat2 * p) *
            (1 - c((lon2 - lon1) * p))/2;
    return 12742 * Math.asin(Math.sqrt(a)) * 1000; // returns in meters
  }

  _jumpToMapWithLocations(start, end, midpoints){
    let query = `https://www.google.com/maps/dir/?api=1&origin=${start}&destination=${end}&travelmode=driving&waypoints=`
    midpoints.forEach( function(item) {
      query += `${item}+`
    });
    Linking.openURL(query);
  }
  _routeAction(){
    // first get driver's location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const driverPosition = `${position.coords.latitude}, ${position.coords.longitude}`;
        const firstOrder = this.props.ordersList[0];
        const secondOrder = this.props.ordersList[1];
        if (!secondOrder){
          this._jumpToMapWithLocations(driverPosition, this._getTargetLocation(firstOrder), []);
        }
        else if (firstOrder && secondOrder) {
          this._jumpToMapWithLocations(driverPosition, this._getTargetLocation(secondOrder), [this._getTargetLocation(firstOrder)]);
        }
      },
      (error) => {
        console.log(error)
      },
      {enableHighAccuracy: true, timeout: 20000}
    );
  }
  _getTargetLocation(order){
    switch (order.order.task_id.slice(-1)) {
      case 'P':{
        // return `${order.restaurant.lat}, ${order.restaurant.lng}`
        return order.restaurant.addr
      }
        break;
      case 'D':{
        // return `${order.address.lat}, ${order.address.lng}`
        return order.address.addr
      }
        break;
      default: return '';
    }
  }

  _renderTaskItem (object) {
    const item = object.item;
    if (item.order.is_ordered==0) return(
      <TaskCard oid={item.oid}
                status={item.order.status}
                order={item.order}
                restaurant={item.restaurant}
                address={item.address}
                orderChange={this.props.orderChange}
                openMap = {this.props.openMap}
                closeMap = {this.props.closeMap}
                openComment = {this._openComment}/>
    )
    else return (
      <TaskCardAuto oid={item.oid}
                status={item.order.status}
                order={item.order}
                restaurant={item.restaurant}
                address={item.address}
                orderChange={this.props.orderChange}
                openMap = {this.props.openMap}
                closeMap = {this.props.closeMap}
                openComment = {this._openComment}/>
    )
  }
  _renderListFooter()
  {
    return (
      <View style={{width: width,
                    height: 20,
                    backgroundColor: 'rgba(0,0,0,0)',
      }}>
      </View>
    )
  }
  _renderTaskList(){
    if(!this.props.ordersList || this.props.ordersList.length == 0) {
      return <Image  source={require('../../Image/no_order.png')}
                     style={{top:height*0.2,height:height*0.6,width:height*0.6*0.5, alignSelf:'center'}}/>
    }
    if(this.props.ordersList.length >0){
      return(
             <FlatList
                data={this.props.ordersList}
                renderItem={(item) => this._renderTaskItem(item)}
                enableEmptySections={true}
                ListFooterComponent={this._renderListFooter}
                keyExtractor={(item, index) => item.oid.toString()}
                refreshControl={
                  <RefreshControl
		 								refreshing={this.props.refreshingTask}
		 								onRefresh={this.props.refreshTask}
		 								tintColor="#ff8b00"
		 								title="Refreshing..."
		 								titleColor="#ff8b00"
		 							/>
                }
              />
            )
    }
  }
  // <View style={{flex:1,height:1,backgroundColor:'#d1d2d4'}}/>
  _renderTaskDetail(){
    if(this.state.showTaskDetail){
      return(
        <TaskDetail close = {this._closeComment}
                    oid={this.state.od_oid}
                    orderChange={this.props.orderChange}
                    openMap = {this.props.openMap}
                    closeMap = {this.props.closeMap}/>
      )
    }
  }
  _renderRestButton()
  {
    return (
      <View style={{
        position:'absolute',
        bottom:0,
        width:width,
        height:height*0.12,
        alignItems:'center',
        justifyContent:'center',


      }}>
        <View style={{flex:1,flexDirection:'row'}}>
          <View style={{flex:1,
          alignItems:'center',
          justifyContent:'center',}}>
            <TouchableOpacity onPress={this._routeAction}>
              <View style={{height:0.07*height,width:0.35*width,
                backgroundColor:'#798BA5',
                borderRadius:8,
                alignItems:'center',
                flexDirection:'row',
              }}>
                <Image
                  source={require('./Image/route.png')}
                  style={{marginLeft:20,height:0.04*height,width:0.04*height}}
                />
                <Text allowFontScaling={false}
                      style={{marginLeft:20,color:'white',fontSize:20,fontFamily:'FZZhunYuan-M02S'}}
                >
                  Route
                </Text>
              </View>

            </TouchableOpacity>
          </View>
          <View style={{flex:1,
          alignItems:'center',
          justifyContent:'center',}}>
            <TouchableOpacity>
              <View style={{height:0.07*height,width:0.35*width,
                backgroundColor:'#798BA5',
                borderRadius:8,
                alignItems:'center',
                flexDirection:'row',
              }}>
                <Image
                  source={require('./Image/coffee-cup.png')}
                  style={{marginLeft:20,height:0.04*height,width:0.04*height}}
                />
                <Text allowFontScaling={false}
                      style={{marginLeft:20,color:'white',fontSize:20,fontFamily:'FZZhunYuan-M02S'}}
                >
                  Break
                </Text>
              </View>

            </TouchableOpacity>
          </View>

        </View>
      </View>
    )
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
                ref={(scrollView) => { this.scrollView = scrollView; }}
                contentProps={{
                 keyboardDismissMode: "on-drag",
                 keyboardShouldPersistTaps: 'always'
                }}
                onChangeTab={(event)=>{this.props.onChangeTab(event.i)}}
      >

               <Animated.View tabLabel="Order" style={[this.props.styles,{marginTop:67,flex:1}]}>
                 {this._renderTaskList()}
                 {this._renderTaskDetail()}
               </Animated.View>

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
