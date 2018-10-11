/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
  Platform,
  DatePickerIOS,
  Modal,
  DatePickerAndroid
} from 'react-native';
import CmDriverHistoryModule from '../../Modules/HistoryModule/CmDriverHistoryModule';

import HistoryAction from '../../Actions/HistoryAction';
import HistoryModule from '../../Modules/HistoryModule/CmDriverHistoryModule';
import HistoryStore from '../../Stores/HistoryStore';
const { height, width } = Dimensions.get('window');
const deviceHeight = height;
const deviceWidth = width;
let marginTop,headerHeight,acceptButtonHeight;
if(height == 812){
  //min 34
  //header 88 + swiper 200 - FlatList margin 34 + tabbar 30
  marginTop = 34;
  headerHeight = 88;
  acceptButtonHeight = 80;
}else{
  marginTop = 20;
  headerHeight = 64;
  acceptButtonHeight = 40;
}
export default class History extends Component {
  constructor(props)
  {
    super(props);
    this.state={
      orderHistory:{},
      modalVisible: false,
      iv_start:this.getDate(),
      iv_end:this.getDate(),
      complete_time:this.getDate(),
      driver_id:props.driver_id,
      active:true,
      current:true
    }
    this._handleTimeSelected = this._handleTimeSelected.bind(this);
    this._renderOrderList=this._renderOrderList.bind(this);
    this._onChange=this._onChange.bind(this);
    this.getSelectedDate = this.getSelectedDate.bind(this);
    this.getDate = this.getDate.bind(this);
    this.setDate = this.setDate.bind(this);
    this.openTimePicker = this.openTimePicker.bind(this);
    this._getPeriodOrderHistory = this._getPeriodOrderHistory.bind(this);
    this._getTodayHistory = this._getTodayHistory.bind(this);
  }
  componentDidMount()
  { 
    HistoryStore.addChangeListener(this._onChange);
    HistoryAction.getHistory(this.state.iv_start, this.state.iv_end);
  }
  componentWillUnmount() {

     HistoryStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    const state = Object.assign({}, this.state, HistoryStore.getState());
    this.setState(state);
  }


  _getPeriodOrderHistory()
  { 
    HistoryAction.getHistory(this.state.iv_start, this.state.iv_end);
  }
  _getTodayHistory() {
    this.setState({
      active:true,
      iv_start:this.getDate(),
      iv_end:this.getDate()
    },()=>HistoryAction.getHistory(this.state.iv_start, this.state.iv_end))
    
  }
  _renderOrderList()
  {
    let list=[];
    if (!this.state.orderHistory.orders) return;
    for (let i=0;i<this.state.orderHistory.orders.length;i++)
    {
      let order=this.state.orderHistory.orders[i];
      var icon = order.settle_type==1? require('./Image/yes.png') : require('./Image/no.png');
      list.push(
        <View key={i} style={{width:width*0.85,height:0.03*height,
          marginTop:6,flexDirection:'row'}}>
            <View style={{width:width*112/674,height:0.03*height,}}>
              <Text allowFontScaling={false} style={{fontSize:14,fontFamily:'FZZhunYuan-M02S',textAlign:'center'}}>
                {order.oid}
              </Text>
            </View>
            <View style={{width:width*79/674,height:0.03*height,}}>
              <Image key={'yellow' + i} style={{width:20,height:20,marginHorizontal:5}}source={icon}/>
            </View>
            <View style={{width:width*88/674,height:0.03*height,}}>
              <Text allowFontScaling={false} style={{fontSize:14,fontFamily:'FZZhunYuan-M02S',textAlign:'center'}}>
              {order.payment_channel==0? 'cash':'online'}
              </Text>
            </View>
            <View style={{width:width*98/674,height:0.03*height,}}>
              <Text allowFontScaling={false} style={{fontSize:14,fontFamily:'FZZhunYuan-M02S',textAlign:'center'}}>
                {order.amount}
              </Text>
            </View>
            <View style={{width:width*92/674,height:0.03*height,}}>
              <Text allowFontScaling={false} style={{fontSize:14,fontFamily:'FZZhunYuan-M02S',textAlign:'center'}}>
               {order.dlfee}
              </Text>
            </View>
            <View style={{width:width*97/674,height:0.03*height,}}>
              <Text allowFontScaling={false} style={{fontSize:14,fontFamily:'FZZhunYuan-M02S',textAlign:'center'}}>
               {order.service_fee}
              </Text>
            </View>
            <View style={{width:width*108/674,height:0.03*height}}>
              <Text allowFontScaling={false} style={{fontSize:14,fontFamily:'FZZhunYuan-M02S',textAlign:'center'}}>
                {order.settle}
              </Text>
            </View>
          </View>
      )
    }
    return list;
  }
  

  getSelectedDate(time) {
    const Appendzero = (obj) =>
    {
        if(obj < 10) return "0" +""+ obj;
        else return obj;
    }
    let date = time;
    let todayStr = date.getFullYear()+ '-' + Appendzero(date.getMonth()+1) + '-' + Appendzero(date.getDate()) ;
    return todayStr;
  }
  getDate(){
    const Appendzero = (obj) =>
    {
        if(obj < 10) return "0" +""+ obj;
        else return obj;
    }
    let date = new Date();
    let todayStr = date.getFullYear()+ '-' + Appendzero(date.getMonth()+1) + '-' + Appendzero(date.getDate()) ;
    return todayStr;
  }
  _renderTimePicker() {
    if (Platform.OS == 'ios') {
      return (
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}>
          <TouchableOpacity style={{flex: 1}}
            onPressIn={() => this.setState({modalVisible: false})}>
            <View
                style={{position: 'absolute',
                        height: 216 + acceptButtonHeight,
                        width: width,
                        bottom: 0,
                        backgroundColor: '#d4d4d4'}}>
                <DatePickerIOS
                  mode='date'
                  date={new Date(this.state.complete_time)}
                  onDateChange={(value) => this._handleTimeSelected(value)}
                />
              <TouchableOpacity
                style={{backgroundColor: '#ff8b00',
                        padding: 15,
                        height: acceptButtonHeight,
                        justifyContent: 'center'}}
                onPress={() => this.setState({modalVisible: false})}>
                  <Text allowFontScaling={false}
                        style={{textAlign: 'center',
                                color: 'white',
                                fontSize: 18,
                                fontFamily:'FZZhunYuan-M02S'}}>
                                Confrim
                  </Text>
                </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      )
    }
  }
  setDate(dateStr) {
    if(this.state.current) {
      this.setState({
        iv_start: dateStr,
      })
    }else if (!this.state.current) {
      this.setState({
        iv_end: dateStr,
      })

    }
  }
  _handleTimeSelected(date) {
    if(this.state.current) {
      this.setState({
        iv_start:this.getSelectedDate(date),
        complete_time:date
      })
    } else if (!this.state.current) {
      this.setState({
        iv_end:this.getSelectedDate(date),
        complete_time:date
      })
    }
  }
  async openTimePicker(para) {
    this.setState({
      current:para,
      active:false,
      complete_time:this.getDate()
    })
    if (Platform.OS == 'ios') {
     this.setState({
      modalVisible:true,
     })
    } else {
    try {
      const {action, year, month, day} = await DatePickerAndroid.open({
        // Use `new Date()` for current date.
        // May 25 2020. Month 0 is January.
        date: new Date(this.state.complete_time)
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        // Selected year, month (0-11), day
        //return date = new Date(year,month, day).getTime() / 1000;
        month = month + 1;
        dateString = year + '-' + month + '-' + day;
        this.setDate(dateString)
      }
    } catch ({code, message}) {
      console.log(message)
    }
  }
  }
  render() {

    const starList = () => {
      let startNumber=0;
      if (this.state.orderHistory.driver_score){
        let start=this.state.orderHistory.driver_score.charAt(0);
        if (start=='1')starNumber=1;
        else if (start=='2')startNumber=2;
        else if (start=='3')startNumber=3;
        else if (start=='4')startNumber=4;
        else if (start=='5')startNumber=5;
        else startNumber=0;
        let last=this.state.orderHistory.driver_score.charAt(2);
        if (last>'4') startNumber=startNumber+1;
      }
      let _starList = [];
      let list = [1, 2, 3, 4, 5];
      for (let i of list.splice(0, startNumber)) {
        _starList.push(
          <Image key={'yellow' + i} style={{width:30,height:30,marginHorizontal:5}}source={require('./../../Image/yellow_star.png')}/>
        )
      }
      for (let i of list.splice(0, 5)) {
        _starList.push(
          <Image key={'grey' + i} style={{width:30,height:30,marginHorizontal:5}}source={require('./../../Image/grey_star.png')}/>
        )
      }
      return _starList;
    };
    return (
      <ScrollView style={styles.container}>
        <View style={{flex:1,backgroundColor:'#EFEFEF',alignItems:'center'}}>
          <View style={{
            marginTop:0.03*height,
            width:0.85*width,
            height:height*0.07,
            backgroundColor:'white',
            borderRadius:8,
            alignItems:'center',
            justifyContent:'center',
          }}>
            <View style={{
              flex:1,
              backgroundColor:'white',
              borderRadius:8,
              alignItems:'center',
              flexDirection:'row',
              justifyContent:'center',

            }}>
              <View style={{height:0.09*height,width:0.17*width,alignItems:'center',justifyContent:'center'}}>
                <Text allowFontScaling={false} style={{fontSize:14,fontFamily:'FZZhunYuan-M02S'}}>
                  Rating
                </Text>
              </View>
              <View style={{height:0.09*height,width:0.51*width,flexDirection:'row',alignItems:'center',}}>
               {starList()}
              </View>
              <View style={{height:0.09*height,width:0.17*width,alignItems:'center',justifyContent:'center'}}>
                <Text allowFontScaling={false} style={{fontSize:13,fontFamily:'FZZhunYuan-M02S'}}>
                  {this.state.orderHistory.driver_score >= 0 ? this.state.orderHistory.driver_score : 'No Records'}
                </Text>
              </View>
            </View>
          </View>

            <TouchableOpacity onPress ={this._getTodayHistory} style={{ marginTop:0.02*height,
            width:0.85*width,
            height:height*0.05,
            backgroundColor: this.state.active? 'white': '#d2d2d2',
            borderRadius:8,
            flexDirection:'row',
            }}>
              <Text allowFontScaling={false} style={{width:0.425*width,fontSize:22,fontFamily:'FZZhunYuan-M02S',color:'black',alignSelf:'center',paddingLeft:30}}>
                Today
              </Text>
              <Text allowFontScaling={false} style={{width:0.425*width,fontSize:22,fontFamily:'FZZhunYuan-M02S',color:'black',alignSelf:'center',paddingLeft:0.1*width}}>
               {this.getDate()}
              </Text>

            </TouchableOpacity>
            <View style={{ marginTop:0.005*height,
                            width:0.85*width,
                            height:height*0.05,
                            borderRadius:8,
                            flexDirection:'row',
                            }}>
              <TouchableOpacity onPress = {()=> this.openTimePicker(true)} style={{marginTop:0.01*height,
              width:0.3*width,
              height:height*0.05,
              backgroundColor:this.state.active? '#d2d2d2' : 'white',
              justifyContent:'center',
              borderRadius:8}}>
                 <Text allowFontScaling={false} style={{fontSize:20,fontFamily:'FZZhunYuan-M02S',color:'black',alignSelf:'center'}}>
                  {this.state.iv_start}
                </Text>
              </TouchableOpacity>
              <View style={{ marginTop:0.01*height,
              height:height*0.05,
              marginHorizontal:0.025*width,
              justifyContent:'center',
              borderRadius:8,}}>
                <Text style={{fontSize:20,fontFamily:'FZZhunYuan-M02S',color:'black',alignSelf:'center'}}>
                  to
                </Text>
              </View>
              <TouchableOpacity onPress = {()=> this.openTimePicker(false)} style={{ marginTop:0.01*height,
              width:0.3*width,
              height:height*0.05,
              backgroundColor:this.state.active? '#d2d2d2' : 'white',
              justifyContent:'center',
              borderRadius:8,}}>
                <Text allowFontScaling={false} style={{fontSize:20,fontFamily:'FZZhunYuan-M02S',color:'black',alignSelf:'center'}}>
                  {this.state.iv_end}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress = {this._getPeriodOrderHistory} style={{ marginTop:0.01*height,
                  height:height*0.05,
                  width:0.1*width,
                  marginLeft:0.05*width,
                  justifyContent:'center',
                  alignItems:'center',
                  backgroundColor:'#798ba5',
                  borderRadius:8,}} >
                  <Image style={{width:0.05*width,height:0.05*width}}
                    source={require('./Image/tick.png')}
                  />
              </TouchableOpacity>
              {this._renderTimePicker()}

            </View>

            <View style={{
              marginTop:0.025*height,
              width:0.85*width,
              height:0.285*height,
              backgroundColor:'white',
              borderWidth:2,
              borderStyle:'dashed',
              borderRadius:1,
              borderColor:'#798BA5',
              alignItems:'center',
            }}>

              <View style={{marginTop:0.01*height,height:0.05*height, width:0.85*width,justifyContent:'center',alignItems:'center',flexDirection:'row'}}>
                <Text allowFontScaling={false} style={{flex:1, fontSize:22,color:'#535353',fontWeight:'bold',fontFamily:'FZZhunYuan-M02S',textAlign:'center'}}>
                  Total Balance
                </Text>
                <Text allowFontScaling={false} style={{flex:1,fontSize:22,color:'#535353',fontWeight:'bold',fontFamily:'FZZhunYuan-M02S',textAlign:'center'}}>
                  Total Earning
                </Text>
              </View>
              <View style={{marginTop:0.01*height,height:0.03*height, width:0.85*width,justifyContent:'center',alignItems:'center',flexDirection:'row'}}>
                <Text allowFontScaling={false} style={{flex:1, fontSize:24,color:'#f98e09',fontWeight:'bold',fontFamily:'FZZhunYuan-M02S',textAlign:'center'}}>
                   ${this.state.orderHistory.total_settle}               
                </Text>
                <Text allowFontScaling={false} style={{flex:1,fontSize:24,color:'#f98e09',fontWeight:'bold',fontFamily:'FZZhunYuan-M02S',textAlign:'center'}}>
                   ${this.state.orderHistory.total_earning}              
                 </Text>
              </View>
              <View style={{
                  marginVertical:0.015*height,
                  width: '90%',
                  borderBottomColor: '#535353',
                  borderBottomWidth: 1,
                }}
              />
              <View style={{height:0.05*height, width:0.85*width,justifyContent:'center',alignItems:'center',flexDirection:'row'}}>
                <View style={{flex:1, flexDirection:'row',paddingHorizontal:0.04*width}}>
                <Text allowFontScaling={false} style={{flex:1,fontSize:22,color:'#535353',fontWeight:'bold',fontFamily:'FZZhunYuan-M02S',}}>
                  Orders
                </Text>
                <Text allowFontScaling={false} style={{flex:1,fontSize:22,color:'#f98e09',fontWeight:'bold',fontFamily:'FZZhunYuan-M02S',textAlign:'right'}}>
                  {this.state.orderHistory.order_count}
                </Text>
                </View>
                <View style={{flex:1,paddingHorizontal:0.04*width}}>
                <View  style={{flex:1, flexDirection:'row'}}>
                <Text allowFontScaling={false} style={{flex:1,fontSize:18,color:'#535353',fontWeight:'bold',fontFamily:'FZZhunYuan-M02S'}}>
                  Total 
                </Text>
                <Text allowFontScaling={false} style={{flex:1,fontSize:18,color:'#f98e09',fontWeight:'bold',fontFamily:'FZZhunYuan-M02S',textAlign:'right'}}>
               ${this.state.orderHistory.total_amount}
                </Text>
                </View>
                <View  style={{flex:1, flexDirection:'row'}}>
                <Text allowFontScaling={false} style={{flex:1,fontSize:18,color:'#535353',fontWeight:'bold',fontFamily:'FZZhunYuan-M02S'}}>
                 Online
                </Text>
                <Text allowFontScaling={false} style={{flex:1,fontSize:18,color:'#f98e09',fontWeight:'bold',fontFamily:'FZZhunYuan-M02S',textAlign:'right'}}>
                ${this.state.orderHistory.total_online_amount}
                </Text>
                </View>
               
                </View>
               
               
              </View>
              <View style={{
                  marginVertical:0.015*height,
                  width: '90%',
                  borderBottomColor: '#535353',
                  borderBottomWidth: 1,
                }}/>
              <View style={{height:0.05*height, width:0.85*width,justifyContent:'center',alignItems:'center',flexDirection:'row'}}>
              <View style={{flex:1,paddingHorizontal:0.04*width}}>
                    <View  style={{flex:1, flexDirection:'row'}}>
                        <Text allowFontScaling={false} style={{flex:1,fontSize:18,color:'#535353',fontWeight:'bold',fontFamily:'FZZhunYuan-M02S',}}>
                          Del.Fee 
                        </Text>
                        <Text allowFontScaling={false} style={{flex:1,fontSize:18,color:'#f98e09',fontWeight:'bold',fontFamily:'FZZhunYuan-M02S',textAlign:'right'}}>
                          ${this.state.orderHistory.total_del_fee}
                        </Text>
                    </View>
                    <View  style={{flex:1, flexDirection:'row'}}>
                        <Text allowFontScaling={false} style={{flex:1,fontSize:18,color:'#535353',fontWeight:'bold',fontFamily:'FZZhunYuan-M02S',}}>
                        Online
                        </Text>
                        <Text allowFontScaling={false} style={{flex:1,fontSize:18,color:'#f98e09',fontWeight:'bold',fontFamily:'FZZhunYuan-M02S',textAlign:'right'}}>
                          ${this.state.orderHistory.total_online_df}
                        </Text>
                    </View>
                </View>
                <View style={{flex:1,paddingHorizontal:0.04*width}}>
                    <View  style={{flex:1, flexDirection:'row'}}>
                        <Text allowFontScaling={false} style={{flex:1,fontSize:18,color:'#535353',fontWeight:'bold',fontFamily:'FZZhunYuan-M02S'}}>
                          Srv.Fee 
                        </Text>
                        <Text allowFontScaling={false} style={{flex:1,fontSize:18,color:'#f98e09',fontWeight:'bold',fontFamily:'FZZhunYuan-M02S',textAlign:'right'}}>
                          ${this.state.orderHistory.total_service_fee}
                        </Text>
                    </View>
                    <View  style={{flex:1, flexDirection:'row'}}>
                        <Text allowFontScaling={false} style={{flex:1,fontSize:18,color:'#535353',fontWeight:'bold',fontFamily:'FZZhunYuan-M02S'}}>
                        Online
                        </Text>
                        <Text allowFontScaling={false} style={{flex:1,fontSize:18,color:'#f98e09',fontWeight:'bold',fontFamily:'FZZhunYuan-M02S',textAlign:'right'}}>
                        ${this.state.orderHistory.total_online_sf}
                        </Text>
                    </View>
                </View>
              </View>
            </View>



        <View style={{backgroundColor:'white',marginTop:0.03*height,width:width,height:0.05 * height,justifyContent:'center',}}>

          <View style={{width:width*0.85,height:0.03*height,
            flexDirection:'row'}}>
            <View style={{width:width*112/674,height:0.03*height,}}>
              <Text allowFontScaling={false} style={{fontSize:14,fontFamily:'FZZhunYuan-M02S',textAlign:'center'}}>
                No.
              </Text>
            </View>
            <View style={{width:width*79/674,height:0.03*height,}}>
              <Text allowFontScaling={false} style={{fontSize:14,fontFamily:'FZZhunYuan-M02S',textAlign:'center'}}>
                Status
              </Text>
            </View>
            <View style={{width:width*88/674,height:0.03*height,}}>
              <Text allowFontScaling={false} style={{fontSize:14,fontFamily:'FZZhunYuan-M02S',textAlign:'center'}}>
                Method
              </Text>
            </View>
            <View style={{width:width*98/674,height:0.03*height,}}>
              <Text allowFontScaling={false} style={{fontSize:14,fontFamily:'FZZhunYuan-M02S',textAlign:'center'}}>
                Total
              </Text>
            </View>
            <View style={{width:width*92/674,height:0.03*height,}}>
              <Text allowFontScaling={false} style={{fontSize:14,fontFamily:'FZZhunYuan-M02S',textAlign:'center'}}>
                Del.Fee
              </Text>
            </View>
            <View style={{width:width*97/674,height:0.03*height,}}>
              <Text allowFontScaling={false} style={{fontSize:14,fontFamily:'FZZhunYuan-M02S',textAlign:'center'}}>
               Ser.Fee
              </Text>
            </View>
            <View style={{width:width*108/674,height:0.03*height}}>
              <Text allowFontScaling={false} style={{fontSize:14,fontFamily:'FZZhunYuan-M02S',textAlign:'center'}}>
                Balance
              </Text>
            </View>
          </View>


        </View>

        <View style={{backgroundColor:'white',
                      marginTop:10,
                      width:width,}}>
          {this._renderOrderList()}
        </View>

        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 60
  },
});
