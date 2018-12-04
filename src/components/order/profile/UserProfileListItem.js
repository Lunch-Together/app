/**
 * 주문 리스트에서 뜨는 유저 정보 컴포넌트
 */
import React from 'react'
import { Image, StyleSheet, Text, View } from "react-native";

export default class UserProfileListItem extends React.Component {

  render() {
    const hasAvatar = this.props.member.User.avatarUrl !== null;

    return (
      <View style={styles.profileListWrapper}>
        {/*<Text style={styles.nickname}>{this.props.member.role}</Text>*/}
        {/*<Image*/}
        {/*style={styles.leaderIcon}*/}
        {/*source={require('../../assets/images/ic_leader.png')}*/}
        {/*/>*/}

        {/* 유저가 프필 이미지가 있을 경우와 없을 경우로 나눠 사용 */}
        {hasAvatar ? (
          <Image
            style={[this.props.member.role === 'leader' ? styles.leaderProfile : styles.profile]}
            source={{ uri: this.props.member.User.avatarUrl }}/>
        ) : (
          <Image
            style={[this.props.member.role === 'leader' ? styles.leaderProfile : styles.profile]}
            source={require('../../../assets/images/img_profile_sample.png')}/>
        )}
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
    borderColor: '#FFF',
    borderRadius: 25,
    borderWidth: 2
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
