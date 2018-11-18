/**
 * Created by uran on 04/11/2018.
 */
import React from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native'
import AppButton from './AppButton'
import * as UserApi from '../api/users'

export default class Register extends React.Component {

  render() {
    return <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <View style={styles.inputWrapper}>
          <Text style={styles.title}>이메일 주소</Text>
          <TextInput
            style={styles.input}
            placeholder="이메일 주소를 입력하세요."
            autoCapitalize='none'
            textContentType='username'/>
          <Text></Text>
        </View>
        <View style={styles.inputWrapper}>
          <Text style={styles.title}>비밀번호</Text>
          <TextInput
            style={styles.input}
            textContentType='password'
            secureTextEntry={true}
            placeholder="비밀번호를 입력하세요."
          />
        </View>
        <View style={styles.inputWrapper}>
          <Text style={styles.title}>닉네임</Text>
          <TextInput
            style={styles.input}
            placeholder="닉네임을 입력하세요."/>
        </View>

        <AppButton name="회원가입" type={'orange'} onPress={this.postUser}/>
      </View>
    </View>
  }

  async postUser() {
    console.log('request post user');

    try {
      const data = await UserApi.postUser();
      console.log(`Result : ${data}`)
    } catch (e) {
      console.error(e)
    }
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
  },
  inputWrapper: {
    marginBottom: 24,
  },
  title: {
    color: '#494949',
  },
  input: {
    height: 40,
    paddingTop: 5,
    borderBottomWidth: 1,
    borderColor: '#DBDFE3',
  },
});
