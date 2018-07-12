/* @flow */

import React, { Component } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Keyboard,
  Platform,
  View,
  Text,
  TextInput,
  StyleSheet,
} from 'react-native';
import Button from './Button';
import Auth from '../../Modules/AuthModule/Auth';
// device(size): get device height and width
const { height, width } = Dimensions.get('window');

// const(refs): define view refeneces
const USERNAME_INPUTREF = 'Username_Input';
const PASSWORD_INPUTREF = 'Password_Input';
const SUBMIT_BUTTON = 'Submit_Button';

const styles = StyleSheet.create({
    fistInput: {
        fontSize: 18,
        borderRadius: 8,
        color: '#000',
        height: 40,
        marginTop: 5,
    },
});

export default class MyComponent extends Component {
  constructor() {
      super();
      this.state = {
          viewBottom: new Animated.Value(0),
          logoOpacity: new Animated.Value(1),
          modalVisible: true,
          onFocusAnim: new Animated.Value(0),
          lineLeft: new Animated.Value(0),
          lineTop: new Animated.Value(0),
          lineWidth: new Animated.Value(0),
          viewOpacity: new Animated.Value(1),
      };
      this.onFocus = this.onFocus.bind(this);
      this._setModalVisible = this._setModalVisible.bind(this);
      this._handleSubmit = this._handleSubmit.bind(this);
      this._hideKeyboard = this._hideKeyboard.bind(this);
      this._keyboardWillShow = this._keyboardWillShow.bind(this);
      this._keyboardWillHide = this._keyboardWillHide.bind(this);
      this._doLogin = this._doLogin.bind(this);
      this._doAuth = this._doAuth.bind(this);
  }
  componentWillMount() {
      this._gestureHandlers = {
          onStartShouldSetResponder: () => {
              this._hideKeyboard();
          },
      };
      if (Platform.OS === 'ios') {
        this._keyboardWillShowSubscription = Keyboard.addListener('keyboardWillShow', (e) => this._keyboardWillShow(e));
        this._keyboardWillHideSubscription = Keyboard.addListener('keyboardWillHide', (e) => this._keyboardWillHide(e));
      } else {
        this._keyboardWillShowSubscription = Keyboard.addListener('keyboardDidShow', (e) => this._keyboardWillShow(e));
        this._keyboardWillHideSubscription = Keyboard.addListener('keyboardDidHide', (e) => this._keyboardWillHide(e));
      }
  }
  componentDidMount() {
      this._doAuth();
      setTimeout(() => {
        this.refs[SUBMIT_BUTTON].measure((ox, oy, width, Objheight, px, py) =>{

            this.submitButton = height - py - Objheight;
        })
      }, 10);

  }
  componentWillUnmount() {
    // Event(Keybaord): remove keybaord event
      this._keyboardWillShowSubscription.remove();
      this._keyboardWillHideSubscription.remove();
  }
  _keyboardWillShow(e) {
      // keyboard(e.endCoordinates.height): get keyboard height
      const keyboardHeight = e.endCoordinates.height;
      // submitButton(position): get submitButton position

          // if true, submitButton has covered by keyboard
          if(keyboardHeight>this.submitButton ){
            //View(bottom): add enough space for keyboard appear

            Animated.timing(this.state.viewBottom, {
                toValue: keyboardHeight-this.submitButton + 60,
                easing: Easing.out(Easing.quad),
                duration: 300,
            }).start()
            // View(logo): logo fadeout;
            Animated.timing(this.state.logoOpacity, {
                toValue: 0,
                easing: Easing.out(Easing.quad),
                duration: 300,
            }).start()

          }
       this.onFocus()


  }
  _keyboardWillHide(e) {
    //View(bottom): init viewBottom to default
    Animated.timing(this.state.viewBottom, {
        toValue: 0,
        easing: Easing.out(Easing.quad),
        duration: 300,
      }).start()
      Animated.timing(this.state.logoOpacity, {
          toValue: 1,
          easing: Easing.out(Easing.quad),
          duration: 300,
      }).start()
      // view(inputLine)
      Animated.sequence([
          Animated.delay(100),
          Animated.timing(this.state.lineWidth, {
              toValue: 0,
              duration: 300,
            })
      ]).start()
  }
  onFocus(){
      this.refs[USERNAME_INPUTREF].measure((ox, oy, objectWidth, objectHeight, px, py) =>{
        this.renderAnimationLine({ox,oy,objectWidth,objectHeight, px, py})
      });
  }
  renderAnimationLine({ objectWidth: lineWidth, px: lineLeft, py: py, objectHeight: objectHeight}) {
    // this.setState({
    //   lineLeft:lineLeft,
    //   lineTop: py + objectHeight,
    //   // lineWidth:lineWidth,
    // })
    // this.state.lineLeft.setValue(lineLeft);
    // this.state.lineTop.setValue(py + objectHeight);
    Animated.sequence([
      Animated.delay(100),
      Animated.timing(this.state.lineWidth, {
          toValue: lineWidth,
          duration: 300,
        })
    ]).start()
  }
  _setModalVisible(visible) {
    console.log(visible)
    this.setState({modalVisible: visible});
  }
  _hideKeyboard(){
      // keyboar(hide): hide keyboard by blur input
      this.refs[USERNAME_INPUTREF].blur()
      this.refs[PASSWORD_INPUTREF].blur()
    }
  _handleSubmit() {
    this._hideKeyboard()
    this._doLogin()
  }
  async _doLogin() {
    if(this.state.username && this.state.password){
      const loginData = {
        username:this.state.username,
        password:this.state.password,
        platform:Platform.OS,
      }
      try {
        const loginResult = await Auth.AppLogin(loginData);
        this._doAuth();
      } catch (e) {
        console.log(e);
      } finally {

      }

    }

  }
  async _doAuth() {
    try {
      const authData = {
        platform:Platform.OS,
      }
      const authResult = await Auth.doAuth(authData);
      if(authResult){
        console.log('auth SUCCESSFUL')

        // this.token = authResult.token;
        // MDWampBridge.startMDWamp(this.token);

        // setTimeout(function () {
        //   MDWampBridge.call("task_refresh",[authResult.token]);
        // }, 3000);
        Animated.timing(this.state.viewOpacity,{
            delay: 500,
            toValue: 0,
            duration: 1000, //550ms
        }).start()
        setTimeout(() => {
          this.props.hideLogin()
        }, 1500);

      }else{
        // AlertIOS.alert(
        //    '登陆失败',
        //    ''
        //   );
        // AlertIOS.alert(
        //    '登陆失败',
        //    '123'
        //   );
      }
    } catch (e) {
      console.log(e)
    }
  }

// render methond
  _renderLogo() {
      return (
        <Animated.View style={{ opacity: this.state.logoOpacity }}>
            <Text allowFontScaling={false}
                style={{ color: '#ff8b00',
                          marginTop: 30,
                          fontSize: 28,
                          fontWeight: '500',
                          alignSelf: 'flex-start' }}
            >
              ChanMao Driver
            </Text>
        </Animated.View>
      );
  }
  _renderWelcome() {
      return (
        <View>
          <Text allowFontScaling={false}
              style={{ color: '#485465',
                        marginTop: 40,
                        fontSize: 25,
                        fontWeight: '500',
                        alignSelf: 'flex-start' }}
          >
            Welcome back,
          </Text>
          <Text allowFontScaling={false}
              style={{ color: '#a4afc0',
                        marginTop: 15,
                        fontSize: 23,
                        fontWeight: '300',
                        alignSelf: 'flex-start' }}
          >
          Sign in to manage your success on the road.
          </Text>
        </View>
      );
  }
  _renderInput() {
    if (Platform.OS === 'ios') {
      return (
        <View style={{ flex: 1 }}>
          <TextInput autoCorrect={false}
              keyboardType = {'default'}
              onChangeText={(username) => {
                  this.setState({ username });
              }}
              placeholder="Username"
              ref={USERNAME_INPUTREF}
              returnKeyType={'next'}
              style={[styles.fistInput, { marginTop: 40 }]}
          />
          {this._renderInputLine()}
          <TextInput autoCorrect={false}
              keyboardType = {'default'}
              onChangeText={(password) => {
                this.setState({ password });
              }}
              placeholder="Password"
              ref={PASSWORD_INPUTREF}
              returnKeyType={'done'}
              secureTextEntry={true}
              style={styles.fistInput}
          />
          <View ref={SUBMIT_BUTTON}style={{marginTop:15}} >
            <Button   handleSubmit = {this._handleSubmit}/>
          </View>
        </View>
      );
    } else {
      return (
        <View style={{ flex: 1 }}>
          <TextInput autoCorrect={false}
              keyboardType = {'url'}
              onChangeText={(username) => {
                  this.setState({ username });
              }}
              placeholder="Username"
              ref={USERNAME_INPUTREF}
              returnKeyType={'next'}
              style={[styles.fistInput, { marginTop: 40 }]}
              underlineColorAndroid={'rgba(0,0,0,0)'}
          />
          {this._renderInputLine()}
          <TextInput autoCorrect={false}
              keyboardType = {'default'}
              onChangeText={(password) => {
                this.setState({ password });
              }}
              placeholder="Password"
              ref={PASSWORD_INPUTREF}
              returnKeyType={'next'}
              secureTextEntry={true}
              underlineColorAndroid={'rgba(0,0,0,0)'}
              style={styles.fistInput}
          />
          <View ref={SUBMIT_BUTTON}style={{marginTop:15}} renderToHardwareTextureAndroid={true}>
            <Button   handleSubmit = {this._handleSubmit}/>
          </View>
        </View>
      );
    }

  }
  _renderFotter() {
      return (
        <View style={{ position: 'absolute',
                      bottom: 5,
                      width: width,
                      alignItems: 'center' }}
        >
          <Text allowFontScaling={false}
              style={{ marginBottom: 5 }}
          >
            v1.4.0
          </Text>
          <Text allowFontScaling={false}
              style={{ fontSize: 11 }}
          >
            Chanmao Inc. All Copyrights Reserved
          </Text>
        </View>
      );
  }
  _renderInputLine() {
      return (
        <Animated.View style={{
            backgroundColor: '#ff8b00',
            height: 2,
            // left: this.state.lineLeft,
            // position: 'absolute',
            // top: this.state.lineTop,

            width: this.state.lineWidth }}
        >
        </Animated.View>
      )
  }
  render() {
      return (
        <Animated.View style={{opacity:this.state.viewOpacity,position:'absolute',left:0,top:0,right:0,bottom:0,backgroundColor:'#ffffff'}}>
            <Animated.View style={{flex:1,padding:50,bottom:this.state.viewBottom}} {...this._gestureHandlers}>
                {this._renderLogo()}
                {this._renderWelcome()}
                {this._renderInput()}
                {this._renderFotter()}

          </Animated.View>
        </Animated.View>
      );
  }
}
