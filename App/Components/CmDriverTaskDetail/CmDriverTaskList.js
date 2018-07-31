
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
//database
const  Realm = require('realm');
//for production use this line
// let realm = new Realm();



export default class TaskList extends Component {
  constructor(props) {
    super(props)
    this.state={
      data:[],
      refreshtiming:0,
      showTaskDetail:false,
      initialPage: props.directingPage
    }
    this._renderTaskItem = this._renderTaskItem.bind(this);
    this._updateDataSource = this._updateDataSource.bind(this);
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
  componentDidMount(){

    //for module
    //!Importent remove this line from product
    realm.addListener('change', () => {
        this._updateDataSource();
    });
  }
  componentWillUnmount(){
    realm.removeAllListeners();
  }
  _reverseanimateMapView(){
    this.props.reverseanimateMapView();
  }
  _openComment(oid,status,order,restaurant,address){
    this.setState({
        showTaskDetail:true,
        od_oid:oid,
        od_status:status,
        od_order:order,
        od_restaurant:restaurant,
        od_address:address,
    })
    this.props.showOfflineBtn();
  }
  _closeComment(){
    this.setState({
        showTaskDetail:false,
        od_oid:"",
        od_status:"",
        od_order:"",
        od_restaurant:"",
        od_address:"",
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

  _updateDataSource(){
    // this.state.ordersList = realm.objects('Orders').slice(0, 60);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // const driverPosition = `${position.coords.latitude}, ${position.coords.longitude}`;
        let realm_order_list = [];
        try {
           realm_order_list = realm.objects('Orders').slice(0, 60);
        } catch (e) {
          return;
        }
        let ordered_list_index = 0;
        const order_list = [];
        let _numOfDoing = 0;
        for (let _order of realm_order_list) {
          if (_order.order.is_ordered == 1) {
            if (ordered_list_index < 2) {
              ordered_list_index++;
              order_list.push(_order);
              _numOfDoing++;
            } else {
              // only orders in delivery
              let target = [];
              switch (_order.order.task_id.slice(-1)) {
                case 'P':{
                  target = [_order.restaurant.lat, _order.restaurant.lng];
                }
                  break;
                case 'D':{
                  target = [_order.address.lat, _order.address.lng];
                }
                  break;
                default: break;
              }
              // calculate distance(straight line)
              const distance = this._calculateDistance(
                position.coords.latitude,
                position.coords.longitude,
                target[0],
                target[1],
              );
              // push only distance < 500
              if (distance <= 500){
                order_list.push(_order);
                _numOfDoing++;
              }
            }
          } else if (_order.order.is_ordered == 0) {
            order_list.push(_order);
            if (_order.order.status == 10 ||
                _order.order.status == 20 ||
                _order.order.status == 30
                ) {
              _numOfDoing++;
            }
          }
        }
        this.props.updateNumOfDoing(_numOfDoing);
        this.setState({
          ordersList: order_list
        });
      },
      (error) => {
        console.log(error)
      },
      {enableHighAccuracy: true, timeout: 20000}
    );
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
        const firstOrder = this.state.ordersList[0];
        const secondOrder = this.state.ordersList[1];
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
      <View style={{width:width,
        height:0.12*height,
        backgroundColor:'rgba(0,0,0,0)',
      }}>
      </View>
    )
  }
  _renderTaskList(){
    if(!this.state.ordersList || this.state.ordersList.length == 0) {
      return <Image  source={require('../../Image/no_order.png')}
                     style={{top:height*0.2,height:height*0.6,width:height*0.6*0.5, alignSelf:'center'}}/>
    }
    if(this.state.ordersList.length >0){
      return(
             <FlatList
                data={this.state.ordersList}
                renderItem={(item) => this._renderTaskItem(item)}
                enableEmptySections={true}
                ListFooterComponent={this._renderListFooter}
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
                    status={this.state.od_order.status}
                    order={this.state.od_order}
                    restaurant={this.state.od_restaurant}
                    address={this.state.od_address}
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
                <Text style={{marginLeft:20,color:'white',fontSize:20}}
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
                <Text style={{marginLeft:20,color:'white',fontSize:20}}
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
                 {this._renderRestButton()}
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


const AppUserInfoSchema = {
      name: 'AppUserInfo',
      primaryKey: 'param',
      properties: {
        param:       'string',
        value:      'string'
      }
    }

    const OrderDetialSchema = {
      name: 'OrderDetial',
      primaryKey: 'oid',
      properties: {
        oid: 'int',
        payment_channel: 'int',
        total: 'string',
        tips: 'string',
        comment: 'string',
        status: 'int',
        dlexp: 'string',
        pptime: 'string',
        time_create: 'int',
        time_pickup: 'int',
        time_complete: 'int',
        driver_id: 'int',
        task_id: 'string',
        is_ordered: 'int',
      }
    };
    const RestaurantInfoSchema = {
      name: 'RestaurantInfo',
      primaryKey: 'rid',
      properties: {
          rid:'int',
          addr:"string",
          lat:"string",
          lng:"string",
          name:"string",
          postal:"string",
          tel:"string",
          unit:"string"
      }
    };
    const UserAddressSchema = {
      name: 'UserAddress',
      primaryKey: 'uaid',
      properties: {
          uaid:'int',
          addr:"string",
          buzz:"string",
          lat:"string",
          lng:"string",
          name:"string",
          postal:"string",
          tel:"string",
          unit:"string"
      }
    };
    const OrdersSchema = {
      name: 'Orders',
      primaryKey: 'oid',
      properties: {
        oid:'int',
        order:'OrderDetial',
        restaurant:'RestaurantInfo',
        address:'UserAddress'
      }
    };


let realm = new Realm({schema: [AppUserInfoSchema,OrderDetialSchema,RestaurantInfoSchema,UserAddressSchema,OrdersSchema]});
console.log(realm.path)
