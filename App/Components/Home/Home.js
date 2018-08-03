// 'use strict';
import React, { Component } from 'react';
import {
  Alert,
  Animated,
  ActionSheetIOS,
  AppState,
  Dimensions,
  DeviceEventEmitter,
  LayoutAnimation,
  Linking,
  NativeEventEmitter,
  Image,
  View,
  Vibration,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Text,
  PermissionsAndroid,
  NativeModules,
} from 'react-native';

import {
    forEach,
} from 'lodash';

//Components
import Login from '../Login/Login';
import CmDriverTaskList from '../CmDriverTaskDetail/CmDriverTaskList';
import Map from './Map';

//native Modules
import {NativeEvent, RNLocation as Location,FlashLightBridge as FlashLight,ToastModule} from 'NativeModules'
import DeviceInfo from 'react-native-device-info';
//js modules
import Auth from '../../Modules/AuthModule/Auth';
import OrderAction from '../../Actions/OrderAction';
import OrderStore from '../../Stores/OrderStore';
import DriverAction from '../../Actions/DriverAction';
import AppConstants from '../../Constants/AppConstants';

//database
const  Realm = require('realm');
let realm = new Realm();
const BUTTONS = [
  '现金',
  '刷卡',
  '取消',
];
const DESTRUCTIVE_INDEX = 2;
const CANCEL_INDEX = 2;
const {height,width} = Dimensions.get('window');




class Home extends Component {
    constructor() {
      super()
      this.state={
        backgroundStyle:{
          bottom:-height*0.275
        },
        orders_list: [],
        taskList:[],
        showLogin:true,
        openMap:false,
        dest_name:'',
        dest_addr:'',
        showNotification:false,
        showOfflineBtn:false,
        online:false,
        refreshingTask:false,
        numOfDoing: 0,
        directingPage: null,
        isAnimated:false,
        showOrderView:false,
        navigatorTitle: 'ORDER',
      }
      this._animateMapView = this._animateMapView.bind(this);
      this._animateMapBackground = this._animateMapBackground.bind(this);
      this._animateOpenTaskList = this._animateOpenTaskList.bind(this);
      this._animateCloseTaskList = this._animateCloseTaskList.bind(this);
      this._goOnline = this._goOnline.bind(this);
      this._goOffline = this._goOffline.bind(this);
      this._orderChange = this._orderChange.bind(this);
      this._hideLogin = this._hideLogin.bind(this);
      this._openMap = this._openMap.bind(this);
      this._closeMap = this._closeMap.bind(this);
      this._jumpToMap = this._jumpToMap.bind(this);
      this._cancelNotification = this._cancelNotification.bind(this);
      this._showOfflineBtn = this._showOfflineBtn.bind(this);
      this._refreshTask = this._refreshTask.bind(this);
      this._handleAppStateChange = this._handleAppStateChange.bind(this);
      this._renderDoingNumber=this._renderDoingNumber.bind(this);
      this._onPressActionHandler=this._onPressActionHandler.bind(this);
      this._onChangeTab=this._onChangeTab.bind(this);
      this._showLogin=this._showLogin.bind(this);
      this._reverseanimateMapView=this._reverseanimateMapView.bind(this);
      this._onChange = this._onChange.bind(this);
      this._updateNumOfDoing = this._updateNumOfDoing.bind(this);
    }

    componentDidMount(){
      AppState.addEventListener('change', this._handleAppStateChange);
      OrderStore.addChangeListener(this._onChange);
    }
    componentWillUnmount() {
       AppState.removeEventListener('change', this._handleAppStateChange);
       OrderStore.removeChangeListener(this._onChange);
    }
    _onChange() {
      const state = Object.assign({},OrderStore.getState());
      this.setState(Object.assign({}, this.state, state, {refreshingTask: false}));
      if (state.online && !this.state.showOrderView) {
        OrderAction.getOrders();
        this._animateOpenTaskList();
        this.setState({
          showOfflineBtn:true,
        });

        // Refresh order list every 30sec in js
        this.interval = setInterval( () => {
          this._refreshTask();
        }, 30000);
        if (Platform.OS == 'ios'){
          const url = AppConstants.API_GEO_TRACE;
          const authortoken = Auth.getToken();
          NativeModules.RTContact.initial(url,authortoken);
          NativeModules.RTContact.turnOn(true);// true 代表开启， false 代表关闭
        }
      } else if (!state.online && this.state.showOrderView) {
        this._animateCloseTaskList();
        this.setState({
          showOfflineBtn:false,
          openMap: false,
          taskList:[],
          orders_list: [],
        });

        // Clear automatic refreshing data method
        clearInterval(this.interval);
        if (Platform.OS == 'ios'){
          NativeModules.RTContact.turnOn(false);// true 代表开启， false 代表关闭
        }
      }
    }
    _handleAppStateChange(currentAppState) {
			if(currentAppState === 'active' && this.state.online){
				this._refreshTask();
			}
		}
    _newOrderNotification(message){
      if(!this.state.showNotification){
        this.setState({
          showNotification:true,
          notificationMessage:message,
        })
        if(Platform.OS === 'ios'){
          Vibration.vibrate();
        }
        // notificationAlert = setInterval(()=>{
        //   FlashLight.open();
        // },500)
      }
    }
    _cancelNotification(){
      // const interval = this.notificationAlert
      // clearInterval(notificationAlert);
      // FlashLight.close();
      this.setState({showNotification:false})
    }

    _goOnline(){
      navigator.geolocation.getCurrentPosition(
        (position) => {
          DriverAction.goOnline({geo_lat: position.coords.latitude, geo_lng: position.coords.longitude});
        },
        (error) => {console.log(error)},
        {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000}
      );
    }

    _goOffline(){
      navigator.geolocation.getCurrentPosition(
        (position) => {
          DriverAction.goOffline({geo_lat: position.coords.latitude, geo_lng: position.coords.longitude});
        },
        (error) => {console.log(error)},
        {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000}
      );
    }
    _showOfflineBtn(){
      this.setState({
        showOfflineBtn:!this.state.showOfflineBtn,
      })
    }

    _updateNumOfDoing(num) {
      this.setState({numOfDoing: num});
    }

  async _orderChange(oid, payment_channel, change, status) {
    try {
      if (change == 'D' && payment_channel == 0) {
        if (Platform.OS === 'ios') {
          this._orderChangeIos(oid, change, status);
        } else {
          this._orderChangeAndroid(oid, change, status)
        }
      } else {
        realm.write(() => {
          realm.create('Orders', {
            oid: oid,
            order: {
              oid: oid,
              status: -1
            }
          }, true);
        });
        const updateOrderStatusResult = await OrderAction.updateOrderStatus(oid, change);
      }
    } catch (e) {
      console.log(e)
    }

  }
    _orderChangeIos(oid,change,status) {

        ActionSheetIOS.showActionSheetWithOptions({
          options: BUTTONS,
          cancelButtonIndex: CANCEL_INDEX,
          destructiveButtonIndex: DESTRUCTIVE_INDEX,
          tintColor: '#f68a1d',
        },
        async (buttonIndex) => {
          try{
            if(buttonIndex == 0){
              realm.write(() => {
                 realm.create('Orders', {oid:oid,
                                         order: {
                                           oid:oid,
                                           status: -1,
                                        }
                                      }, true );
              });
             const updateOrderStatusResult = await OrderAction.updateOrderStatus(oid,change);
           }else if(buttonIndex == 1){
             realm.write(() => {
                realm.create('Orders', {oid:oid,
                                        order: {
                                          oid:oid,
                                          status: -1,
                                       }
                                     }, true );
             });
              const updateOrderStatusResult2 = await OrderAction.updateOrderStatus(oid,change);
              const updateOrderStatusResult3 = await OrderAction.updateOrderStatus(oid,'S');
           }
         } catch (e) {
           console.log(e);
         }

        });
    }

    _orderChangeAndroid(oid,change,status) {
      Alert.alert(
        'Chanmao',
        'order: #'+ oid,
        [
          {text: '现金', onPress: async () => {
            try {
              realm.write(() => {
                 realm.create('Orders', {oid:oid,
                                         order: {
                                           oid:oid,
                                           status:"updating",
                                        }
                                      }, true );
              });
              const updateOrderStatusResult = await OrderAction.updateOrderStatus(oid,change);

            } catch (e) {

            }

          }},
          {text: '刷卡', onPress: async() => {
            try {
              realm.write(() => {
                 realm.create('Orders', {oid:oid,
                                         order: {
                                           oid:oid,
                                           status:"updating",
                                        }
                                      }, true );
              });
              const updateOrderStatusResult2 = await OrderAction.updateOrderStatus(oid,change);
              const updateOrderStatusResult3 = await OrderAction.updateOrderStatus(oid,'S');

            } catch (e) {

            }
          }},
          {text: '取消', onPress: () => console.log('OK Pressed')}
        ],
        { cancelable: false }
      )
    }

    _openMap(locationA,locationB,navigationBtn){
      const dest_name = locationA.name
      const dest_addr = locationA.addr

      const markers =[
        {
          latlng:{
            latitude: Number(locationA.lat),
            longitude: Number(locationA.lng),
            },
          title:'locationA.name',
          description:'',
          image:require('../../Image/icon_restaurant.png'),
          addr:locationA.addr
        },{
          latlng:{
            latitude: Number(locationB.lat),
            longitude: Number(locationB.lng),
          },
          title:'locationB.name',
          description:'',
          image:require('../../Image/icon_customer.png'),
          addr:locationB.addr
        }
      ]

      this.setState({
        openMap:true,
        dest_name:dest_name,
        dest_addr:dest_addr,
        navigationBtn:navigationBtn,
        showOfflineBtn:false,
      })
      const _animateCloseTaskList = () =>{
        this._animateCloseTaskList();
      }
      setTimeout(function () {
        _animateCloseTaskList()
      }, 10);
      const addMarker = ()=>{
        this.mapRef.addMarker(markers);
      }
      setTimeout(function () {
        addMarker()
      }, 500);
    }
    _closeMap(){
      this._animateOpenTaskList();
      const closeMap = this.mapRef.closeMap;
      setTimeout(function () {
        closeMap()
      }, 800);
      this.setState({
        showOfflineBtn:true,
      })

    }
    _jumpToMap(){
      this.mapRef.jumpToMap();
    }
    _refreshTask() {
       this.setState({refreshingTask:true});
       navigator.geolocation.getCurrentPosition(
         (position) => {
           OrderAction.getOrders();
           DriverAction.updateGeolocation({geo_lat: position.coords.latitude, geo_lng: position.coords.longitude});
         },
         (error) => {console.log(error)},
         {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000}
       );
    }
    _onPressActionHandler(page){
      const mapping = {'history': 1, 'about': 2};
      const titleMapping = {'history': 'HISTORY', 'about': 'ABOUT'}
      this._animateOpenTaskList()
      this.setState({
        directingPage: mapping[page], // set state so it triggers tasklist to re-render
        navigatorTitle: titleMapping[page]
      })
    }
    _onChangeTab(page){
      if (page == 0 && !this.state.online){
        // if pressed order page, and user is not online
        this.setState({
          directingPage:null, // set this to null so _renderTaskList renders correctly
        });
        const _animateCloseTaskList = ()=>{
          this._animateCloseTaskList();
        }
        setTimeout(function () {
          _animateCloseTaskList()
        }, 10);
      }
      const titleMapping = [
        'ORDERS',
        'HISTORY',
        'ABOUT'
      ];
      this.setState({
        navigatorTitle: titleMapping[page]
      })
    }

    //UX Animation Start
    _backgroundBottom = new Animated.Value(-height*0.275);
    _backgroundHeight = new Animated.Value(height*0.275);
    _infoViewBottom = new Animated.Value(-height*0.275);
    _infoContentOpacity = new Animated.Value(0);
    _infoViewWidth = new Animated.Value(width*0.834);
    _infoViewHeight = new Animated.Value(height*0.283);
    _infoViewLeft = new Animated.Value(width*0.083);
    _statusOpacity = new Animated.Value(0);

    _reverseanimateMapView(){
      Animated.parallel([
          Animated.timing(this._backgroundBottom, {
              toValue: -height*0.275,
              duration: 400,
          }),
          Animated.sequence([
              Animated.timing(this._infoViewBottom, {
                  delay: 225,
                  toValue: -height*0.275,
                  duration: 275, //550ms
              }),
              Animated.parallel([
                Animated.timing(this._infoViewBottom, {
                    toValue: -height*0.275,
                    duration: 100,
                }),
                Animated.timing(this._infoContentOpacity, {
                    toValue: 0,
                    duration: 150,
                }),
              ])
          ])
      ]).start()
    }
    _animateMapView(){
      // const _animateMapBackground = this._animateMapBackground;
      // setTimeout(function () {
      //   // _animateMapBackground()
      // }, 225);
      // LayoutAnimation.configureNext(LayoutAnimation.Presets.linear)

      // const region ={
      //   latitude: LATITUDE,
      //   longitude: LONGITUDE,
      //   latitudeDelta: 0.01,
      //   longitudeDelta: 0.01 * ASPECT_RATIO,
      // }
      // this.map.animateToRegion(region,400);
      // setTimeout(() => {
        // this.mapRef.animateMapView();
      // }, 2000);
      if (!this.state.isAnimated){
        this.setState({isAnimated:true});
        Animated.parallel([
            Animated.timing(this._backgroundBottom, {
                toValue: 0,
                duration: 400,
            }),
            Animated.sequence([
                Animated.timing(this._infoViewBottom, {
                    delay: 225,
                    toValue: height*0.0996,
                    duration: 275, //550ms
                }),
                Animated.parallel([
                  Animated.timing(this._infoViewBottom, {
                      toValue: height*0.0647,
                      duration: 100,
                  }),
                  Animated.timing(this._infoContentOpacity, {
                      toValue: 1,
                      duration: 150,
                  }),
                ])
            ])
        ]).start()
      }
    }

    _animateMapBackground(){
      // LayoutAnimation.Presets.linear.duration=300,
      const test = Object.assign(LayoutAnimation.Presets.linear.duration,{duration:300})
      LayoutAnimation.configureNext(test)
      this.setState({
        backgroundStyle:{
          bottom:0
        }
      })
    }
    _animateOpenTaskList(){
      const animationDuration = 500;
      Animated.parallel([
        Animated.timing(this._infoViewBottom, {
            toValue: height-67,
            duration: animationDuration, //550ms
        }),
        Animated.timing(this._infoViewWidth, {
            toValue: width,
            duration: animationDuration, //550ms
        }),
        Animated.timing(this._infoViewHeight, {
            toValue: 67,
            duration: animationDuration, //550ms
        }),
        Animated.timing(this._infoViewLeft, {
            toValue: 0,
            duration: animationDuration, //550ms
        }),
        Animated.timing(this._infoContentOpacity, {
            toValue: 0,
            duration: animationDuration, //550ms
        }),
        Animated.timing(this._backgroundHeight, {
            toValue: height,
            duration: animationDuration, //550ms
        }),
        Animated.timing(this._statusOpacity, {
            toValue: 1,
            duration: animationDuration, //550ms
        })
      ]).start()

      // hide the view after animation finished
      setTimeout(() => {
        this.setState({
          showOrderView: true
        })
      }, animationDuration);

    }
    _animateCloseTaskList(){
      // render the view first so the animation doesn't get weird
      this.setState({
        showOrderView: false
      })

      const animationDuration = 500;
      Animated.parallel([
        Animated.timing(this._infoViewBottom, {
            toValue:  height*0.0647,
            duration: animationDuration, //550ms
        }),
        Animated.timing(this._infoViewWidth, {
            toValue: width*0.834,
            duration: animationDuration, //550ms
        }),
        Animated.timing(this._infoViewHeight, {
            toValue: height*0.283,
            duration: animationDuration, //550ms
        }),
        Animated.timing(this._infoViewLeft, {
            toValue: width*0.083,
            duration: animationDuration, //550ms
        }),
        Animated.timing(this._infoContentOpacity, {
            toValue: 1,
            duration: animationDuration, //550ms
        }),
        Animated.timing(this._backgroundHeight, {
            toValue: height*0.275,
            duration: animationDuration, //550ms
        }),
        Animated.timing(this._statusOpacity, {
            toValue: 0,
            duration: animationDuration, //550ms
        })
      ]).start()

    }

    _showLogin()
    {
      this.setState({
        showLogin:true
      })
    }
    _hideLogin(){
      this.setState({
        showLogin:false
      })

      this._animateMapView()

    }
    //UX Animation END

    //render component
    _renderLogin(){
      if(this.state.showLogin){
        return <Login hideLogin={this._hideLogin}/>
      }
    }
    _renderTaskList(){
      // if(this.state.taskList.length > 0 && this.state.online){
      if(this.state.online){
        return  <CmDriverTaskList taskList={this.state.taskList}
                          ordersList={this.state.orders_list}
                          orderChange = {this._orderChange}
                          openMap = {this._openMap}
                          closeMap = {this._closeMap}
                          showOfflineBtn = {this._showOfflineBtn}
                          styles={{opacity:this._statusOpacity,}}
                          refreshTask={this._refreshTask}
                          refreshingTask={this.state.refreshingTask}
                          onChangeTab={this._onChangeTab}
                          showLogin={this._showLogin}
                          reverseanimateMapView={this._reverseanimateMapView}
                          goOffline={this._goOffline}
                          updateNumOfDoing={this._updateNumOfDoing}
                          />
      }
      else if (this.state.directingPage){
        return  <CmDriverTaskList taskList={this.state.taskList}
                          ordersList={this.state.orders_list}
                          orderChange = {this._orderChange}
                          directingPage = {this.state.directingPage}
                          openMap = {this._openMap}
                          closeMap = {this._closeMap}
                          showOfflineBtn = {this._showOfflineBtn}
                          styles={{opacity:this._statusOpacity,}}
                          refreshTask={this._refreshTask}
                          refreshingTask={this.state.refreshingTask}
                          onChangeTab={this._onChangeTab}
                          goOffline={this._goOffline}
                          reverseanimateMapView={this._reverseanimateMapView}
                          showLogin={this._showLogin}
                          />
      }
      // else if(this.state.taskList.length == 0 && this.state.online){
      //   return <Image  source={require('../../Image/no_order.png')} style={{top:height*0.2,height:height*0.6,width:height*0.6*0.5, alignSelf:'center'}}/>
      // }
    }
    _renderOfflineBtn(){
      if(this.state.online && this.state.showOfflineBtn){
        return(
          <TouchableOpacity activeOpacity={0.6}
                            onPress={this._goOffline}
                            style={{
                                 position:'absolute',
                                 left:width*0.0175,
                                 bottom:height*0.0213,
                                 }}>
            <Animated.Image style={{
                                    height:height*0.0305,
                                    width:width*0.2066,
                                    opacity:this._statusOpacity}}
                                   source={require('../../Image/offline.png')}>
            </Animated.Image>
          </TouchableOpacity>
        )
      }
    }
    _renderDoingNumber(){
      if(this.state.online ){
        return(
          <View style={{position:'absolute',left:0.73*width,bottom:0.015*height,height:width*0.07,width:width*0.2,flexDirection:'row',alignItems:'center',}}>
            <Text allowFontScaling={false} style={{fontSize:15,color:'#798BA5',fontFamily:'FZZhunYuan-M02S'}}>
              Doing
            </Text>
            <View style={{borderRadius:25,
                          backgroundColor:'#798BA5',
                          alignItems:'center',
                          justifyContent:'center',
                          marginLeft:6,
                          height:width*0.05,
                          width:width*0.05}}>
              <Text allowFontScaling={false}
                    style={{color:'white',
                            fontSize: 15,
                            fontFamily:'FZZhunYuan-M02S',
                            alignItems:'center',
                            justifyContent:'center',}}>
                {this.state.numOfDoing}
              </Text>
            </View>
          </View>
        )
      }
    }
    _renderCallServiceBtn(){
      if(this.state.online && this.state.showOfflineBtn){
        return(
          <TouchableOpacity activeOpacity={0.6}
                            onPress={this._goOffline}
                            style={{
                                 position:'absolute',
                                 right:width*0.0175,
                                 bottom:height*0.0213,
                                 }}>
             <Animated.Image style={{
                                    height:height*0.0305,
                                    width:width*0.2066,
                                    opacity:this._statusOpacity}}
                                    source={require('../../Image/call_service.png')}>
             </Animated.Image>
          </TouchableOpacity>
        )
      }
    }
    _renderNavigationBtn(){
      if(this.state.navigationBtn == 'P'){
        return(
          <TouchableOpacity activeOpacity={0.6} onPress={this._jumpToMap}>
            <Image
                style={{height:height*0.0543,
                        width:width*0.3446,
                      }}
                source={require('../../Image/button_restaurant.png')}
              />
          </TouchableOpacity>
        )

      }else{
        return(
          <TouchableOpacity activeOpacity={0.6} onPress={this._jumpToMap}>
            <Image
                style={{height:height*0.0543,
                        width:width*0.3446,
                      }}
                source={require('../../Image/button_customer.png')}
              />
          </TouchableOpacity>
        )
      }
    }
    _renderInfoView(){
      if(!this.state.openMap){
        if (this.state.showOrderView != true)
        return(
          <View style={{flex:1,alignItems:'center',padding:10,}}>
              <Animated.Text style={{fontSize:25,
                                     top:25,
                                     color:'#475464',
                                     opacity:this._infoContentOpacity}}
                              allowFontScaling={false}>
                  Chanmao Driver
              </Animated.Text>
              <TouchableOpacity activeOpacity={0.6}
                                onPress={this._goOnline}
                                style={{top:height*0.283*0.25,}}>
                <Animated.Image
                    style={{height:height*0.0543,
                            width:width*0.3446,
                            opacity:this._infoContentOpacity,
                          }}
                    source={require('../../Image/btn_start.png')}
                  />
              </TouchableOpacity>
                <Animated.View style={{flexDirection:'row', top:height*0.283*0.3, opacity:this._infoContentOpacity,}}>
                  <TouchableOpacity style={{
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                      left: -24,
                    }} onPress={() => this._onPressActionHandler('history')}>
                      <Image style={{top:5}} source={require("../Tabs/images/historygrey.png")}></Image>
                      <Text style={{color: 'grey', top: 6, fontFamily:'FZZhunYuan-M02S'}}
                            allowFontScaling={false}>
                        History
                      </Text>
                  </TouchableOpacity>
                <TouchableOpacity style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    right: -24
                  }} onPress={() => this._onPressActionHandler('about')}>
                  <Image style={{top:5, }} source={require("../Tabs/images/aboutgrey.png")}></Image>
                  <Text style={{color: 'grey', top: 6, fontFamily:'FZZhunYuan-M02S'}}
                        allowFontScaling={false}>
                    About
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
        )
      }else{
      
        return(
          <Animated.View style={{flex:1,alignItems:'center',padding:10,opacity:this._infoContentOpacity}}>
            <Text style={{fontSize:20,
                           marginTop:25,
                           color:'#475464',
                           fontFamily:'FZZhunYuan-M02S'
                           }}
                            numberOfLines={2}
                            allowFontScaling={false}>
                {this.state.dest_name}
            </Text>
            <View style={{backgroundColor:'#a4afc0',height:1,marginTop:7,width:width*0.7}}>
            </View>
            <Text style={{fontSize:18,
                          color:'#475464',
                          marginTop:7,
                          fontFamily:'FZZhunYuan-M02S'
                        }}
                            numberOfLines={2}
                            allowFontScaling={false}>
                {this.state.dest_addr}
            </Text>
            <View style={{flexDirection:'row',marginTop:height*0.283*0.2}}>
                <TouchableOpacity activeOpacity={0.6} onPress={this._closeMap}>
                  <Image
                      style={{height:height*0.0543,
                              width:width*0.3446,
                            }}
                      source={require('../../Image/button_return.png')}
                    />
                </TouchableOpacity>
                {this._renderNavigationBtn()}
            </View>

          </Animated.View>
        )
      }
    }
    _renderNotification(){
      let top
      if (Platform.OS === 'ios') {
        top = 67;
      } else {
        top = 42;
      }
      if(this.state.showNotification){
      // if(true){
        return(
          <TouchableOpacity onPress={this._cancelNotification}style={{position:'absolute',top:top,left:0,right:0,}}>
            <View style={{backgroundColor:'#2a3139',height:30}}>
                <Text style={{fontSize:20,
                               top:3,
                               color:'#ffffff',
                               alignSelf:'center',
                               fontFamily:'FZZhunYuan-M02S'
                             }}
                               allowFontScaling={false}>
                      {this.state.notificationMessage}
                </Text>
            </View>
          </TouchableOpacity>
        )
      }
    }
    // <TouchableOpacity activeOpacity={0.6} onPress={this._animateCloseTaskList} style={{width:300,height:300}}>
    //
    // </TouchableOpacity>

    render() {
      return (
        <View style={styles.container}>
          <Map ref={(mapRef) => {this.mapRef = mapRef}}/>
          <Animated.View style={{width:width,
                                 height:this._backgroundHeight,
                                 bottom:this._backgroundBottom,
                                 backgroundColor:'#efefef',
                                 position:'absolute',}}>

          {this._renderTaskList()}

          </Animated.View>
          <Animated.View style={{width:this._infoViewWidth,
                                height:this._infoViewHeight,
                                left:this._infoViewLeft,
                                bottom:this._infoViewBottom,
                                borderColor:"#e2e2e4",
                                borderBottomWidth:1,
                                backgroundColor:'#ffffff',
                                position:'absolute',}}>

              <Animated.Text style={{fontSize:25,
                                     position:'absolute',
                                     top:25,
                                     left:0,
                                     right:0,
                                     textAlign:'center',
                                     opacity:this._statusOpacity}}
                             allowFontScaling={false}>
                  {this.state.navigatorTitle}
              </Animated.Text>
              {this._renderInfoView()}
              {this._renderOfflineBtn()}

          </Animated.View>
          {this._renderNotification()}
          {this._renderLogin()}

        </View>
      );
    }
}
// <View style={{position:'absolute'}}>

// </View>

// position:'absolute',
// left:0,
// right:0,
// <View style={{height:height*0.283,width:width:0.834,}}>
// </View>
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'blue',
  },
  mapView:{
    width:200,
    height:200,
  }
})

module.exports = Home;
