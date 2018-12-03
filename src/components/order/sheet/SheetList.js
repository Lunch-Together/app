import React from 'react'
import { FlatList, View } from 'react-native'
import SheetHeader from "./SheetHeader";
import SheetFooter from "./SheetFooter";
import SheetListItem from "./SheetListItem";
import { SecureStore } from "expo";

export default class SheetList extends React.Component {

  state = {
    groupedByMemberOrders: []
  };

  async componentDidMount() {
    const groupedByMemberOrders = {};

    // Me 정보
    const me = JSON.parse(await SecureStore.getItemAsync('me'));

    for (let i = 0; i < this.props.orders.length; i++) {
      const order = this.props.orders[i];

      // 내 정보는 추가하지 않는다
      if (parseInt(order.UserId) === parseInt(me.id)) continue;

      if (!groupedByMemberOrders[order.UserId]) {
        groupedByMemberOrders[order.UserId] = []
      }
      groupedByMemberOrders[order.UserId].push(order);
    }

    this.setState({ groupedByMemberOrders: Object.values(groupedByMemberOrders) })
  }

  render() {
    return <View style={this.props.style}>
      <FlatList
        keyExtractor={(item, index) => `${index}`}
        ListHeaderComponent={() => <SheetHeader orders={this.props.orders}/>}
        ListFooterComponent={() => <SheetFooter orders={this.props.orders}/>}
        extraData={this.state}
        data={this.state.groupedByMemberOrders}
        renderItem={({ item }) => <SheetListItem orders={item}/>}/>
    </View>
  }
}
