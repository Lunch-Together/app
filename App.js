import React from 'react';
import { AppRegistry, View } from 'react-native';
import Routes from './Routes.js'


class App extends React.Component {
  render() {
    return (
        <Routes />
    );
  }
}

export default App
AppRegistry.registerComponent('App', () => App)



// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   // button: {
//   //   borderRadius: 5,
//   //   borderWidth: 0.5,
//   //   borderColor: '#d6d7da',
//   // }
// });
