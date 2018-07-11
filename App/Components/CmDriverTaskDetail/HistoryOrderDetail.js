'use strict'

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,

} from 'react-native';
export default class orderHistory extends Component {



  _renderList(){
    return this.props.items.map((item,index)=>{
      return(
        <View style={{flex:1,flexDirection:'row',paddingBottom:13}} key={index}>
          <View style={styles.quantityIcon}><Text style={{fontSize:12}}>{item.qty}</Text></View>
          <Text style={{fontSize:15,paddingLeft:5,}} allowFontScaling={false}>{item.name}</Text>
          <View style={{flex:1}}></View>
          <Text style={{fontSize:15,alignSelf:'flex-end',color:'#969696',marginRight:10}} allowFontScaling={false}>${item.price * item.qty} </Text>
        </View>
      )
    })
  }
  _renderComment(){
    if(this.props.comment){
      return(
        <View style={styles.comment}>
          <View style={{marginRight:10, marginLeft:10}}>
            <Text style={{fontSize:15,lineHeight:16}} allowFontScaling={false}>
              <Text style={{fontWeight:'bold',color:'#ea7b21'}} allowFontScaling={false}>
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
  render() {
    console.log(historydetail)
      return(
  //area: <Text style={{fontSize:12}} allowFontScaling={false}>{orderInfo.shop.section}</Text>
        <View style={{flex:1}}>
          <View style={styles.modalHearder}>
              <Text style={{fontSize:26, alignSelf:'center',paddingBottom:10,}} allowFontScaling={false}>
                {this.props.oid}
              </Text>
              <View style={{flexDirection:"row",justifyContent:"flex-start",paddingLeft:20,paddingRight:20}}>
                  <View style={styles.headerLeft}>
                      <Text style={{fontSize:15}} allowFontScaling={false}>{this.props.name}</Text>
                  </View>
                  <View style={styles.headerRight}>
                      <Text style={{fontSize:12,textAlign:'right'}} allowFontScaling={false}>{this.props.created}</Text>
                  </View>
              </View>
              
          </View>
          <ScrollView style={{flex:1, borderTopWidth:1, borderColor: '#e7e7e7',}}>
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
                            <Text style={[styles.contentFont], {color: 'black'}} allowFontScaling={false}>支付方式：支付宝</Text>
                    </View>


              </View>
              <View style={styles.modalContent}>
                    {this._renderList()}
                    {this._renderComment()}
              </View>
            </ScrollView>
          <View style={styles.modalFooter}>
              <View style={{flex:1,backgroundColor:"yellow"}}></View>
              <View style={{flex:1,alignSelf: 'flex-end', justifyContent: 'center',}}>

                  <Text style={{alignSelf: 'flex-end',
                                color:'black',
                                fontSize:18,
                                fontWeight:'bold',
                                flex:1,
                                marginTop:15}}
                        allowFontScaling={false}>
                          Total: ${this.props.total}
                  </Text>
              </View>
          </View>
          {this._renderLoading()}
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
    paddingTop:10
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
    flex:1
  },

  modalFooter:{
    flex:0.2,
    alignItems:'center',
    backgroundColor:"white",
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
    justifyContent:'center',
    height:18,
    width:18,
  },

});
