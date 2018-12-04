/**
 * 주문 리스트에서 뜨는 메뉴 리스트 컴포넌트
 */
import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { numberCommaFormat } from "../../../utils/NumberUtil";

export default class MenuListItem extends React.Component {

  state = {
    amount: this.props.menu.amount || 0
  };

  render() {
    return (
      <View style={styles.listWrapper}>
        <Image
          style={styles.menuImage}
          source={{ uri: this.props.menu.thumbnailUrl }}/>
        <View style={styles.content}>
          <Text style={styles.name}>{this.props.menu.name}</Text>
          <Text style={styles.desc}>{this.props.menu.description}</Text>
          <View style={styles.directionRow}>
            <TouchableOpacity activeOpacity={0.6} onPress={this.minusAmount.bind(this)} style={styles.countButton}>
              <Text style={styles.amountButton}>-</Text>
            </TouchableOpacity>
            <View style={styles.countGroup}>
              <Text style={styles.count}>{this.state.amount}</Text>
            </View>
            <TouchableOpacity activeOpacity={0.6} onPress={this.plusAmount.bind(this)} style={styles.countButton}>
              <Text style={styles.amountButton}>+</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.priceGroup}>
            <Text style={styles.price}>{numberCommaFormat(this.props.menu.price)}원</Text>
          </View>
        </View>
      </View>
    )
  }

  plusAmount() {
    this.state.amount = this.state.amount + 1;
    this.setState({ amount: this.state.amount });
    if (this.props.onChangeAmount) {
      this.props.onChangeAmount(this.props.menu, 'plus');
    }
    this.props.menu.amount = this.state.amount
  }

  minusAmount() {
    if (this.state.amount - 1 >= 0) {
      this.state.amount = this.state.amount - 1;
      this.setState({ amount: this.state.amount });
      if (this.props.onChangeAmount) {
        this.props.onChangeAmount(this.props.menu, 'minus');
      }
      this.props.menu.amount = this.state.amount
    }
  }
}

const styles = StyleSheet.create({
  listWrapper: {
    flexDirection: 'row',
    marginTop: 15,
    flex: 1
  },
  directionRow: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 6
  },
  content: {
    marginLeft: 15,
    flex: 2,
  },
  countGroup: {
    borderTopWidth: 1,
    height: 30,
    borderBottomWidth: 1,
    borderColor: '#DBDFE3'
  },
  count: {
    paddingLeft: 10,
    paddingTop: 5,
    paddingBottom: 5,
    paddingRight: 10,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  amountButton: {
    color: '#ABAEB6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countButton: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    height: 30,
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
  },
  priceGroup: {
    marginTop: 6
  }
});
