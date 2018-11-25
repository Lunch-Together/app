/**
 * Created by uran on 04/11/2018.
 */
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export default class TextButton extends React.Component {
  render() {
    return (
      <View {...this.props.style} style={styles.container}>
        <TouchableOpacity onPress={this.props.onPress} activeOpacity={0.6}>
          <View>
            <Text style={{ color: '#ABAEB6' }}>{this.props.name}</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 7,
    alignItems: 'center'

  },
});
