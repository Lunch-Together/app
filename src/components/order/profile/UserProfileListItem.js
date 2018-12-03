/**
 * 주문 리스트에서 뜨는 유저 정보 컴포넌트
 */
import React from 'react'
import { Image, StyleSheet, Text, View } from "react-native";

export default class UserProfileListItem extends React.Component {

  render() {
    return (
      <View style={styles.profileListWrapper}>
        {/*<Text style={styles.nickname}>{this.props.member.role}</Text>*/}
        {/*<Image*/}
          {/*style={styles.leaderIcon}*/}
          {/*source={require('../../assets/images/ic_leader.png')}*/}
        {/*/>*/}
        <Image
          style={[this.props.member.role === 'leader' ? styles.leaderProfile : styles.profile]}
          source={{ uri: this.props.member.User.avatarUrl }}
        />
        <Text style={styles.nickname}>{this.props.member.User.nickname}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  profileListWrapper: {
    paddingLeft: 8,
    paddingRight: 8,
  },
  leaderIcon: {
    paddingLeft: 10,
  },
  profile: {
    width: 50,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 25,
  },
  leaderProfile: {
    width: 50,
    height: 50,
    backgroundColor: '#fff',
    borderColor: '#FC5B26',
    borderRadius: 25,
    borderWidth: 2,
  },
  nickname: {
    color: '#fff',
    marginTop: 10,
    opacity: 0.7,
    textAlign: 'center'
  }
});
