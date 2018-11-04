import React from 'react'
import { TouchableOpacity, Text } from 'react-native'
import { Actions } from 'react-native-router-flux'

const Register = () => {
  const goLogin = () => {
    Actions.login()
  }
  return (
    <TouchableOpacity style = {{ margin: 128 }} onPress = {goLogin}>
      <Text>This is ABOUT</Text>
    </TouchableOpacity>
  )
}
export default Register