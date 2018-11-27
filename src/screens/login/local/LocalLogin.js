import React from 'react'
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { postLogin } from "../../../api/login";
import { SecureStore } from 'expo'
import AppButton from "../../../components/button/AppButton";

export default class LocalLogin extends React.Component {

  state = {
    username: null,
    password: null
  };

  render() {
    return <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <View style={styles.inputWrapper}>
          <Text style={styles.title}>이메일 주소</Text>
          <TextInput
            style={styles.input}
            placeholder="이메일 주소를 입력하세요."
            autoCapitalize='none'
            onChangeText={(value) => this.setState({ username: value })}/>
        </View>
        <View style={styles.inputWrapper}>
          <Text style={styles.title}>비밀번호</Text>
          <TextInput
            style={styles.input}
            textContentType='password'
            secureTextEntry={true}
            placeholder="비밀번호를 입력하세요."
            onChangeText={(value) => this.setState({ password: value })}
          />
        </View>
        <AppButton
          name="로그인"
          type={'orange'}
          onPress={this.login.bind(this)}
        />
      </View>
    </View>
  }

  async login() {
    const response = await postLogin(this.state.username, this.state.password);
    if (response.ok !== true) {
      return Alert.alert('알림', '로그인에 실패하였습니다')
    } else {
      const { data } = await response.json();
      const { token } = data;
      await SecureStore.setItemAsync('token', token);

      // Welcome 페이지로 이동시켜 다시 옳바른 페이지로 이동할 수 있도록 한다
      Actions.reset('welcome')
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

