/**
 * Created by uran on 04/11/2018.
 */
import React from 'react'
import { Text, TouchableOpacity, View, Image, StyleSheet } from 'react-native'

export default class AppButton extends React.Component {
  render() {
    return (
      <View {...this.props.style}>
        <TouchableOpacity activeOpacity="0.6">
          <View style={this.props.type === 'orange' ? styles.orangeBtn : styles.whiteButton}>
            <Image soruce={this.props.icon}/>
            <Text style={this.props.type === 'orange' ? styles.orangeBtnText : styles.whiteButtonText}>{this.props.name}</Text>
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

  whiteButton: {
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
  whiteButtonText: {
    color: '#676767',
  }
});
