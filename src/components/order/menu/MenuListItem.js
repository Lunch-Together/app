/**
 * 주문 리스트에서 뜨는 메뉴 리스트 컴포넌트
 */
import React from 'react'
import { Text, View } from 'react-native'

export default class MenuListItem extends React.Component {

  render() {
    return (
      <View>
        <Text>{this.props.menu.title}</Text>
        <Text>{this.props.menu.description}</Text>
      </View>
    )
  }

}
