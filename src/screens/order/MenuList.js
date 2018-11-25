/**
 * 주문 화면에서 보여지는 메뉴 리스트 컴포넌트
 */

import React from 'react'
import { FlatList } from "react-native";
import MenuListItem from "../../components/order/menu/MenuListItem";

export default class MenuList extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      menus: [
        { id: '1', title: '매콤 떡볶이', description: '달콤하고 맛있어요' },
        { id: '2', title: '순대 내장팍팍', description: '순대는 초장이죠' }
      ]
    }
  }

  render() {
    return (
      <FlatList
        keyExtractor={this._keyExtractor}
        data={this.state.menus}
        renderItem={({ item }) => <MenuListItem menu={item}/>}/>
    )
  }

  _keyExtractor = (item, index) => item.id;

}
