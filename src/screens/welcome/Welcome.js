/**
 * 앱을 처음 실행 시켰을때 나오는 화면
 *
 * 해당 화면에서 유저 로그인 여부
 * 현재 테이블 참석 여부 등을 확인 하여 다음 페이지로 이동한다
 */
import React from 'react'
import { View } from "react-native";
import { SecureStore } from 'expo'
import { Actions } from "react-native-router-flux";

export default class Welcome extends React.Component {

  async componentDidMount() {
    const token = await SecureStore.getItemAsync('token');

    // Token이 없을 경우에 로그인 페이지로 이동
    if (!token) {
      Actions.replace('login');
      return
    }

    // Token있을경우 테이블 참석 여부 등을 확인하여 페이지 이동
    Actions.replace('home')
  }

  render() {
    return (
      <View>

      </View>
    )
  }
}
