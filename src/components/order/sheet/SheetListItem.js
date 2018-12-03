import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { numberCommaFormat } from "../../../utils/NumberUtil";

export default class SheetListItem extends React.Component {

  state = { user: {}, totalPrice: 0, groupedOrders: [] };

  componentDidMount() {

    // 모든 상품 금액
    const totalPrice = this.props.orders
      .map(order => order.Menu.price)
      .reduce((previousValue, currentValue) => previousValue + currentValue, 0);

    // Grouped Orders
    const groupedOrders = {};
    for (let i = 0; i < this.props.orders.length; i++) {
      const order = this.props.orders[i];
      if (!groupedOrders[order.MenuId]) {
        const copiedOrder = Object.assign({}, order);
        delete copiedOrder.id;
        delete copiedOrder.createdAt;
        delete copiedOrder.updatedAt;
        groupedOrders[order.MenuId] = { order: copiedOrder, amount: 0 };
      }
      groupedOrders[order.MenuId].amount = groupedOrders[order.MenuId].amount + 1;
    }


    this.setState({ user: this.props.orders[0].User, totalPrice, groupedOrders: Object.values(groupedOrders) })
  }

  render() {
    return <View style={styles.othersOrderTableWrapper}>
      <View style={styles.ordersProfileWrapper}>
        <Image
          style={styles.ordersProfileImg}
          source={{ uri: this.state.user.avatarUrl }}/>
        <Text style={styles.ordersProfileName}>{this.state.user.nickname}</Text>
      </View>

      {
        this.state.groupedOrders.map(groupedOrder => {
          return <View style={styles.ordersTableWrapper} key={groupedOrder.order.Menu.id}>
            <Text style={styles.ordersTableColFirst}>{groupedOrder.order.Menu.name}</Text>
            <Text style={styles.ordersTableColSecond}>{groupedOrder.amount}개</Text>
            <Text style={styles.ordersTableColThird}>
              {numberCommaFormat(groupedOrder.amount * groupedOrder.order.Menu.price)}원
            </Text>
          </View>
        })
      }

      <View style={styles.ordersTableDivider}/>
      <View style={styles.ordersTableTotalWrapper}>
        <Text style={styles.ordersOtherTableTotalTitle}>총 금액</Text>
        <Text style={styles.ordersOtherTableTotalPrice}>{numberCommaFormat(this.state.totalPrice)}원</Text>
      </View>
    </View>
  }
}

const styles = StyleSheet.create({
  othersOrderTableWrapper: {
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 15,
    paddingRight: 15
  },
  ordersProfileName: {
    marginLeft: 15, fontSize: 15,
  },
  ordersProfileWrapper: {
    flexDirection: 'row', marginTop: 28, alignItems: 'center', marginBottom: 25
  },
  ordersProfileImg: {
    width: 40, height: 40, borderRadius: 10,
  },
  ordersTableWrapper: {
    flexDirection: 'row', marginBottom: 13,
  },
  ordersTableColFirst: {
    flex: 3, color: '#494949', fontSize: 16
  },
  ordersTableColSecond: {
    flex: 1, color: '#494949', fontSize: 16
  },
  ordersTableColThird: {
    flex: 1, color: '#494949', fontSize: 16, textAlign: 'right',
  },
  ordersTableTotalWrapper: {
    flexDirection: 'row', marginTop: 15
  },
  ordersOtherTableTotalTitle: {
    flex: 1, fontSize: 15, color: '#494949', fontWeight: 'bold',
  },
  ordersOtherTableTotalPrice: {
    flex: 1, fontSize: 15, textAlign: 'right', justifyContent: 'flex-end', color: '#494949', fontWeight: 'bold',
  }
});
