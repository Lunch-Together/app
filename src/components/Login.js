/**
 * 이메일 로그인, 소셜 로그인, 회원가입 등의 작업을 할 수 있는 페이지
 */
import React from 'react'
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import AppButton from './AppButton'
import TextButton from './TextButton'
import { Actions } from "react-native-router-flux";
import { SecureStore } from 'expo'

export default class Login extends React.Component {

  async componentDidMount() {
    await this.checkLogin()
  }

  render() {
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
                onPress={this.goToEmailLogin.bind(this)}
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
              <TextButton name="회원가입" onPress={this.goToRegister.bind(this)}/>
            </View>
          </View>
        </View>
      </View>
    )
  }

  async goToRegister() {
    Actions.register()
  };

  async goToEmailLogin() {
    Actions.localLogin()
  };

  /**
   * 로그인 여부를 판단해서 만약 로그인이 되어있는 유저일 경우
   * 홈 화면으로 넘겨준다
   *
   * @returns {Promise<void>}
   */
  async checkLogin() {
    const accessToken = await SecureStore.getItemAsync('token');

    if (accessToken) {
      // 로그인이 되어 있는 유저일때 홈 화면으로 보낸다
      Actions.replace('home')
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
  },
});
