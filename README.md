## Define and color tool
```javascript
const Color = {
  theme: '#01a185',
  primary: '#394dbd',
  info: '#24b4ce',
  default: '#797979',
  success: '#2c9e6d',
  warning: '#ff9510',
  danger: '#d23454',
  black: '#000',
  textColor: '#212529',
  textMuted: '#868e96',
  grayDarker: '#5e5e5e',
  grayDark: '#a5a5a5',
  gray: '#d4d4d4',
  grayLight: '#e8e8e8',
  grayLighter: '#f5f5f5',
  borderColor: '#eee',
  white: '#fff'
}

export default Color

export function colorYiq(hex) {
  var r = parseInt(hex.substr(1, 2), 16),
      g = parseInt(hex.substr(3, 2), 16),
      b = parseInt(hex.substr(5, 2), 16),
      yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return (yiq >= 196) ? Color.textColor : Color.white;
}
```
## Cancellable promise
```javascript
const cancellablePromise = (promise) => {
  let hasCanceled_ = false

  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then((val) =>
      hasCanceled_ ? reject({isCanceled: true}) : resolve(val)
    )
    promise.catch((error) =>
      hasCanceled_ ? reject({isCanceled: true}) : reject(error)
    )
  })

  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled_ = true;
    },
  }
}

export default cancellablePromise
```
## React Native component structure
```javascript
import React, { Component } from 'react'
import {
  View,
  Text,
  StatusBar,
  BackHandler
} from 'react-native'
import Color from '../tools/Color'
import cancellablePromise from '../tools/cancellablePromise'

class App extends Component {
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
      ...this.props.navigation,
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
    if(route.params) {
      const { backHandlerPrevScreen } = route.params
      if (backHandlerPrevScreen) {
        backHandlerPrevScreen.remove()
      }
    }
    BackHandler.addEventListener('hardwareBackPress', this._backHandler)
  }

  componentWillUnmount() {
    const { route } = this.props
    if(route.params) {
      const { setStatusBarStyle, backHandlerPrevScreen } = route.params
      if (setStatusBarStyle) {
        setStatusBarStyle()
      }
      if (backHandlerPrevScreen) {
        backHandlerPrevScreen.add()
      }
    }
    this.pendingPromises.map(p => {
      this.removePendingPromise(p)
    })
    BackHandler.removeEventListener('hardwareBackPress', this._backHandler)
  }

  _backHandler = () => {
    return false
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Hello world!</Text>
      </View>
    )
  }
}

export default App
```
