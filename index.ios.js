/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Text,
  View,
  Animated,
  Easing,
  Dimensions,
  Image,
  TouchableOpacity,
  StyleSheet,
  AppRegistry
} from 'react-native';

class AnimatedDemo extends Component{
  constructor(props) {
    super(props);
    // 初始状态
    this.state = {
      fadeInOpacity: new Animated.Value(0),
      rotation: new Animated.Value(0),
      fontSize: new Animated.Value(0)
    };
  }
  componentDidMount() {
    var timing = Animated.timing;
    Animated.parallel(['fadeInOpacity', 'rotation', 'fontSize'].map(property => {
      return timing(this.state[property], {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear
      });
    })).start();
  }
  render() {
    return (
      <View style={styles.container}>
        <Animated.View style={[{
                    opacity: this.state.fadeInOpacity,
                    transform:[{
                      rotateZ:this.state.rotation.interpolate({
                          inputRange: [0,1],
                          outputRange: ['0deg', '360deg']
                      })
                    }]
                }]}>
          <Animated.Text style={[styles.welcome,{fontSize: this.state.fontSize.interpolate({
          inputRange:[0,1],
          outputRange:[12,26],
          })}]}>悄悄的，我出现了</Animated.Text>
        </Animated.View>
      </View>
    );
  }
}

class AnimatedSequence extends Component{
  // 构造
    constructor(props) {
      super(props);
      // 初始状态
      this.state = {
        anim: [1,2,3].map(() => new Animated.Value(0)) // 初始化3个值
      };
    }

  componentDidMount() {
    var timing = Animated.timing;
    Animated.sequence([
      Animated.stagger(200,this.state.anim.map(left => {
        return timing(left,{
          toValue:1,
        })
      }).concat(
        this.state.anim.map(left => {
          return timing(left,{
            toValue:1,
          })
        })
      )),// 三个view滚到右边再还原，每个动作间隔200ms
      Animated.delay(400), // 延迟400ms，配合sequence使用
      timing(this.state.anim[0], {
        toValue: 1
      }),
      timing(this.state.anim[1], {
        toValue: -1
      }),
      timing(this.state.anim[2], {
        toValue: 0.5
      }),
      Animated.delay(400),
      Animated.parallel(this.state.anim.map((anim) => timing(anim, {
        toValue: 0
      }))) // 同时回到原位置
    ]).start()
  }

  render(){
    var views = this.state.anim.map(function(value, i) {
      return (
        <Animated.View
          key={i}
          style={[styles.listView,{
                    left: value.interpolate({
                        inputRange: [0,1],
                        outputRange: [0,200]
                    })
                }]}>
          <Text style={styles.text}>我是第{i + 1}个View</Text>
        </Animated.View>
      );
    });
    return <View style={styles.container}>
      {views}
    </View>;
  }
}

class AnimatedSpring extends Component{
  constructor(props: any) {
    super(props);
    this.state = {
      bounceValue: new Animated.Value(0),
    };
  }
  render(){
    return (
      <Animated.Image                         // 基础组件: Image, Text, View
        source={require('./img/AnimatedTest.jpg')}
        style={{
          flex: 1,
          transform: [                        // `transform`   有顺序的数组
            {scale: this.state.bounceValue},  // Map `bounceValue` to `scale`
          ]
        }}
      />
    );
  }
  componentDidMount() {
    this.state.bounceValue.setValue(1.5);     // 动画开始的时候 设置一个比较大的值
    Animated.spring(                          // 动画可选类型: spring, decay, timing
      this.state.bounceValue,                 // Animate `bounceValue`
      {
        toValue: 1,//Spring支持 friction与tension 或者 bounciness与speed 两种组合模式，这两种模式不能并存。
        friction:0.1,//摩擦系数，默认40
        tension:10, //张力系数，默认7
        //bounciness:10,
        //speed:10
      }
    ).start();                                // 开始执行动画
  }
}

class TrackingDynamicAnimated extends Component{

}

class reactNativeAnimated extends Component {
  // 构造
    constructor(props) {
      super(props);
      // 初始状态
      this.state = {
        showView:''
      };
    }
  renderView() {
    if(this.state.showView === 'AnimatedDemo')
    return(<AnimatedDemo/>)
    if(this.state.showView === 'AnimatedSequence')
    return(<AnimatedSequence/>)
    if(this.state.showView === 'AnimatedSpring')
      return(<AnimatedSpring/>)

  }

  render(){
    return(
      <View style={styles.container}>
        <View style={styles.btnContainer}>
          <TouchableOpacity style={styles.btn} onPress={()=>this.setState({showView:'AnimatedDemo'})}>
            <Text style={styles.btnText}>组合动画Parallel实现多个动画并行渲染</Text>
            </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={()=>this.setState({showView:'AnimatedSequence'})}>
            <Text style={styles.btnText}>组合动画Sequence,stagger,delay实现多个动画</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={()=>this.setState({showView:'AnimatedSpring'})}>
            <Text style={styles.btnText}>动画--流程控制函数AnimatedSpring</Text>
          </TouchableOpacity>
          </View>
        <View style={styles.animatedContainer}>
          {this.renderView()}
          </View>
        </View>
      )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    flexDirection:'column'
  },
  animatedContainer: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  btnContainer:{
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  btn:{
    justifyContent: 'space-around',
    margin: 5,
    alignItems: 'center',
    borderRadius: 3,
    height: 40,
    alignSelf: 'stretch',
    backgroundColor: 'gray',
    flexDirection: 'row',
  },
  btnText: {
    color: 'white',
    fontSize:14
  },
  listView:{
    backgroundColor:'#'+(~~(Math.random()*(1<<24))).toString(16)
  },
  text:{
    color:'white'
  }
});

AppRegistry.registerComponent('reactNativeAnimated', () => reactNativeAnimated);
