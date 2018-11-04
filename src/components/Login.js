/**
 * Created by uran on 04/11/2018.
 */
import React from 'react'
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native'
import { Actions } from 'react-native-router-flux'
import AppButton from './AppButton'

const Login = () => {
  const goToAbout = () => {
    Actions.register()
  }
  return (
    <View style={styles.container}>
      <TouchableOpacity style = {{ margin: 128 }} onPress = {goToAbout}>
        <Text>런치투게더</Text>
      </TouchableOpacity>

      <View>
        <AppButton
          name="카카오톡으로 시작하기"
          style={{ marginBottom: 14 }}
        />

        <AppButton
          name="페이스북으로 시작하기"
          style={{ marginBottom: 14 }}
        />
        <AppButton
          name="Gmail로 시작하기"
          style={{ marginBottom: 14 }}
        />
      </View>

    </View>
  )
}



const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 24,
  },
  // buttonGroup: {
  //   margin: 0,
  // }
});



export default Login