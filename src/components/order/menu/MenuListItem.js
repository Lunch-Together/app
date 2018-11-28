/**
 * 주문 리스트에서 뜨는 메뉴 리스트 컴포넌트
 */
import React from 'react'
import { Image, Text, View, StyleSheet, TouchableOpacity } from 'react-native'

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
          <View styles={styles.test}>
            <View style={styles.countButton}>
              <TouchableOpacity activeOpacity={0.6}>
                <View>
                  <Text style={{ color: '#ABAEB6' }}>-</Text>
                </View>
              </TouchableOpacity>
            </View>
            <Text style={styles.count}>0</Text>
            <View style={styles.countButton}>
              <TouchableOpacity activeOpacity={0.6}>
                <View>
                  <Text style={{ color: '#ABAEB6' }}>+</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View>
              <Text style={styles.price}>{this.props.menu.price}원</Text>
            </View>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  listWrapper: {
    flexDirection: 'row',
    marginTop: 15,
    flex: 1
  },
  test: {
    flex: 1,
    flexDirection: 'row'
  },
  content: {
    marginLeft: 15,
    flex: 2,
  },
  count: {
    padding: 5,
    borderWidth: 1,
    borderColor: '#DBDFE3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countButton: {
    padding: 5,
    borderWidth: 1,
    borderColor: '#DBDFE3',
    alignItems: 'center',
    justifyContent: 'center',
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
    fontSize: 18,
    alignItems: 'flex-end'
  }
});
