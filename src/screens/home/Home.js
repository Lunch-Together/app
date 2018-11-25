/**
 * Created by uran on 07/11/2018.
 */
import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import AppButton from '../../components/button/AppButton'
import { Actions } from "react-native-router-flux";

export default class Home extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Image source={require('../../img/img_qr.png')}/>
        </View>
        <View style={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={styles.title}>QR 코드를 찍어</Text>
          <Text style={styles.sub}>현재 매장의 메뉴를 확인해보세요!</Text>

          <AppButton
            onPress={this.goOrder.bind(this)}
            name="카메라 실행"
            type={'orange'}
            style={{ width: 180, marginTop: 50 }}
          />

        </View>

      </View>
    )
  }

  async goOrder() {
    // TODO 여기는 구현 되어야함
    Actions.reset('order')
  }
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
