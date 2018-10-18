'use strict'

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
  Dimensions

} from 'react-native';
const {height,width} = Dimensions.get('window');

import moment from 'moment-timezone'

export default class orderHistory extends Component {

  _renderList(){
    return this.props.items.map((item,index)=>{
      const toppingGroup = () => {
        let _toppingGroup = [];
        if (item.tps) {
          for (let tp of item.tps) {
            _toppingGroup.push(
              <View key={tp.tp_id}
                    style={{flexDirection: 'row', marginTop: 3, marginLeft: 24,}}>

                <View style={{flex:1,justifyContent:'center'}}>
                    <Text allowFontScaling={false}
                          style={{color:'#ababb0',
                                  fontSize:16,
                                  fontFamily:'FZZhunYuan-M02S'}}>
                      {tp.tp_name}
                    </Text>
                </View>
                <View style={{flex:1,alignItems:'flex-end',justifyContent:'center',marginRight: 0}}>
                  <Text allowFontScaling={false}
                        style={{color:'#ababb0',
                                fontSize:16,
                                fontFamily:'FZZhunYuan-M02S',
                                textAlign: 'left'}}>
                    ${tp.price}×{tp.amount}
                  </Text>
                </View>
              </View>
            )
          }
          return _toppingGroup;
        }
      }
      return(
        <View style={{flex:1, flexDirection:'column', marginBottom: 8}} key={index}>
          <View style={{flex:1,flexDirection:'row',paddingBottom: 5}} key={index}>
            <View style={styles.quantityIcon}>
              <Text style={{fontSize:12,fontFamily:'FZZhunYuan-M02S'}}>
                {item.amount}
              </Text>
            </View>
            <Text style={{fontSize:15,fontFamily:'FZZhunYuan-M02S', width: width * 0.54, marginLeft: 6}} allowFontScaling={false}>{item.ds_name}</Text>
            <Text style={{flex: 1, fontSize:15,alignSelf:'flex-start', textAlign: 'right', color:'#969696',marginRight:0,fontFamily:'FZZhunYuan-M02S'}}
                  allowFontScaling={false}>
                ${item.price * item.amount}
            </Text>
          </View>
          {toppingGroup()}
        </View>
      )
    })
  }
  _renderComment(){
    if(this.props.comment){
      return(
        <View style={styles.comment}>
          <View style={{marginRight:10, marginLeft:10}}>
            <Text style={{fontSize:15,lineHeight:16,fontFamily:'FZZhunYuan-M02S'}} allowFontScaling={false}>
              <Text style={{fontWeight:'bold',color:'#ea7b21',fontFamily:'FZZhunYuan-M02S'}} allowFontScaling={false}>
                备注：
              </Text>
              {this.props.comment}
            </Text>
          </View>
        </View>
      )
    }
  }
  _renderLoading(){
    if(this.props.loading){
      return(
        <View style={{position:'absolute',
                      top:0,
                      left:0,
                      bottom:0,
                      right:0,
                      backgroundColor:"#ffffff",
                      justifyContent:'center',
                      alignItems:'center'}}>
          <Image source={require('./Image/Loading_dots_orange.gif')}style={{width:45,height:15}}/>
        </View>
      )
    }
  }
  _renderCloseButton(){
    return(
      <View style={{position: 'absolute', top: 10, right: 30}}>
        <TouchableOpacity onPress={this.props.close}>
          <Text allowFontScaling={false} style={{fontSize: 20, padding: 5, paddingLeft: 10, paddingRight: 10,fontFamily:'FZZhunYuan-M02S'}}>
            x
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
  render() {
      const paymentMapping = {
        0: '到付',
        1: '刷卡(Visa/Master Card/Debit Visa)',
        10: '支付宝',
        30: 'Apple Pay',
      };
      let paymentString = paymentMapping[this.props.payment_channel];
      let wrapperStyle = {};
      if(Platform.OS == 'ios') {
        wrapperStyle.flex = 1;
      }else {
        wrapperStyle.height = height;
        wrapperStyle.width = width;
        wrapperStyle.backgroundColor = 'white';
      }
      return(
        <View style={wrapperStyle}>

          <View style={styles.modalHearder}>
              <Text style={{fontSize:26, alignSelf:'center',paddingBottom:10,fontFamily:'FZZhunYuan-M02S'}} allowFontScaling={false}>
                {this.props.oid}
              </Text>
              <View style={{flexDirection:"row",justifyContent:"flex-start",paddingLeft:20,paddingRight:20}}>
                  <View style={styles.headerLeft}>
                      <Text style={{fontSize:15, fontFamily:'FZZhunYuan-M02S'}} allowFontScaling={false}>{this.props.name}</Text>
                  </View>
                  <View style={styles.headerRight}>
                      <Text style={{fontSize:12,textAlign:'right', fontFamily:'FZZhunYuan-M02S'}} allowFontScaling={false}>{moment.tz(this.props.created, 'Asia/Shanghai').format('YYYY-MM-DD HH:mm')}</Text>
                  </View>
              </View>

          </View>
          <View style={{width:width,height:0.5*height}}>

          <ScrollView style={{height: 10, borderTopWidth:1, borderColor: '#e7e7e7',}}>
              <View style={styles.modalInfo}>
                    <View style={{flexDirection:'row',paddingTop:10,paddingBottom:10,justifyContent: 'center',}}>
                        <Image source={require('./Image/icon_name.png')}
                               style={{
                                  width:20,
                                  height:20,
                                  marginRight:15,

                                  alignSelf:"center"
                               }}/>
                        <Text style={styles.contentFont} allowFontScaling={false}>{this.props.user_name}</Text>
                    </View>

                    <View style={{flexDirection:'row',paddingBottom:10,justifyContent: 'center'}}>
                        <Image source={require('./Image/icon_address.png')}
                               style={{
                                  width:19,
                                  height:25,
                                  marginRight:15,

                                  alignSelf:"center"
                              }}/>
                        <Text style={styles.contentFont} allowFontScaling={false}>{this.props.user_addr}</Text>
                    </View>

                    <View style={{flexDirection:'row',paddingBottom:10,justifyContent: 'flex-start'}}>
                            <Text style={[styles.contentFont, {color: 'black'}]} allowFontScaling={false}>支付方式：{paymentString}</Text>
                    </View>


              </View>
              <View style={styles.modalContent}>
                    {this._renderList()}
                    {this._renderComment()}
              </View>
            </ScrollView>


            </View>

          <View style={styles.modalFooter}>
              <View style={{flex:1,backgroundColor:"yellow"}}></View>
              <View style={{flex:1,alignSelf: 'flex-end', justifyContent: 'center',}}>

                  <Text style={{alignSelf: 'flex-end',
                                color:'black',
                                fontSize:18,
                                fontWeight:'bold',
                                fontFamily:'FZZhunYuan-M02S',
                                flex:1,
                                marginTop:15}}
                        allowFontScaling={false}>
                          Total: ${this.props.total}
                  </Text>
              </View>
          </View>
          {this._renderLoading()}
          {this._renderCloseButton()}
        </View>
    )
  }

}

const styles = StyleSheet.create({


  modalHearder:{
    flex:0.35,
    justifyContent: 'center',

  },
  headerLeft:{
      flex:1,
      paddingRight:20,
  },
  headerRight:{
      flex:1,
      paddingLeft:20,
  },
  modalInfo:{
    flex:1,
    borderBottomWidth: 1,
    borderColor: '#e7e7e7',
    marginLeft:20,
    marginRight:20,
    justifyContent: 'center',
    paddingBottom:10,
    paddingTop:10,
  },
  modalContent:{
    flex:1,
    marginTop:15,
    marginLeft:20,
    marginRight:20,
    paddingBottom:15,
  },
  comment:{
    paddingTop:15,
    paddingBottom:15,
    backgroundColor:'#f2f2f2',

  },
  contentFont:{
    color:'#ea7b21',
    fontSize:14,
    flex:1,
    fontFamily:'FZZhunYuan-M02S'
  },

  modalFooter:{
    flex:0.5,
    alignItems:'center',
    flexDirection:'row',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderColor: '#e7e7e7',
    marginLeft:20,
    marginRight:20,

  },
  quantityIcon:{
    borderColor:'#d9d9d9',
    borderWidth:1,
    alignItems:'center',
    alignSelf: 'flex-start',
    justifyContent:'center',
    height:18,
    width:18,
  },

});
