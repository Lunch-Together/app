/**
 * Created by uran on 08/11/2018.
 *
 * 테이블에 추가된 유저가 메뉴를 주문하고 데이터를 보는 화면
 */
import React from 'react'
import { Dimensions, FlatList, StyleSheet, View } from 'react-native'
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import MenuList from "./MenuList";
import UserProfileListItem from "../../components/order/profile/UserProfileListItem";

export default class Order extends React.Component {

  state = {
    index: 0,
    routes: [
      { key: 'first', title: '분식' },
      { key: 'second', title: '식사' },
      { key: 'third', title: '주류' }
    ],
    users: [
      { key: '1', nickname: '가' },
      { key: '2', nickname: '나' },
      { key: '3', nickname: '다' },
      { key: '4', nickname: '라' }
    ]
  };

  render() {
    return (
      <View style={styles.container}>
        {/* 멤버 정보와 결제 금액 정보가 나와있는 뷰 */}
        <View style={styles.sectionHeader}>
          <FlatList
            data={this.state.users}
            renderItem={({ item }) => <UserProfileListItem user={item}/>}
            horizontal={true}>
          </FlatList>
        </View>
        <View style={styles.priceGroup}/>
        {/* 메뉴 정보 */}
        <TabView
          navigationState={this.state}
          renderScene={SceneMap({
            first: MenuList,
            second: MenuList,
            third: MenuList
          })}
          renderTabBar={this._renderTabBar}
          onIndexChange={index => this.setState({ index })}
          initialLayout={{ width: Dimensions.get('window').width, height: 0 }}
          style={styles.tabbar}
          labelStyle={styles.label}
        />
      </View>
    )
  }

  _renderTabBar(props) {
    return (
      <TabBar
        {...props}
        scrollEnabled
        indicatorStyle={styles.indicator}
        style={styles.tabbar}
        tabStyle={styles.tab}
        labelStyle={styles.label}
      />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  sectionHeader: {
    height: 102,
    backgroundColor: '#393939',
  },
  item: {
    flex: 1,
    color: '#fff',
    opacity: 0.6
  },
  tabbar: {
    backgroundColor: '#ffffff'
  },
  label: {
    color: '#000',
    fontWeight: '400',
  },
  tab: {
    width: 120,
  },
  indicator: {
    backgroundColor: '#000',
  },
  priceGroup: {
    backgroundColor: '#2c2c2c',
    height: 51
  }
});
