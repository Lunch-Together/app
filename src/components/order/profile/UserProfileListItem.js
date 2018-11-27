/**
 * 주문 리스트에서 뜨는 유저 정보 컴포넌트
 */
import React from 'react'
import { Image, StyleSheet, Text, View } from "react-native";

export default class UserProfileListItem extends React.Component {

  render() {
    return (
      <View>
        <Text style={styles.nickname}>{this.props.member.User.nickname}</Text>
        <Text style={styles.nickname}>{this.props.member.role}</Text>
        <Image
          style={{ width: 50, height: 50 }}
          source={{ uri: this.props.member.User.avatarUrl }}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  nickname: {
    color: '#fff'
  }
});
