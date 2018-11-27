/**
 * 주문 화면에서 보여지는 메뉴 리스트 컴포넌트
 */

import React from 'react'
import { FlatList } from "react-native";
import MenuListItem from "./MenuListItem";

export default class MenuList extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <FlatList
        extraData={this.props}
        keyExtractor={this._keyExtractor}
        data={this.props.menus}
        renderItem={({ item }) => <MenuListItem menu={item}/>}/>
    )
  }

  _keyExtractor = (item, index) => `${item.id}`;

}
