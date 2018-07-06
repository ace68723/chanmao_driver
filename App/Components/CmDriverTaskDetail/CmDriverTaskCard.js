'use strict';
import React, { Component } from 'react';
import {
  Animated,
  Dimensions,
  LayoutAnimation,
  Linking,
  Image,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
const {height,width} = Dimensions.get('window');

class TaskCard extends Component {
    constructor() {
      super()

    }

    _renderTask(){
      if(this.props.status == 10 ||this.props.status == 20 ){
        return this._renderPickup();
      }else if(this.props.status == 30){
        return this._renderDelivering();
      }else if(this.props.status ==40){
        return this._renderFinish();
      }else if(this.props.status == 90 || this.props.status == 500){
        return this._renderCancel();
      }else if (this.props.status == "updating") {
        return this._renderUpdating();
      }
    }
    _renderComment(){
      if(this.props.order.comment!=''){
        return(
              <Text ref={'comment'}
                    allowFontScaling={false}
                    style={{color:'#485465',fontSize:13,fontWeight:'500',marginTop:height*0.0136}}
                    numberOfLines={1}>
                Comment: {this.props.order.comment}
              </Text>
        )
      }
    }

    _renderPickup(){
      return(
        <View style={{width:width*0.965,
                      height:width*0.965*0.725,
                      backgroundColor:'#ffffff',
                      marginTop:height*0.0135,
                      alignSelf:'center',
                      shadowColor:'#000000',
                      shadowOpacity:0.1,
                      shadowOffset:{width: 2, height: 2}
                      }}>
          <View style={{width:width*0.965,height:height*0.0045,backgroundColor:'#f68a1d',}}/>
          <View style={{flex:1,
                        paddingTop:height*0.0136,
                        paddingLeft:width*0.0386,
                        paddingRight:width*0.0386,
                        paddingBottom:height*0.0136,

                      }}>
            <View style={{flexDirection:'row'}}>
              <View style={{width:width*0.7}}>

                  <View style={{flexDirection:'row'}}>
                    <Text allowFontScaling={false} style={{fontSize:15,fontWeight:'800'}}>
                      {this.props.oid}｜Pick-up
                    </Text>
                  </View>
                  <TouchableOpacity onPress={this.props.openMap.bind(null,this.props.restaurant,this.props.address,'P')}>
                    <View style={{marginTop:width*0.0163,}}>
                      <Text allowFontScaling={false} style={{color:'#f68a1d',fontSize:15,fontWeight:'600',}}>
                        &nbsp;&nbsp;&nbsp; {this.props.restaurant.name}
                      </Text>
                      <Image
                          style={{height:height*0.025,
                                  width:height*0.025*0.7272,
                                  marginTop:height*0.0043,
                                  top:-1,
                                  left:0,
                                  position:'absolute',
                                }}
                          source={require('../../Image/icon_location.png')}
                        />
                    </View>
                  <Text allowFontScaling={false} style={{marginTop:width*0.005,fontSize:13,color:'#485465'}}>
                    {this.props.restaurant.addr}
                  </Text>
                 </TouchableOpacity>
              </View>

            </View>

            <TouchableOpacity onPress={this.props.openComment.bind(null,this.props.oid,
                                                      this.props.status,
                                                      this.props.order,
                                                      this.props.restaurant,
                                                      this.props.address)}>

              <View style={{flexDirection:'row',marginTop:height*0.01,justifyContent: 'space-between'}}>

                <TouchableOpacity onPress={()=>{Linking.openURL('tel:' + this.props.restaurant.tel)}}>
                  <View style={[styles.actionButton, {flex: 1, flexDirection: 'row'}]}>
                    <Image style={styles.actionButtonImage} source={require('./Image/restaurant.png')}/>
                    <Text style={styles.actionButtonText}>{this.props.restaurant.tel}</Text>
                  </View>
                </TouchableOpacity>


                <TouchableOpacity onPress={()=>{Linking.openURL('tel:' + this.props.address.tel)}}>
                    <View style={[styles.actionButton, {flexDirection: 'row'}]}>
                      <Image style={styles.actionButtonImage} source={require('./Image/user.png')}/>
                      <Text style={styles.actionButtonText}>{this.props.address.tel}</Text>
                    </View>
                </TouchableOpacity>

              </View>

              <View style={{flexDirection:'row',marginTop:height*0.012}}>

                <Text allowFontScaling={false} style={styles.infoText}>
                  Order Time: {this.props.order.created}
                </Text>
                <Text allowFontScaling={false} style={[styles.infoText, {color: '#f68a1d'}]}>
                  Pick-up Time: 12:50
                </Text>

              </View>

              <View style={{flexDirection:'row',marginTop:height*0.01}}>

                <Text allowFontScaling={false} style={[styles.infoText, {color: '#f68a1d'}]}>
                  Total: ${this.props.order.total}
                </Text>
                <Text allowFontScaling={false} style={styles.infoText}>
                  Delivery Fee: ${this.props.order.dlexp}
                </Text>
              </View>

              <View style={styles.separatorLine}></View>

              <View style={{flexDirection:'column',marginTop:height*0.01, height: 40}}>
                <Text allowFontScaling={false} style={styles.infoText}>
                  User: {this.props.address.unit}{this.props.address.addr}
                </Text>
                {this._renderComment()}
              </View>

            </TouchableOpacity>


            <View style={{flexDirection:'row',flex: 1,marginTop:height*0.01, justifyContent: 'space-between'}}>
              <TouchableOpacity style={{}} onPress={this.props.openComment.bind(null,this.props.oid,
                                                        this.props.status,
                                                        this.props.order,
                                                        this.props.restaurant,
                                                        this.props.address)}>
                  <View style={[styles.orderDetailButton, {alignSelf: 'center', flex: 1, flexDirection: 'row'}]}>
                    <Image style={styles.orderDetailButtonImage} source={require('./Image/orderdetail.png')}/>
                    <Text style={styles.orderDetailButtonText}>Order Detail ></Text>
                  </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={this.props.orderChange.bind(null,this.props.oid,'P','30')}>
                  <View style={[styles.actionButton,
                      {
                        flexDirection: 'row',
                        backgroundColor: '#EA8037',
                        alignContent: 'center',
                        width: 110,
                        borderWidth: 0, marginTop: 8}]}>
                    <Text style={[styles.actionButtonText, {fontSize: 16, color: 'white', lineHeight: 16}]}>Pick-up</Text>
                  </View>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      )
    }
    _renderDelivering(){
      return(
        <View style={{width:width*0.965,
                      height:width*0.965*0.725,
                      backgroundColor:'#ffffff',
                      marginTop:height*0.0135,
                      alignSelf:'center',
                      shadowColor:'#000000',
                      shadowOpacity:0.1,
                      shadowOffset:{width: 2, height: 2}
                      }}>
          <View style={{width:width*0.965,height:height*0.0045,backgroundColor:'#f68a1d',}}/>
          <View style={{flex:1,
                        paddingTop:height*0.0136,
                        paddingLeft:width*0.0386,
                        paddingRight:width*0.0386,
                        paddingBottom:height*0.0136,

                      }}>
            <View style={{flexDirection:'row'}}>
              <View style={{width:width*0.7}}>

                  <View style={{flexDirection:'row'}}>
                    <Text allowFontScaling={false} style={{fontSize:15,fontWeight:'800'}}>
                      {this.props.oid}｜Delivering
                    </Text>
                  </View>
                  <TouchableOpacity onPress={this.props.openMap.bind(null,this.props.restaurant,this.props.address,'D')}>
                    <View style={{marginTop:width*0.0163,}}>
                      <Text allowFontScaling={false} style={{color:'#f68a1d',fontSize:15,fontWeight:'600',}}>
                        &nbsp;&nbsp;&nbsp; {this.props.address.addr}
                      </Text>
                      <Image
                          style={{height:height*0.025,
                                  width:height*0.025*0.7272,
                                  marginTop:height*0.0043,
                                  top:-1,
                                  left:0,
                                  position:'absolute',
                                }}
                          source={require('../../Image/icon_location.png')}
                        />
                    </View>
                  <Text allowFontScaling={false} style={{marginTop:width*0.005,fontSize:13,color:'#485465'}}>
                    {this.props.address.name}
                  </Text>
                 </TouchableOpacity>
              </View>

            </View>

            <TouchableOpacity onPress={this.props.openComment.bind(null,this.props.oid,
                                                      this.props.status,
                                                      this.props.order,
                                                      this.props.restaurant,
                                                      this.props.address)}>

              <View style={{flexDirection:'row',marginTop:height*0.01,justifyContent: 'space-between'}}>

                <TouchableOpacity onPress={()=>{Linking.openURL('tel:' + this.props.restaurant.tel)}}>
                  <View style={[styles.actionButton, {flex: 1, flexDirection: 'row'}]}>
                    <Image style={styles.actionButtonImage} source={require('./Image/restaurant.png')}/>
                    <Text style={styles.actionButtonText}>{this.props.restaurant.tel}</Text>
                  </View>
                </TouchableOpacity>


                <TouchableOpacity onPress={()=>{Linking.openURL('tel:' + this.props.address.tel)}}>
                    <View style={[styles.actionButton, {flexDirection: 'row'}]}>
                      <Image style={styles.actionButtonImage} source={require('./Image/user.png')}/>
                      <Text style={styles.actionButtonText}>{this.props.address.tel}</Text>
                    </View>
                </TouchableOpacity>

              </View>

              <View style={{flexDirection:'row',marginTop:height*0.012}}>

                <Text allowFontScaling={false} style={styles.infoText}>
                  Order Time: {this.props.order.created}
                </Text>
                <Text allowFontScaling={false} style={[styles.infoText, {color: '#f68a1d'}]}>
                  Pick-up Time: 12:50
                </Text>

              </View>

              <View style={{flexDirection:'row',marginTop:height*0.01}}>

                <Text allowFontScaling={false} style={[styles.infoText, {color: '#f68a1d'}]}>
                  Total: ${this.props.order.total}
                </Text>
                <Text allowFontScaling={false} style={styles.infoText}>
                  Delivery Fee: ${this.props.order.dlexp}
                </Text>
              </View>

              <View style={styles.separatorLine}></View>

              <View style={{flexDirection:'column',marginTop:height*0.01, height: 40}}>
                <Text allowFontScaling={false} style={styles.infoText}>
                  Payment: Online
                </Text>
                {this._renderComment()}
              </View>

            </TouchableOpacity>



            <View style={{flexDirection:'row',flex: 1,marginTop:height*0.01, justifyContent: 'space-between'}}>
              <TouchableOpacity style={{}} onPress={this.props.openComment.bind(null,this.props.oid,
                                                        this.props.status,
                                                        this.props.order,
                                                        this.props.restaurant,
                                                        this.props.address)}>
                  <View style={[styles.orderDetailButton, {alignSelf: 'center', flex: 1, flexDirection: 'row'}]}>
                    <Image style={styles.orderDetailButtonImage} source={require('./Image/orderdetail.png')}/>
                    <Text style={styles.orderDetailButtonText}>Order Detail ></Text>
                  </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.props.orderChange.bind(null,this.props.oid,'D','40')}>
                  <View style={[styles.actionButton, {flexDirection: 'row', backgroundColor: '#474E56', alignContent: 'center', width: 110}]}>
                    <Text style={[styles.actionButtonText, {fontSize: 16, color: 'white', lineHeight: 16}]}>Delivered</Text>
                  </View>
              </TouchableOpacity>
            </View>


          </View>
        </View>
      )
    }
    _renderFinish(){
      return(
        <View style={{width:width*0.965,
                      height:width*0.965*0.5,
                      backgroundColor:'#ffffff',
                      marginTop:height*0.0135,
                      alignSelf:'center',
                      shadowColor:'#000000',
                      shadowOpacity:0.1,
                      shadowOffset:{width: 2, height: 2}
                      }}>
          <View style={{width:width*0.965,height:height*0.0045,backgroundColor:'#475464',}}/>
          <View style={{flex:1,
                        paddingTop:height*0.0136,
                        paddingLeft:width*0.0386,
                        paddingRight:width*0.0386,
                        paddingBottom:height*0.0136,

                      }}>
            <View style={{flexDirection:'row'}}>
              <View style={{width:width*0.7}}>

                  <View style={{flexDirection:'row'}}>
                    <Text allowFontScaling={false} style={{fontSize:15,fontWeight:'800'}}>
                      {this.props.oid}｜Finished
                    </Text>
                  </View>
              </View>

            </View>

            <TouchableOpacity onPress={this.props.openComment.bind(null,this.props.oid,
                                                      this.props.status,
                                                      this.props.order,
                                                      this.props.restaurant,
                                                      this.props.address)}>

              <View style={{flexDirection:'row',marginTop:height*0.01,justifyContent: 'space-between'}}>

                <TouchableOpacity onPress={()=>{Linking.openURL('tel:' + this.props.restaurant.tel)}}>
                  <View style={[styles.actionButton, {flex: 1, flexDirection: 'row'}]}>
                    <Image style={styles.actionButtonImage} source={require('./Image/restaurant.png')}/>
                    <Text style={styles.actionButtonText}>{this.props.restaurant.tel}</Text>
                  </View>
                </TouchableOpacity>


                <TouchableOpacity onPress={()=>{Linking.openURL('tel:' + this.props.address.tel)}}>
                    <View style={[styles.actionButton, {flexDirection: 'row'}]}>
                      <Image style={styles.actionButtonImage} source={require('./Image/user.png')}/>
                      <Text style={styles.actionButtonText}>{this.props.address.tel}</Text>
                    </View>
                </TouchableOpacity>

              </View>

              <View style={{flexDirection:'row',marginTop:height*0.012}}>

                <Text allowFontScaling={false} style={styles.infoText}>
                  Order Time: {this.props.order.created}
                </Text>
                <Text allowFontScaling={false} style={[styles.infoText, {color: '#f68a1d'}]}>
                  Delivery Time: 12:50
                </Text>

              </View>

              <View style={{flexDirection:'row',marginTop:height*0.01}}>

                <Text allowFontScaling={false} style={[styles.infoText, {color: '#f68a1d'}]}>
                  Total: ${this.props.order.total}
                </Text>
                <Text allowFontScaling={false} style={styles.infoText}>
                  Delivery Fee: ${this.props.order.dlexp}
                </Text>
              </View>

              <View style={styles.separatorLine}></View>

              <View style={{flexDirection:'column',marginTop:height*0.01, height: 40}}>
                <View style={{flexDirection:'row'}}>
                  <Text allowFontScaling={false} style={styles.infoText}>
                    Payment: Online
                  </Text>
                  <Text allowFontScaling={false} style={[styles.infoText, {color: '#f68a1d'}]}>
                    Tips: ${this.props.order.tips}
                  </Text>
                </View>
                {this._renderComment()}
              </View>
            </TouchableOpacity>

          </View>
        </View>
      )
    }
    _renderCancel(){
      return(
        <View style={{width:width*0.965,
                      height:width*0.965*0.6,
                      backgroundColor:'#ffffff',
                      marginTop:height*0.0135,
                      alignSelf:'center',
                      shadowColor:'#000000',
                      shadowOpacity:0.1,
                      shadowOffset:{width: 2, height: 2}
                      }}>
          <View style={{width:width*0.965,height:height*0.0045,backgroundColor:'#ef5467',}}/>
          <View style={{flex:1,
                        paddingTop:height*0.0136,
                        paddingLeft:width*0.0386,
                        paddingRight:width*0.0386,
                        paddingBottom:height*0.0254,

                      }}>
            <View style={{flexDirection:'row'}}>
              <View style={{width:width*0.7}}>

                  <View style={{flexDirection:'row'}}>
                    <Text allowFontScaling={false} style={{fontSize:15,fontWeight:'800'}}>
                      {this.props.oid} |
                    </Text>
                    <Text allowFontScaling={false} style={{fontSize:15,fontWeight:'800',color:'#ef5467'}}>
                      &nbsp;Canceled
                    </Text>
                    <Text allowFontScaling={false} style={{fontSize:11,marginTop:4,marginLeft:6,color:'#485465'}}>
                      {this.props.order.created}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={this.props.openMap.bind(null,this.props.restaurant.name,this.props.restaurant.addr,this.props.address.addr)}>
                    <View style={{marginTop:width*0.0163,}}>
                      <Text allowFontScaling={false} style={{color:'#f68a1d',fontSize:15,fontWeight:'600',}}>
                        &nbsp;&nbsp;&nbsp; {this.props.restaurant.name}
                      </Text>
                      <Image
                          style={{height:height*0.025,
                                  width:height*0.025*0.7272,
                                  marginTop:height*0.0043,
                                  top:-1,
                                  left:0,
                                  position:'absolute',
                                }}
                          source={require('../../Image/icon_location.png')}
                        />
                    </View>



                  <Text allowFontScaling={false} style={{marginTop:width*0.005,fontSize:13,color:'#485465'}}>
                    {this.props.restaurant.addr}
                  </Text>
                 </TouchableOpacity>
              </View>

            </View>

            <TouchableOpacity onPress={this.props.openComment.bind(null,this.props.oid,
                                                      this.props.status,
                                                      this.props.order,
                                                      this.props.restaurant,
                                                      this.props.address)}>
              <View style={{flexDirection:'row',marginTop:height*0.0160}}>

                <Text allowFontScaling={false} style={{flex:1,color:'#485465',fontSize:13,fontWeight:'500'}}>
                  Total: ${this.props.order.total}
                </Text>
                <Text allowFontScaling={false} style={{flex:1,color:'#485465',fontSize:13,fontWeight:'500'}}>
                  Delivery Fee: ${this.props.order.dlexp}
                </Text>

              </View>
              <Text allowFontScaling={false} style={{color:'#485465',fontSize:13,fontWeight:'500',marginTop:height*0.008}}>
                User: {this.props.address.unit}{this.props.address.addr}
              </Text>
              {this._renderComment()}
            </TouchableOpacity>
          </View>
        </View>
      )
    }
    _renderUpdating(){
        return(
          <View style={{width:width*0.965,
                        height:width*0.965*0.6,
                        backgroundColor:'#ffffff',
                        marginTop:height*0.0135,
                        alignSelf:'center',
                        shadowColor:'#000000',
                        shadowOpacity:0.1,
                        shadowOffset:{width: 2, height: 2}
                        }}>
            <View style={{width:width*0.965,height:height*0.0045,backgroundColor:'#f68a1d',}}/>
            <View style={{flex:1,
                          paddingTop:height*0.0136,
                          paddingLeft:width*0.0386,
                          paddingRight:width*0.0386,
                          paddingBottom:height*0.0136,

                        }}>
              <View style={{flexDirection:'row'}}>
                <View style={{width:width*0.7}}>

                    <View style={{flexDirection:'row'}}>
                      <Text allowFontScaling={false} style={{fontSize:15,fontWeight:'800'}}>
                        {this.props.oid}｜Pick-up
                      </Text>
                      <Text allowFontScaling={false} style={{fontSize:11,marginTop:4,marginLeft:6,color:'#485465'}}>
                        {this.props.order.created}
                      </Text>
                    </View>
                    <TouchableOpacity onPress={this.props.openMap.bind(null,this.props.restaurant,this.props.address,'P')}>
                      <View style={{marginTop:width*0.0163,}}>
                        <Text allowFontScaling={false} style={{color:'#f68a1d',fontSize:15,fontWeight:'600',}}>
                          &nbsp;&nbsp;&nbsp; {this.props.restaurant.name}
                        </Text>
                        <Image
                            style={{height:height*0.025,
                                    width:height*0.025*0.7272,
                                    marginTop:height*0.0043,
                                    top:-1,
                                    left:0,
                                    position:'absolute',
                                  }}
                            source={require('../../Image/icon_location.png')}
                          />
                      </View>
                    <Text allowFontScaling={false} style={{marginTop:width*0.005,fontSize:13,color:'#485465'}}>
                      {this.props.restaurant.addr}
                    </Text>
                   </TouchableOpacity>
                </View>

                <View style={{flex:1}}>
                <TouchableOpacity onPress={()=>{Linking.openURL('tel:' + this.props.restaurant.tel)}}>
                  <Image
                      style={{height:height*0.035,
                              width:height*0.035*3.4627,
                              alignSelf:'center',
                            }}
                      source={require('../../Image/call_restaurant.png')}
                    />
                  </TouchableOpacity>
                </View>

              </View>

              <TouchableOpacity onPress={this.props.openComment.bind(null,this.props.oid,
                                                        this.props.status,
                                                        this.props.order,
                                                        this.props.restaurant,
                                                        this.props.address)}>
                <View style={{flexDirection:'row',marginTop:height*0.0160}}>

                  <Text allowFontScaling={false} style={{flex:1,color:'#485465',fontSize:13,fontWeight:'500'}}>
                    Total: ${this.props.order.total}
                  </Text>
                  <Text allowFontScaling={false} style={{flex:1,color:'#485465',fontSize:13,fontWeight:'500'}}>
                    Delivery Fee: ${this.props.order.dlexp}
                  </Text>

                </View>
                <Text allowFontScaling={false} style={{color:'#485465',fontSize:13,fontWeight:'500',marginTop:height*0.008}}>
                  User: {this.props.address.unit}{this.props.address.addr}
                </Text>
                {this._renderComment()}



              </TouchableOpacity>
              <View style={{justifyContent: 'flex-end',flex:1,}}>
                  <View   style={{height:height*0.04,
                            alignSelf:'center',
                            marginBottom:0,
                          }}>
                          <Text allowFontScaling={false} style={{color:'#f68a1d',fontSize:14,fontWeight:'400',}}> 订单更新中。。。  </Text>
                  </View>

              </View>

            </View>
          </View>
        )

    }
    render() {
      return (
        <View>
          {this._renderTask()}
        </View>

      )
    }
  }

const styles = StyleSheet.create({
  actionButtonText: {
    color: 'grey',
    fontSize: 12,

  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderColor: 'grey',
    borderWidth: 0.5,
    width: 130,
    paddingTop: 4,
    paddingBottom:4,
  },
  actionButtonImage: {
    marginRight: 6,
    width: 15,
    height: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  infoText: {
    flex:1,
    color:'#485465',
    fontSize:13,
    fontWeight:'500'
  },
  separatorLine: {
    borderBottomColor: 'grey',
    borderBottomWidth: 0.6,
    marginTop: 10,
  },
  mainActionButton: {
    height:height*0.04,
    width:height*0.04*3.5974,
    alignSelf:'flex-end',
    marginBottom:12,
  },
  orderDetailButtonText: {
    color: 'black',
    fontSize: 15
  },
  orderDetailButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderDetailButtonImage: {
    marginRight: 6,
    width: 18,
    height: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
});

module.exports = TaskCard;
// onPress={this.props.orderChange.bind(null,this.props.oid,'P')}
