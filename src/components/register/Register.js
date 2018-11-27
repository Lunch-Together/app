/**
 * Created by uran on 04/11/2018.
 */
import React from 'react'
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native'
import { Actions } from 'react-native-router-flux'
import AppButton from '../button/AppButton'
import * as UserApi from '../../api/users'

export default class Register extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      nickname: ''
    }
  }

  render() {
    return <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <View style={styles.inputWrapper}>
          <Text style={styles.title}>이메일 주소</Text>
          <TextInput
            style={styles.input}
            placeholder="이메일 주소를 입력하세요."
            autoCapitalize='none'
            onChangeText={(value) => this.setState({ username: value })}
            textContentType='username'/>
          <Text></Text>
        </View>
        <View style={styles.inputWrapper}>
          <Text style={styles.title}>비밀번호</Text>
          <TextInput
            style={styles.input}
            textContentType='password'
            secureTextEntry={true}
            onChangeText={(value) => this.setState({ password: value })}
            placeholder="비밀번호를 입력하세요."
          />
        </View>
        <View style={styles.inputWrapper}>
          <Text style={styles.title}>닉네임</Text>
          <TextInput
            style={styles.input}
            onChangeText={(value) => this.setState({ nickname: value })}
            placeholder="닉네임을 입력하세요."/>
        </View>

        <AppButton name="회원가입" type={'orange'} onPress={this.postUser.bind(this)}/>
      </View>
    </View>
  }

  async postUser() {
    const response = await UserApi.postUser(this.state.username, this.state.password, this.state.nickname);
    if (response.ok !== true) {
      const body = await response.json();
      return Alert.alert('알림', body.message)
    } else {
      Alert.alert(
        '알림',
        '회원가입에 성공하였습니다',
        [
          { text: '확인', onPress: () => Actions.pop() },
        ],
        { cancelable: false }
      );
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
