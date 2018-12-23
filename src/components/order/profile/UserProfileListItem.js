/**
 * 주문 리스트에서 뜨는 유저 정보 컴포넌트
 */
import React from 'react'
import { Image, StyleSheet, Text, View } from "react-native";

export default class UserProfileListItem extends React.Component {

  render() {
    const hasAvatar = this.props.member.User.avatarUrl !== null;
    const isLeader = this.props.member.role === 'leader';
    const isUserPurchased = this.props.member.isUserPurchased;

    return (
      <View style={styles.profileListWrapper}>

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

        {/* 리더 일때 아이콘 추가 */}
        {isLeader ? <Image
          style={styles.leaderIcon}
          source={require('../../../assets/images/ic_leader.png')}/> : (<View/>)}

        {isUserPurchased && <View
          style={styles.userPurchasedGroup}>
          <Image style={styles.userPurchasedGroupImage} source={require('../../../assets/images/img_complete.png')}/>
        </View>}
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
    marginLeft: 8,
    zIndex: 2,
    position: 'absolute'
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
  },
  userPurchasedGroup: {
    width: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    left: 8,
    zIndex: 0,
    height: 50,
    position: 'absolute'
  },
  userPurchasedGroupImage: {
    justifyContent: 'center',
  },
  userPurchasedText: {
    color: '#FFF',
    top: 22,
    marginLeft: 8,
    marginRight: 8,
    borderRadius: 24,
    zIndex: 3,
    backgroundColor: '#FC5B26',
    fontSize: 10,
    textAlign: 'center',
    alignContent: 'center'
  }
});
