/**
 * Created by uran on 07/11/2018.
 */
import React from 'react'
import { StyleSheet, View } from 'react-native'

export default class Form extends React.Component {
  componentWillMount() {
    // this.setState({
    //   inputText: '',
    // })
  }

  render() {
    return (
      <View></View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
  },
  inputWrapper: {
    marginBottom: 24,
  },
  title: {
    color: '#494949',
  },
  input: {
    height: 40,
    paddingTop: 5,
    borderBottomWidth: 1,
    borderColor: '#DBDFE3',
  },
  registerButton: {
    marginTop: 20,
    backgroundColor: '#FC5B26',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: 46,
    borderColor: '#FC5B26',
    borderWidth: 1,
    borderRadius: 50,
    padding: 14,
  },
  registerButtonText: {
    color: '#fff'
  }
});
