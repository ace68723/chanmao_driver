'use strict';

import React, {
	Component,
} from 'react';
import {
  Animated,
  Image,
  StyleSheet,
  WebView,
  Text,
  View
} from 'react-native';
import Header from '../General/Header';

const AnimatedWebView = Animated.createAnimatedComponent(WebView);

class ArticleDetail extends Component {
  constructor(props){
    super(props);
    this.state={
      url:this.props.url,
      showLoading:true,
      showWebView:new Animated.Value(0),
    }
    this._startShowWebView = this._startShowWebView.bind(this);
    this._goBack = this._goBack.bind(this);
  }
  _startShowWebView(){
    Animated.timing(this.state.showWebView, {
      toValue: 1,
      duration: 300,
    }).start();
    const hideLoading = () => {
      this.setState({
        showLoading:false,
      })
    }
    setTimeout(function () {
      hideLoading()
    }, 400);
  }

  _goBack(){
    this.props.navigator.pop();
		//for hide launch ad View
		if(this.props.unmount){
			setTimeout( ()=> {
				this.props.unmount()
			}, 500);
		}
  }
  render() {
    let loading = () =>{
      if(this.state.showLoading){
        return(
          <Animated.View style={{position:'absolute',
                                 top:150,
                                 left:0,
                                 right:0,
                                 opacity:this.state.showWebView.interpolate({
                                                             inputRange: [0, 1],
                                                             outputRange: [1,0],
                                                           }),}}>
            <Image style={{flex:1,
                           width:100,
                           height:100,
                           alignSelf:'center'}}
                   source={require('./Image/theSixS200.gif')} />
          </Animated.View>

        )
      }
    }
    return (
      <View style={styles.container} >
        <Header goBack={this._goBack}
								leftButtonText={'x'}/>
        <View style={{flex:1,marginTop:64,}}>
          <AnimatedWebView style={[
                      styles.WebView,
                      {opacity:this.state.showWebView.interpolate({
                                                  inputRange: [0, 1],
                                                  outputRange: [0,1],
                                                }),},
                    ]}
                    source={{uri:this.state.url}}
                    onLoadEnd={()=>{this._startShowWebView()}}/>
            {loading()}
        </View>

     </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#f3f3f3',
  },
  WebView:{
    flex:1,
  }
});

module.exports = ArticleDetail;
