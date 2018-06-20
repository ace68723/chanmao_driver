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
} from 'react-native';

import OrderModule from '../../Modules/OrderModule/OrderModule';
const { height, width } = Dimensions.get('window');
export default class History extends Component {
  constructor(props)
  {
    super(props);

    console.log(this.props);
    this.state={
      orderHistory:{},
      iv_start:props.iv_start,
      iv_end:props.iv_end,
      driver_id:props.driver_id,
    }
    console.log(this.state);
    this._getOrderHistory=this._getOrderHistory.bind(this);
    this._renderOrderList=this._renderOrderList.bind(this);
  }
  componentDidMount()
  {

    this._getOrderHistory(this.state.iv_start,this.state.iv_end,this.state.driver_id);

  }
  async _getOrderHistory(start,end,driver_id)
  {
    try {
      const result = await OrderModule.getOrderHistory(start,end,driver_id);
      this.setState({orderHistory:result});
      console.log(result);
    } catch (e) {
      console.log(e);
    }

  }
  _renderOrderList()
  {
    let list=[];
    if (!this.state.orderHistory.orders) return;
    console.log(this.state.orderHistory.orders);
    for (let i=0;i<this.state.orderHistory.orders.length;i++)
    {
      let order=this.state.orderHistory.orders[i];
      list.push(
        <View key={i} style={{width:width*0.85,height:0.03*height,
          marginTop:6,flexDirection:'row',paddingLeft:0.075*width}}>
          <View style={{width:width*0.24,height:0.03*height,}}>
            <Text style={{fontSize:14,}}>
              {order.order_id}
            </Text>
          </View>

          <View style={{width:width*0.28,height:0.03*height,}}>
            <Text style={{fontSize:14,}}>
              {order.payment_option? 'cash':'online'}
            </Text>
          </View>
          <View style={{width:width*0.33,height:0.03*height}}>
            <Text style={{fontSize:14,}}>
              ${order.total}(${order.deliver_fee})
            </Text>
          </View>
        </View>
      )
    }
    return list;
  }
  render() {
    const starList = () => {
      let _starList = [];
      let list = [1, 2, 3, 4, 5];
      for (let i of list.splice(0, 4)) {
        _starList.push(
          <TouchableOpacity key={i} onPress={() => this._handleDriverScore(i)}>
            <Image style={{width:35,height:35}}source={require('./../../Image/yellow_star.png')}/>
          </TouchableOpacity>
        )
      }
      for (let i of list.splice(0, 5)) {
        _starList.push(
          <TouchableOpacity key={i} onPress={() => this._handleDriverScore(i)}>
            <Image style={{width:35,height:35}}source={require('./../../Image/grey_star.png')}/>
          </TouchableOpacity>
        )
      }
      return _starList;
    };


    return (
      <View style={styles.container}>
        <View style={{
          backgroundColor:'white',
          height:height*0.1,
          width:width,
          flexDirection:'row',
          alignItems:'center',
        }}>
          <TouchableOpacity>
              <Image style={{
                                      marginLeft:width*0.03,
                                      height:height*0.0335,
                                      width:width*0.2066,
                                      }}
                                     source={require('../../Image/offline.png')}>
              </Image>


          </TouchableOpacity>
          <View style={{
            width:0.5*width,
            height:height*0.1,
            alignItems:'center',
            justifyContent:'center',
          }}>
            <Text style={{fontSize:20}}>
              HISTORY
            </Text>
          </View>
        </View>
        <View style={{flex:1,backgroundColor:'#EFEFEF',alignItems:'center'}}>
          <View style={{
            marginTop:0.03*height,
            width:0.85*width,
            height:height*0.13,
            backgroundColor:'white',
            borderRadius:8,
            alignItems:'center',
          }}>
            <View style={{
              width:0.85*width,
              height:height*0.09,
              backgroundColor:'white',
              borderRadius:8,
              alignItems:'center',
              flexDirection:'row',
            }}>
              <View style={{height:0.09*height,width:0.17*width,alignItems:'center',justifyContent:'center'}}>
                <Text style={{fontSize:14}}>
                  Rating
                </Text>
              </View>
              <View style={{height:0.09*height,width:0.51*width,flexDirection:'row',alignItems:'center',}}>
               {starList()}
              </View>
              <View style={{height:0.09*height,width:0.17*width,alignItems:'center',justifyContent:'center'}}>
                <Text style={{fontSize:14}}>
                  4.0
                </Text>
              </View>

            </View>

            <View style={{
              height:0.03*height,width:0.85*width,alignItems:'center',justifyContent:'center'
            }}>

            </View>

          </View>
          <TouchableOpacity>
            <View style={{width:0.85*width,height:0.06*height,
              alignItems:'center',
              flexDirection:'row',
            }}>
              <Text style={{marginLeft:0.2*width,fontSize:16}}>
                Today 03-20-2018
              </Text>
              <Image style={{marginLeft:0.22*width,width:0.06*width,height:0.06*width}}
                source={require('./../../Image/angle-arrow-down.png')}
              />

            </View>

          </TouchableOpacity>
          <View style={{
            marginTop:0.003*width,
            width:width,
            height:0.23*height,
            flexDirection:'row',
            alignItems:'center',
          }}>
            <View style={{
              width:0.4*width,
              height:0.2*height,
              backgroundColor:'white',
              marginLeft:0.06*width,
              borderWidth:2,
              borderStyle:'dashed',
               borderRadius:1,
              borderColor:'#798BA5',
              alignItems:'center',
            }}>

              <View style={{marginTop:0.01*height,width:0.35*width,height:0.03*height,justifyContent:'center',alignItems:'center'}}>
                <Text style={{fontSize:13,fontWeight:'bold',}}>
                  Cash
                </Text>
              </View>

              <View style={{flexDirection:'row',marginTop:0.01*height,width:0.35*width,height:0.03*height,justifyContent:'center'}}>
                <View style={{alignItems:'flex-start',height:0.03*height,width:0.2*width}}>
                  <Text style={{fontSize:13,}}>
                    orders
                  </Text>

                </View>
                <View style={{alignItems:'flex-end',height:0.03*height,width:0.15*width}}>
                  <Text style={{fontSize:13,color:'#eb7b21',}}>
                    {this.state.orderHistory.cash_num}
                  </Text>

                </View>
              </View>

              <View style={{flexDirection:'row',marginTop:0.01*height,width:0.35*width,height:0.03*height,justifyContent:'center'}}>
                <View style={{alignItems:'flex-start',height:0.03*height,width:0.2*width}}>
                  <Text style={{fontSize:13,}}>
                    Total
                  </Text>

                </View>
                <View style={{alignItems:'flex-end',height:0.03*height,width:0.15*width}}>
                  <Text style={{fontSize:13,color:'#eb7b21',}}>
                    ${this.state.orderHistory.cash_total}
                  </Text>

                </View>
              </View>

              <View style={{flexDirection:'row',marginTop:0.01*height,width:0.35*width,height:0.03*height,justifyContent:'center'}}>
                <View style={{alignItems:'flex-start',height:0.03*height,width:0.2*width}}>
                  <Text style={{fontSize:13,}}>
                    Delivery Fee
                  </Text>

                </View>
                <View style={{alignItems:'flex-end',height:0.03*height,width:0.15*width}}>
                  <Text style={{fontSize:13,color:'#eb7b21',}}>
                    ${this.state.orderHistory.cash_total_deliver_fee}
                  </Text>

                </View>


              </View>

            </View>
            <View style={{
              width:0.4*width,
              height:0.2*height,
              backgroundColor:'white',
              marginLeft:0.06*width,
              borderWidth:2,
              borderStyle:'dashed',
               borderRadius:1,
              borderColor:'#798BA5',
              alignItems:'center',
            }}>
              <View style={{marginTop:0.01*height,width:0.35*width,height:0.03*height,justifyContent:'center',alignItems:'center'}}>
                <Text style={{fontSize:13,fontWeight:'bold',}}>
                  Online Paid
                </Text>
              </View>

              <View style={{flexDirection:'row',marginTop:0.01*height,width:0.35*width,height:0.03*height,justifyContent:'center'}}>
                <View style={{alignItems:'flex-start',height:0.03*height,width:0.2*width}}>
                  <Text style={{fontSize:13,}}>
                    orders
                  </Text>

                </View>
                <View style={{alignItems:'flex-end',height:0.03*height,width:0.15*width}}>
                  <Text style={{fontSize:13,color:'#eb7b21',}}>
                    {this.state.orderHistory.online_num}
                  </Text>

                </View>
              </View>

              <View style={{flexDirection:'row',marginTop:0.01*height,width:0.35*width,height:0.03*height,justifyContent:'center'}}>
                <View style={{alignItems:'flex-start',height:0.03*height,width:0.2*width}}>
                  <Text style={{fontSize:13,}}>
                    Total
                  </Text>

                </View>
                <View style={{alignItems:'flex-end',height:0.03*height,width:0.15*width}}>
                  <Text style={{fontSize:13,color:'#eb7b21',}}>
                    ${this.state.orderHistory.online_total}
                  </Text>

                </View>
              </View>

              <View style={{flexDirection:'row',marginTop:0.01*height,width:0.35*width,height:0.03*height,justifyContent:'center'}}>
                <View style={{alignItems:'flex-start',height:0.03*height,width:0.2*width}}>
                  <Text style={{fontSize:13,}}>
                    Tips
                  </Text>

                </View>
                <View style={{alignItems:'flex-end',height:0.03*height,width:0.15*width}}>
                  <Text style={{fontSize:13,color:'#eb7b21',}}>
                    ${this.state.orderHistory.online_tips}
                  </Text>

                </View>


              </View>

            </View>



          </View>

          <View style={{
            marginTop:5,
            width:0.85*width,
            height:0.05*height,
            justifyContent:'center',
          }}>
            <Text style={{fontSize:16}}>
              Total Delivery Fee
                <Text style={{fontSize:16,color:'rgba(0,0,0,0)'}}>
                  —
                </Text>
                <Text style={{fontSize:16,color:'#eb7b21'}}>
                  ${this.state.orderHistory.total_deliver_fee}
                </Text>
            </Text>
          </View>

        <View style={{backgroundColor:'white',width:width,height:0.03*height,justifyContent:'center',}}>
          <Text style={{fontSize:14,fontWeight:'bold',paddingLeft:0.075*width}}>
            Order No.       Method(tips)      Total(Delivery Fee)
          </Text>
        </View>

        <View style={{backgroundColor:'white',marginTop:10,
        width:width,height:0.2*height,}}>
          <ScrollView style={{flex:1}}>
            {this._renderOrderList()}

          </ScrollView>
        </View>

        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
