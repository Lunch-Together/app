import React from 'react'
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native'
import { Actions } from 'react-native-router-flux'
import AppButton from '@components/AppButton'
import { postLogin } from "../../api/login";
import { SecureStore } from 'expo'

export default class LocalLoginPage extends React.Component {

  state = {
    username: null,
    password: null
  };

  componentWillMount() {
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
          />
          <Text></Text>
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

      Actions.reset('home')
    }
  }

  goHome = () => {
    Actions.home()
  };
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

