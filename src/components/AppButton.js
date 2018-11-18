/**
 * Created by uran on 04/11/2018.
 */
import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export default class AppButton extends React.Component {
  render() {
    return (
      <View {...this.props.style}>
        <TouchableOpacity activeOpacity={0.6} onPress={this.props.onPress}>
          <View style={this.props.type === 'orange' ? styles.orangeBtn : styles.whiteBtn}>
            <Image soruce={this.props.icon}/>
            <Text
              style={this.props.type === 'orange' ? styles.orangeBtnText : styles.whiteBtnText}>{this.props.name}</Text>
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
  orangeBtn: {
    backgroundColor: '#FC5B26',
    justifyContent: 'center',
    alignItems: 'center',
    height: 46,
    borderColor: '#FC5B26',
    borderWidth: 1,
    borderRadius: 50,
    padding: 14,
  },

  orangeBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  whiteBtn: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    height: 46,
    borderColor: '#DBDFE3',
    borderWidth: 1,
    borderRadius: 50,
    padding: 14,
  },
  whiteBtnText: {
    color: '#676767',
  }
});
