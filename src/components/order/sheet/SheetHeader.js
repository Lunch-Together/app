import React from 'react'
import { Image, StyleSheet, Text, View } from "react-native";
import { SecureStore } from "expo";
import { numberCommaFormat } from "../../../utils/NumberUtil";

/**
 * 주문서 헤더 컨포넌트
 *
 * 내가 주문한 항목들을 보여준다
 */
export default class SheetHeader extends React.Component {

  state = { me: {}, totalPrice: 0, groupedOrders: [] };

  async componentDidMount() {

    // Me 정보
    const me = JSON.parse(await SecureStore.getItemAsync('me'));

    // 모든 주문 내역에서 내가 주문한 주문 내역만 가져온다
    const myOrders = this.props.orders.filter(order => order.UserId === me.id);

    // 모든 상품 금액
    const totalPrice = myOrders
      .map(order => order.Menu.price)
      .reduce((previousValue, currentValue) => previousValue + currentValue, 0);

    // Grouped Orders
    const groupedOrders = {};
    for (let i = 0; i < myOrders.length; i++) {
      const myOrder = myOrders[i];
      if (!groupedOrders[myOrder.MenuId]) {
        const order = Object.assign({}, myOrder);
        delete order.id;
        delete order.createdAt;
        delete order.updatedAt;
        groupedOrders[myOrder.MenuId] = { order, amount: 0 };
      }
      groupedOrders[myOrder.MenuId].amount = groupedOrders[myOrder.MenuId].amount + 1;
    }

    // State Update
    this.setState({ me, myOrders, totalPrice, groupedOrders: Object.values(groupedOrders) });
  }

  render() {
    return <View style={styles.myOrdersWrapper}>
      <Text style={styles.ordersTitle}>내가 주문한 메뉴</Text>

      <View style={styles.ordersProfileWrapper}>
        <Image
          style={styles.ordersProfileImg}
          source={{ uri: this.state.me.avatarUrl }}/>
        <Text style={styles.ordersProfileName}>{this.state.me.nickname}</Text>
      </View>

      {/* 내가 주문한 메뉴를 그룹핑 한 정보 를 보여준다 */}
      {
        this.state.groupedOrders.map(groupedOrder => {
          return <View style={styles.ordersTableWrapper} key={groupedOrder.order.MenuId}>
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
        <Text style={styles.ordersTableTotalTitle}>총 금액</Text>
        <Text style={styles.ordersTableTotalPrice}>
          {numberCommaFormat(this.state.totalPrice)}원
        </Text>
      </View>
    </View>
  }
}

const styles = StyleSheet.create({
  myOrdersWrapper: {
    padding: 30, backgroundColor: '#F6F8FA'
  },
  ordersTitle: {
    fontSize: 22, color: '#494949', fontWeight: 'bold'
  },
  ordersProfileWrapper: {
    flexDirection: 'row', marginTop: 28, alignItems: 'center', marginBottom: 25
  },
  ordersProfileImg: {
    width: 40, height: 40, borderRadius: 10,
  },
  ordersProfileName: {
    marginLeft: 15, fontSize: 15,
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
  ordersTableDivider: {
    borderWidth: 1, borderTopColor: '#E9ECEF', opacity: 0.1,
  },
  ordersTableTotalWrapper: {
    flexDirection: 'row', marginTop: 15
  },
  ordersTableTotalTitle: {
    flex: 1, fontSize: 18, color: '#FC5B26', fontWeight: 'bold',
  },
  ordersTableTotalPrice: {
    flex: 1, fontSize: 18, textAlign: 'right', justifyContent: 'flex-end', color: '#FC5B26', fontWeight: 'bold',
  }
});
