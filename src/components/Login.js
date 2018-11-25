/**
 * Created by uran on 04/11/2018.
 */
import React from 'react'
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Actions } from 'react-native-router-flux'
import AppButton from './AppButton'
import TextButton from './TextButton'

const Login = () => {
  const goToRegister = () => {
    Actions.register()
  };
  return (
    <View style={styles.container}>
      <View style={{ flexGrow: 3, alignItems: 'center', justifyContent: 'center' }}>
        <Image source={require('../img/img_main_logo.png')}/>
      </View>

      <View style={{ flexGrow: 1, justifyContent: 'flex-end' }}>
        <View>
          <TouchableOpacity onPress={() => Alert.alert('경고창입니다')}>
            <Text>눌러라</Text>
          </TouchableOpacity>
        </View>
        <View>
          <AppButton
            name="카카오톡으로 시작하기"
            icon={require('../img/ic_kako.png')}
            style={{ marginBottom: 7 }}/>

          <AppButton
            name="페이스북으로 시작하기"
            icon={require('../img/ic_facebook.png')}
            style={{ marginBottom: 7 }}/>
          <AppButton
            name="Gmail로 시작하기"
            icon={require('../img/ic_google.png')}
            style={{ marginBottom: 7 }}/>
        </View>

        <View>
          <View style={{ height: 50, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <TextButton
              name="이메일 로그인"
              style={{
                paddingRight: 7,
                borderRightWidth: 2,
                borderColor: '#E9E9E9',
              }}/>

            <TextButton
              name="비밀번호 찾기"
              style={{
                paddingRight: 7,
                borderRightWidth: 2,
                borderColor: '#E9E9E9',
              }}/>
            <TextButton name="회원가입" onPress={goToRegister}/>
          </View>
        </View>
      </View>

    </View>
  )
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
  },
});


export default Login
