/**
 * Created by uran on 04/11/2018.
 */
import React from 'react'
import { TouchableOpacity, Text, View, TextInput, StyleSheet } from 'react-native'
import { Actions } from 'react-native-router-flux'
import AppButton from './AppButton'


const Register = () => {
  const goLogin = () => {
    Actions.login()
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <View style={styles.inputWrapper}>
          <Text style={styles.title}>이메일 주소</Text>
          <TextInput
            style={styles.input}
            placeholder="이메일 주소를 입력하세요."
          />
          <Text></Text>
        </View>
        <View style={styles.inputWrapper}>
          <Text style={styles.title}>비밀번호</Text>
          <TextInput

            style={styles.input}
            placeholder="비밀번호를 입력하세요."
          />
        </View>
        <View style={styles.inputWrapper}>
          <Text style={styles.title}>닉네임</Text>
          <TextInput

            style={styles.input}
            placeholder="닉네임을 입력하세요."
          />
        </View>

        <AppButton name="회원가입" type={'orange'} />
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

export default Register