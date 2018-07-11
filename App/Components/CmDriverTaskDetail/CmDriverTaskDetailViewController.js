'use strict';
import React, {
	Component,
} from 'react';
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
import HistoryOrderDetail from './HistoryOrderDetail';


import CmDriverTaskDetailAction from '../../Actions/CmDriverTaskDetailAction';
import CmDriverTaskDetailStore from '../../Stores/CmDriverTaskDetailStore';


export default class TaskDetailViewController extends Component {
  constructor() {
    super();
		this.state = Object.assign({},CmDriverTaskDetailStore.getState(),{
			scrollY: new Animated.Value(0),
			shouldBindScroll:false,
		});
    this._onChange = this._onChange.bind(this);
  }
	componentDidMount() {
    CmDriverTaskDetailStore.addChangeListener(this._onChange);
		this.openComment();
		//
		CmDriverTaskDetailAction.getTaskDetailAction({oid: this.props.oid});
		setTimeout(() => {
      this.setState({
				shouldBindScroll:true,
			})
		}, 500);
	}
  componentWillMount() {
    this._gestureHandlers = {
      onResponderRelease: ()=>{
        if(this.state.scrollY._value < -80){
          this.setState({
            shouldBindScroll:false
          })


            this._width = new Animated.Value(width*0.965-80);
            this._left = new Animated.Value(width*0.0175+40);
            // this._top = new Animated.Value(30);
            this.closeComment()
            const close = this.props.close;
            setTimeout(function () {
              close()
            }, 200);

        }
      },

    }
    CmDriverTaskDetailStore.removeChangeListener(this._onChange);
  }
  _onChange() {
    const state = Object.assign({},CmDriverTaskDetailStore.getState());
    this.setState(state);
    setTimeout(() => {
      this.setState({loading:false})
    }, 500);
  }
	_height = new Animated.Value(height*0.5);
	_width = new Animated.Value(width*0.5);
	_left = new Animated.Value(width*0.25);
	_opacity = new Animated.Value(0.4);
	_top = new Animated.Value(height*0.4);
	openComment(){
		Animated.parallel([
				Animated.timing(this._height, {
						toValue: height*0.87,
						duration: 200,
				}),
				Animated.timing(this._width, {
						toValue: width*0.965,
						duration: 200,
				}),
				Animated.timing(this._left, {
						toValue: width*0.0175,
						duration: 200,
				}),
				Animated.timing(this._opacity, {
						toValue: 1,
						duration: 200,
				}),
				Animated.timing(this._top, {
						toValue: 0,
						duration: 200,
				})
		]).start()
	}
	closeComment(){
		Animated.parallel([
				Animated.timing(this._height, {
						toValue: height*0.5,
						duration: 400,
				}),
				Animated.timing(this._width, {
						toValue: width*0.5,
						duration: 400,
				}),
				Animated.timing(this._left, {
						toValue: width*0.25,
						duration: 400,
				}),
				Animated.timing(this._opacity, {
						toValue: 0,
						duration: 400,
				}),
				Animated.timing(this._top, {
						toValue: height*0.4,
						duration: 400,
				})
		]).start()
	}




	_getWidth(){
		if(!this.state.shouldBindScroll){
			return this._width
		}else{
			const viewWidth = this.state.scrollY.interpolate({
				inputRange: [-80, 0],
				outputRange: [ width*0.965-80,width*0.965],
				extrapolate: 'clamp',
			});
			return viewWidth
		}

	}
	_getLeft(){
		if(!this.state.shouldBindScroll){
			return this._left
		}else{
			const viewLeft = this.state.scrollY.interpolate({
				inputRange: [-80, 0],
				outputRange: [ width*0.0175+40,width*0.0175],
				extrapolate: 'clamp',
			});
			return viewLeft
		}

	}
	_scrollEventBind(ref){
		return(
			Animated.event(
					[{nativeEvent: {contentOffset: {y: this.state.scrollY}}}]
				)
		)
	}




  render() {
    return(
			<ScrollView
					ref={'_scrollVew'}
					style={{
							position:'absolute',
							top:0,
							left:0,
							right:0,
							bottom:0

					}}
					scrollEventThrottle={16}
					onScroll={this._scrollEventBind()}
					{...this._gestureHandlers}>
				<Animated.View style={{
											marginTop:height*0.0135,
											position:'absolute',
											height:this._height,
											width:this._getWidth(),
											left:this._getLeft(),
											opacity:this._opacity,
											top:this._top,
											backgroundColor:'#ffffff',
											paddingRight:20,
											paddingLeft:20,
											shadowColor:'#000000',
											shadowOpacity:0.1,
											shadowOffset:{width: 2, height: 2}
										}}
											>
						<HistoryOrderDetail
							loading ={this.state.loading}
							items = {this.state.items}
							created = {this.state.created}
							name = {this.state.name}
							total = {this.state.total}
							oid = {this.state.oid}
							user_name = {this.state.user_name}
							user_addr = {this.state.user_addr}
							comment = {this.state.comment}
              payment_channel = {this.state.payment_channel}
						/>

				</Animated.View>
			</ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  viewController:{
    flex:1,
  }
});
