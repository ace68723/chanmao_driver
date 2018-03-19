import {default as React,Component} from 'react';
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from '../../../fontConfig.json';
const Icon = createIconSetFromIcoMoon(icoMoonConfig);
export default (props) =>{

  let backIcon;
  if(props.leftButtonText){
     backIcon = props.leftButtonText;
  }else{
     backIcon = '<';
  }
  const leftButton = () => {
    if(props.goBack){
      return (
        <TouchableOpacity style={{flex:0.2,}}
                          onPress={props.goBack}>
          <View style={styles.backButton}>
            <Icon name="cm-close" size={30} color="#000000" />
          </View>
        </TouchableOpacity>
      )
    }else{
      return(
        <View style={{flex:0.2}}>
        </View>
      )

    }
  }
  const rightButton = () => {
    if(props.rightButton){
      return (
          <TouchableOpacity style={{flex:0.2,}}
                            onPress={props.rightButton}>
            <View style={styles.rightButton}>
              <Text style={styles.rightButtonText}>
                  {props.rightButtonText}
              </Text>
            </View>
          </TouchableOpacity>
      )
    }else{
      return(
        <View style={{flex:0.2}}>
        </View>
      )

    }
  }

  return (
    <View style={styles.container}>
      <View style={{  flexDirection:'row',flex:1,alignItems: 'center',}}>
        {leftButton()}
        <View style={styles.titleView}>
          <Text style={styles.title}numberOfLines={1}>
            {props.title}
          </Text>
        </View>
        {rightButton()}
      </View>
      <View style={{height:0.5,backgroundColor:'#b3b3b8'}}/>
    </View>
    )
}
const styles = StyleSheet.create({
  container:{
    position:'absolute',
    top:0,
    left:0,
    right:0,
    height:64,
    backgroundColor:'#f4f4f4',
  },
  backButton:{
    marginLeft:10,
    marginTop:10,
  },
  backIcon:{
    fontSize:30,
    color:'#363646',
  },
  titleView:{
    flex:1,
  },
  rightButton:{
    marginTop:10,
    marginRight:10,
    height:30,
    alignSelf:'flex-end',
    alignItems:'center',
    justifyContent:'center',
    borderColor:'#363646',
    borderWidth:1,
    borderRadius:8,
    paddingLeft:5,
    paddingRight:5,
  },
  rightButtonText:{
    fontSize:16,
    color:'#363646',
  },
  TagBox:{
    marginLeft:8,
    marginRight:8,
    marginTop: 2,
    marginBottom: 2,
  },

  TagText:{
    fontSize:14,
  },
  blueBorder:{
    borderColor:'#979797',
  },

  blue:{
    color:'#8bc1c1',
  },
  iconSubmit:{
    width: 22,
    height: 22,
    marginRight:5,
  },
  title:{
    marginTop:10,
    color:'#363646',
    fontSize:20,
    fontWeight:'bold',
    textAlign:'center',
    fontFamily:'FZZongYi-M05S',
  },
})
