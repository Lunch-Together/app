/**
 * 주문 리스트에서 뜨는 유저 정보 컴포넌트
 */
import React from 'react'
import { StyleSheet, Text, View } from "react-native";

export default class UserProfileListItem extends React.Component {

  render() {
    return (
      <View>
        <Text style={styles.nickname}>{this.props.user.nickname}</Text>
      </View>)
  }
}

const styles = StyleSheet.create({
  nickname: {
    color: '#fff'
  }
});
