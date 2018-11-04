/**
 * Created by uran on 04/11/2018.
 */
import React from 'react'
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native'

export default class AppButton extends React.Component {
  render() {
    return (
      <View {...this.props.style}>
        <TouchableOpacity>
          <View style={styles.button}>
            <Text style={styles.buttonText}>{this.props.name}</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',

  },
  button: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    height: 46,
    borderColor: '#DBDFE3',
    borderWidth: 1,
    borderRadius: 50,
    padding: 14,
  },
  buttonText: {
    color: '#676767',
  }
});
