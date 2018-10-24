/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import OrderModule from '../../Modules/OrderModule/OrderModule';
const { height, width } = Dimensions.get('window');
export default class OrderDetail extends Component {

  constructor(props)
  {
    super(props);
    this._getOrderDetail=this._getOrderDetail.bind(this);
    this._getOrderHistory=this._getOrderHistory.bind(this);
    this._renderItemList=this._renderItemList.bind(this);
    this.state={
      itemList:[]
    }
  }
  async componentDidMount()
  {

    const result=await this._getOrderDetail(531315);
    this.setState({itemList:result.order_items});

  }
  async _getOrderHistory(start,end,driver_id)
  {
    const result=await OrderModule.getOrderHistory(start,end,driver_id);


  }
  async _getOrderDetail(oid)
  {
    const result=await OrderModule.getOrderDetail(oid);
    return result;
  }
  _renderItemList()
  {
      const result=this.state.itemList;
      let list=result;

      var _items=[];
      for (var i=0;i<list.length;i++)
      {
        _items.push(
          <View key={i} style={{width:width*0.9,height:height*0.05,}}>
            <View style={{flex:1,flexDirection:'row'}}>
              <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                <Text style={{fontSize:13,color:'#6D6E71',fontFamily:'FZZhunYuan-M02S'}}>
                  {list[i].ds_name}
                </Text>
              </View>
              <View style={{flex:2,justifyContent:'center',}}>
                <Text style={{fontSize:13,textAlign:'right',color:'#6D6E71',fontFamily:'FZZhunYuan-M02S'}}>
                  *{list[i].ds_amount}
                </Text>
              </View>
              <View style={{flex:1,justifyContent:'center',}}>
                <Text style={{fontSize:13,textAlign:'right',color:'#6D6E71',fontFamily:'FZZhunYuan-M02S'}}>
                  ${list[i].ds_price}
                </Text>
              </View>
            </View>
          </View>
        )
        let topping=list[i].ds_topping;
        for (var j=0;j<topping.length;j++)
        {
          if (topping[j].tp_name)
          {
            _items.push(
              <View style={{width:width*0.9,height:height*0.03,}}>
                <View style={{flex:1,flexDirection:'row'}}>
                  <View style={{flex:1,alignItems:'center',justifyContent:'center',}}>
                    <Text style={{fontSize:13,color:'#6D6E71',fontFamily:'FZZhunYuan-M02S'}}>
                      {topping[j].tp_name}
                    </Text>
                  </View>
                  <View style={{flex:2,justifyContent:'center',}}>

                  </View>
                  <View style={{flex:1,justifyContent:'center',}}>

                  </View>
                </View>
              </View>
            )
          }
        }
      }
      return _items;
  }
  render() {


    if(!this.state.itemList) return;
    return (
      <View style={styles.container}>
        <View style={{
          backgroundColor:'white',
          height:height*0.1,
          width:width,
          alignItems:'center',

        }}>
          <View style={{flex:1,flexDirection:'row'}}>
            <View style={{flex:1,justifyContent:'center'}}>
              <TouchableOpacity>
                  <Image style={{
                                          marginLeft:width*0.03,
                                          height:height*0.03,
                                          width:width*0.03,
                                          }}
                                         source={require('../../Image/keyboard-right-arrow-button.png')}>
                  </Image>


              </TouchableOpacity>
            </View>
            <View style={{flex:2,alignItems:'center',justifyContent:'center',}}>
              <Text style={{fontSize:20,fontWeight:'bold',fontFamily:'FZZhunYuan-M02S'}}>
                Orders
              </Text>
            </View>
            <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
              <Text style={{fontSize:15,color:'#798BA5',fontFamily:'FZZhunYuan-M02S'}}>
                Doing
              </Text>
              <View style={{borderRadius:8,backgroundColor:'#798BA5',
              alignItems:'center',justifyContent:'center',marginLeft:10,height:width*0.05,width:width*0.06}}>
                <Text style={{color:'white',fontFamily:'FZZhunYuan-M02S'}}>
                  2
                </Text>
              </View>
            </View>


          </View>
        </View>
        <View style={{flex:1,backgroundColor:'#EFEFEF',alignItems:'center'}}>
          <View style={{width:width*0.97,height:height*0.6,backgroundColor:'white',marginTop:0.05*height,
          borderTopWidth:5,borderTopColor:'#eb7b21'}}>

              <View style={{width:width*0.97,height:height*0.05,justifyContent:'center',}}>
                <Text style={{fontWeight:'bold',marginLeft:5,fontSize:16,fontFamily:'FZZhunYuan-M02S'}}>
                  1510322|Pick-up
                </Text>
              </View>
              <View style={{width:width*0.97,height:height*0.05,justifyContent:'center',}}>
                <Text style={{color:'#eb7b21',marginLeft:5,fontSize:16,fontFamily:'FZZhunYuan-M02S'}}>
                  大槐树 （Richmood Hill）
                </Text>
              </View>
              <View style={{width:width*0.97,height:height*0.05,justifyContent:'center',}}>
                <Text style={{marginLeft:5,fontSize:15,fontWeight:'bold',fontFamily:'FZZhunYuan-M02S'}}>
                  Order Detail
                </Text>
              </View>
              <View style={{borderTopWidth:1,borderTopColor:'#6D6E71',width:0.95*width,marginTop:10,height:10,}}>
              </View>
              <View style={{width:width*0.97,height:height*0.27,alignItems:'center',}}>

                {this._renderItemList()}


              </View>


              <View style={{borderTopWidth:1,borderTopColor:'#6D6E71',width:0.95*width,marginTop:10,height:6,}}>
              </View>
              <View style={{height:height*0.05,width:0.94*width,marginLeft:0.01*width}}>
                <View style={{flex:1,flexDirection:'row',}}>
                  <View style={{flex:1,justifyContent:'center'}}>
                    <Text style={{fontFamily:'FZZhunYuan-M02S'}}>
                      Total: $151.33
                    </Text>
                  </View>
                  <View style={{flex:1,justifyContent:'center'}}>
                    <Text style={{fontFamily:'FZZhunYuan-M02S'}}>
                      Delivery Fee: $1.99
                    </Text>
                  </View>
                </View>
              </View>
              <View style={{height:height*0.05,width:0.94*width,marginLeft:0.01*width,justifyContent:'center',}}>
                <Text style={{fontFamily:'FZZhunYuan-M02S'}}>
                  Comment: 走葱
                </Text>
              </View>


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
