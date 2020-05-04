import React, { Component } from 'react'
import {
  View,
  Text,
  StatusBar,
  BackHandler
} from 'react-native'
import Color from '../tools/Color'
import cancellablePromise from '../tools/cancellablePromise'

class Profile extends Component {
  pendingPromises = []
  appendPendingPromise = promise => {
    this.pendingPromises = [...this.pendingPromises, promise]
  }
  removePendingPromise = promise => {
    this.pendingPromises = this.pendingPromises.filter(p => p !== promise)
  }
  constructor(props) {
    super(props)
    this.statusBar = {
      backgroundColor: Color.white,
      barStyle: 'dark-content',
      isAnimation: true,
      isTranslucent: true
    }
    this.navigation = {
      navigate: (screen, attr = {}) => {
        this.props.navigation.navigate(screen, {
          ...attr,
          setStatusBarStyle: () => {
            StatusBar.setBackgroundColor(this.statusBar.backgroundColor, this.statusBar.isAnimation)
            StatusBar.setBarStyle(this.statusBar.barStyle, this.statusBar.isAnimation)
            StatusBar.setTranslucent(this.statusBar.isTranslucent)
          },
          backHandlerPrevScreen: {
            add: () => {
              BackHandler.addEventListener('hardwareBackPress', this._backHandler)
            },
            remove: () => {
              BackHandler.removeEventListener('hardwareBackPress', this._backHandler)
            }
          }
        })
      }
    }
  }

  componentDidMount() {
    StatusBar.setBackgroundColor(this.statusBar.backgroundColor, this.statusBar.isAnimation)
    StatusBar.setBarStyle(this.statusBar.barStyle, this.statusBar.isAnimation)
    StatusBar.setTranslucent(this.statusBar.isTranslucent)
    const { route } = this.props
    const { backHandlerPrevScreen } = route.params
    if (backHandlerPrevScreen) {
      backHandlerPrevScreen.remove()
    }
    BackHandler.addEventListener('hardwareBackPress', this._backHandler)
  }

  componentWillUnmount() {
    const { route } = this.props
    const { setStatusBarStyle, backHandlerPrevScreen } = route.params
    if (setStatusBarStyle) {
      setStatusBarStyle()
    }
    if (backHandlerPrevScreen) {
      backHandlerPrevScreen.add()
    }
    this.pendingPromises.map(p => {
      this.removePendingPromise(p)
    })
    BackHandler.removeEventListener('hardwareBackPress', this._backHandler)
  }

  _backHandler = () => {
  }

  render() {
    return (
      <View>
        <Text>Hello world!</Text>
      </View>
    )
  }
}

export default Profile
