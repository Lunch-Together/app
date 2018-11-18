/**
 * Created by uran on 07/11/2018.
 */
import React from 'react'
import { Text, TouchableOpacity, View, Image, StyleSheet } from 'react-native'
import { Actions } from 'react-native-router-flux'
import AppButton from './AppButton'
import TextButton from './TextButton'

const Home = () => {
  const goOrder = () => {
    Actions.order()
  }

  return (
    <View style={styles.container}>
      <View style={{flexGrow: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Image source={require('../img/img_qr.png') } />
      </View>
      <View style={{flexGrow: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text style={styles.title}>QR 코드를 찍어</Text>
        <Text style={styles.sub}>현재 매장의 메뉴를 확인해보세요!</Text>

        <AppButton
          name="카메라 실행"
          type={'orange'}
          style={{width: 180, marginTop: 50}}
        />

      </View>

    </View>
  )
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
  },
  title: {
    color: '#494949',
    fontSize: 18,
    fontWeight: 'bold',
  },
  sub: {
    color: '#494949',
    fontSize: 15,
    marginTop: 5,
  }
});



export default Home