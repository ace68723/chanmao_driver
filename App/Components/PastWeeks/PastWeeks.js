/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';

const { height, width } = Dimensions.get('window');
export default class PastWeeks extends Component {
  constructor(props)
  {
    super(props);
    let today = new Date();
    this.state = {
      date:today,
      date1:today-7
    }
  }
  render() {
    var periods = [];

    let current= this.state.date;
  	for(let i = 0; i < 72; i++){
      let last=new Date(current.getTime()-(60*60*24*7*1000));
      let timePeriod=last.getFullYear()+'-'+(last.getMonth()+1)+'-'+last.getDate()+' ~ '+current.getFullYear()+'-'+(current.getMonth()+1)+'-'+current.getDate();
      periods.push(
  			<View key = {i}>
          <TouchableOpacity>
          <View style={{width:width,height:height*0.1,justifyContent:'center',flexDirection:'row',borderBottomWidth:1,borderBottomColor:'#9b9b9b'}} >
            <View style={{width:width*0.6,height:height*0.1,justifyContent:'center'}}>
              <Text style={{fontSize:16,marginLeft:5,}} >
                {timePeriod}
              </Text>
            </View>
            <View style={{width:width*0.2,height:height*0.1,justifyContent:'center', }}>
              <Text style={{fontSize:16,textAlign:'right'}} >
                $0.00
              </Text>
            </View>
            <View style={{width:width*0.2,height:height*0.1,justifyContent:'center', alignItems:'center', }}>
              <Image style={{height:height*0.03,width:height*0.018}}
                source={require('../../Image/button_period.png')}
              />
            </View>
          </View>

          </TouchableOpacity>
  			</View>
  		)
      // console.log(current+' ~ '+last);
      // console.log(current.getFullYear())
      current=last;
  	}

    return (
      <ScrollView style={styles.container}>
        {periods}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
