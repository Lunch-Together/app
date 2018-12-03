import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SecureStore } from "expo";
import { numberCommaFormat } from "../../../utils/NumberUtil";

export default class SheetFooter extends React.Component {

  state = { me: {}, totalPrice: 0, groupedOrders: [] };

  async componentDidMount() {

    // Me 정보
    const me = JSON.parse(await SecureStore.getItemAsync('me'));

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

    // State Update
    this.setState({ me, totalPrice, groupedOrders: Object.values(groupedOrders) });
  }

  render() {
    return <View style={styles.totalOrdersWrapper}>
      <Text style={[styles.ordersTitle]}>종합 주문서</Text>

      <View style={styles.othersOrderTableWrapper}>
        <View style={styles.ordersTableWrapper}>
          <Text style={[styles.ordersTableColFirst, styles.bold]}>메뉴명</Text>
          <Text style={[styles.ordersTableColSecond, styles.bold]}>수량</Text>
          <Text style={[styles.ordersTableColThird, styles.bold]}>단가</Text>
        </View>
        {/* 주문한 메뉴를 그룹핑 한 정보 를 보여준다 */}
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
          <Text style={styles.ordersTableTotalTitle}>총 금액</Text>
          <Text style={styles.ordersTableTotalPrice}>{numberCommaFormat(this.state.totalPrice)}원</Text>
        </View>
      </View>
    </View>
  }
}

export const styles = StyleSheet.create({
  totalOrdersWrapper: {
    padding: 30,
    backgroundColor: '#FFEDE7'
  },
  ordersTitle: {
    fontSize: 22, color: '#494949', fontWeight: 'bold'
  },
  othersOrderTableWrapper: {
    paddingTop: 25,
    paddingBottom: 15,
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
  },
});
