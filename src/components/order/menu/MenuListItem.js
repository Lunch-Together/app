/**
 * 주문 리스트에서 뜨는 메뉴 리스트 컴포넌트
 */
import React from 'react'
import { Image, Text, View, StyleSheet } from 'react-native'

export default class MenuListItem extends React.Component {

  render() {
    return (
      <View style={styles.listWrapper}>
        <Image
          style={styles.menuImage}
          source={{ uri: this.props.menu.thumbnailUrl }}
        />
        <View style={styles.content}>
          <Text style={styles.name}>{this.props.menu.name}</Text>
          <Text style={styles.desc}>{this.props.menu.description}</Text>
          <View styles={{flexDirection: 'row'}}>
            <Text>버튼버</Text>
            <Text style={styles.price}>{this.props.menu.price}원</Text>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  listWrapper: {
    flexDirection: 'row',
    marginTop: 15
  },
  content: {
    marginLeft: 15
  },
  menuImage: {
    width: 95,
    height: 95,
    borderRadius: 4
  },
  name: {
    fontSize: 17,
  },
  desc: {
    marginTop: 6,
    fontSize: 13,
    color: '#808490',
  },
  price: {
    color: '#494949',
    fontSize: 15,
    alignItems: 'flex-end'
  }
});
