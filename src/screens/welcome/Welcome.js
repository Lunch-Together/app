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
import * as MeApi from '../../api/me'

export default class Welcome extends React.Component {

  async componentDidMount() {
    const token = await SecureStore.getItemAsync('token');

    // Token이 없을 경우에 로그인 페이지로 이동
    if (!token) {
      Actions.replace('login');
      return
    }

    // Token있을경우 테이블 참석 여부 등을 확인하여 페이지 이동
    const meGroupResponse = await MeApi.getMeGroup();

    // 만약 그룹 정보가 없을 경우
    if (meGroupResponse.ok !== true) {
      if (meGroupResponse.status === 404) {
        // 유저가 그룹에 속해 있지 않을때 QR Code 스캔 페이지로 이동
        Actions.replace('qrScan')
      } else {
        // 그 외의 에러도 이동
        Actions.replace('qrScan')
      }
    } else {
      // 유저가 그룹에 속해 있을떄 페이지 이동
      Actions.replace('order')
    }
  }

  render() {
    return (
      <View>

      </View>
    )
  }
}
