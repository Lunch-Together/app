/**
 * 주문 화면에서 보여지는 메뉴 리스트 컴포넌트
 */

import React from 'react'
import { FlatList, StyleSheet } from "react-native";
import MenuListItem from "./MenuListItem";

export default class MenuList extends React.Component {

  render() {
    return (
      <FlatList
        style={styles.MenuListWrapper}
        extraData={this.props}
        keyExtractor={this._keyExtractor}
        data={this.props.menus}
        renderItem={({ item }) => <MenuListItem
          onChangeAmount={(menu, type) => {
            if (this.props.onChangeMenuAmount) this.props.onChangeMenuAmount(menu, type);
          }}
          menu={item}
          amount={item.amount || 0}/>}/>
    )
  }

  _keyExtractor = (item, index) => `${item.id}`;
}

const styles = StyleSheet.create({
  MenuListWrapper: {
    padding: 20
  }
});
