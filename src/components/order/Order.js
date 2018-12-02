/**
 * Created by uran on 08/11/2018.
 *
 * 테이블에 추가된 유저가 메뉴를 주문하고 데이터를 보는 화면
 */
import React, { Component } from 'react'
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
  ScrollView,

} from 'react-native'
import { TabBar, TabView } from 'react-native-tab-view'
import UserProfileListItem from './profile/UserProfileListItem'
import * as meApi from '../../api/me'
import * as groupApi from '../../api/groups'
import * as shopApi from '../../api/shop'
import SocketIOClient from 'socket.io-client'
import { getAccessToken, URL } from '../../api/constants'
import MenuList from './menu/MenuList'
import ActionButton from 'react-native-action-button'
import Icon from 'react-native-vector-icons/Ionicons'


export default class Order extends Component {

  state = {
    index: 0,
    routes: [{ key: 'dummy' }],
    orders: [],
    orderModalVisible: false,
  };

  constructor(props) {
    super(props);

    // 소켓 생성
    this.socket = SocketIOClient(URL);
  }

  async componentDidMount() {
    // 현재 로그인한 유저의 그룹 정보를 요청하고
    // 멤버 정보와, 메뉴 정보를 업데이트 한다
    const meGroupResponse = await meApi.getMeGroup();
    if (meGroupResponse.ok !== true) {
      Alert.alert('알림', '그룹에 참여하지 않은 계정 입니다');
      return
    }

    // Me 에서 요청한 내 그룹 정보
    const meGroup = await meGroupResponse.json();

    // 그룹 아이디
    const groupId = meGroup.data.id;

    // 그룹 상세 정보 요청
    const groupResponse = await groupApi.getGroup(groupId);
    if (groupResponse.ok !== true) {
      Alert.alert('알림', '그룹 정보를 가져오지 못했습니다');
      return
    }

    // 내가 참여하고 있는 그룹 상세 정보
    const group = await groupResponse.json();
    const { Table, GroupMembers } = group.data;
    const { ShopId } = Table;

    // 상점 메뉴 정보
    const shopMenusResponse = await shopApi.getShopMenus(ShopId);
    if (shopMenusResponse.ok !== true) {
      Alert.alert('알림', '메뉴 정보를 가져오지 못했습니다');
      return
    }

    // 상점의 메뉴 데이터
    const shopMenus = await shopMenusResponse.json();

    // 해당 그룹에서 주문한 항목들 리스트
    const ordersResponse = await groupApi.getGroupOrders(groupId);
    if (ordersResponse.ok !== true) {
      Alert.alert('알림', '그룹의 주문 정보를 가져오지 못했습니다');
      return
    }

    // 그룹의 주문 정보
    const orders = await ordersResponse.json();

    // 그룹 정보 적용
    this.setState({
      users: GroupMembers.map(item => {
        return { key: `${item.id}`, ...item }
      }),
      menus: shopMenus.data,
      routes: shopMenus.data.map(category => {
        return { key: `${category.id}`, title: category.name }
      }),
      orders: orders.data
    });

    // 소켓 연결
    await this._connectAndRegisterSocket(groupId);
  }

  render() {
    return (
      <View style={styles.container}>
        {/* 멤버 정보와 결제 금액 정보가 나와있는 뷰 */}
        <View style={styles.sectionHeader}>
          <FlatList
            extraData={this.state}
            data={this.state.users}
            renderItem={({ item }) => <UserProfileListItem member={item}/>}
            horizontal={true}>
          </FlatList>
        </View>
        <View style={styles.priceGroup}>
          <Text style={styles.priceText}>총 {this._orderTotalPrice()}원</Text>
        </View>
        {/* 메뉴 정보 */}
        <TabView
          navigationState={this.state}
          renderScene={this._renderScene}
          renderTabBar={this._renderTabBar}
          onIndexChange={index => this.setState({ index })}
          initialLayout={{ width: Dimensions.get('window').width, height: 0 }}
          style={styles.tabbar}
          labelStyle={styles.label}/>
        <View style={styles.fixedBtnWrapper}>
          {/*내 주문전송 버튼*/}
          <View style={styles.sendMyOrderBtn}>
            <TouchableOpacity activeOpacity={0.6}>
              <Text style={{color: '#fff', fontSize: 18}}>내 주문 전송</Text>
            </TouchableOpacity>
          </View>
          {/*주문서 버튼*/}
          <View style={styles.orderSheet}>
            <TouchableOpacity
              onPress={() => {this.setModalVisible(!this.state.orderModalVisible);}}
              activeOpacity={0.6}
            >
              <Text style={{color: '#fff', fontSize: 18}}>주문서</Text>
            </TouchableOpacity>

            <Modal
              animationType="slide"
              transparent={false}
              visible={this.state.orderModalVisible === true}
              onRequestClose={() => {
                Alert.alert('Modal has been closed.');
              }}>
              <View style={styles.container}>

              </View>

              <View style={{marginTop: 22}}>
                <View style={styles.modalNav}>
                  <TouchableHighlight
                    onPress={() => {
                      this.setModalVisible(!this.state.orderModalVisible);
                    }}
                    style={{flex: 1}}
                  >
                    <Text>닫기</Text>
                  </TouchableHighlight>
                  <Text style={styles.orderNavTitle}>주문서</Text>
                  <View style={{flex: 1}}></View>
                </View>
                <ScrollView>
                  <View style={styles.myOrdersWrapper}>
                    <Text style={styles.ordersTitle}>내가 주문한 메뉴</Text>

                    <View style={styles.ordersProfileWrapper}>
                      <Image
                        style={styles.ordersProfileImg}
                        source={require('../../assets/images/img_profile_sample.png')}
                      />
                      <Text style={styles.ordersProfileName}>나나나</Text>
                    </View>

                    <View style={styles.ordersTableWrapper}>
                      <Text style={styles.ordersTableColFirst}>매콤 떡볶이 순한맛</Text>
                      <Text style={styles.ordersTableColSecond}>13개</Text>
                      <Text style={styles.ordersTableColThird}>13000원</Text>
                    </View>
                    <View style={styles.ordersTableWrapper}>
                      <Text style={styles.ordersTableColFirst}>매콤 떡볶이 순한맛</Text>
                      <Text style={styles.ordersTableColSecond}>13개</Text>
                      <Text style={styles.ordersTableColThird}>13000원</Text>
                    </View>
                    <View style={styles.ordersTableDivider}></View>
                    <View style={styles.ordersTableTotalWrapper}>
                      <Text style={styles.ordersTableTotalTitle}>총 금액</Text>
                      <Text style={styles.ordersTableTotalPrice}>13,000원</Text>
                    </View>
                  </View>
                  <View style={styles.otherOrdersWrapper}>
                    <Text style={styles.ordersTitle}>다른 멤버 x명이 주문한 메뉴</Text>

                    <View style={styles.othersOrderTableWrapper}>
                      <View style={styles.ordersProfileWrapper}>
                        <Image
                          style={styles.ordersProfileImg}
                          source={require('../../assets/images/img_profile_sample.png')}
                        />
                        <Text style={styles.ordersProfileName}>나나나</Text>
                      </View>

                      <View style={styles.ordersTableWrapper}>
                        <Text style={styles.ordersTableColFirst}>매콤 떡볶이 순한맛</Text>
                        <Text style={styles.ordersTableColSecond}>13개</Text>
                        <Text style={styles.ordersTableColThird}>13000원</Text>
                      </View>
                      <View style={styles.ordersTableWrapper}>
                        <Text style={styles.ordersTableColFirst}>매콤 떡볶이 순한맛</Text>
                        <Text style={styles.ordersTableColSecond}>13개</Text>
                        <Text style={styles.ordersTableColThird}>13000원</Text>
                      </View>
                      <View style={styles.ordersTableDivider}></View>
                      <View style={styles.ordersTableTotalWrapper}>
                        <Text style={styles.ordersOtherTableTotalTitle}>총 금액</Text>
                        <Text style={styles.ordersOtherTableTotalPrice}>13,000원</Text>
                      </View>
                    </View>
                    <View style={styles.othersOrderTableWrapper}>
                      <View style={styles.ordersProfileWrapper}>
                        <Image
                          style={styles.ordersProfileImg}
                          source={require('../../assets/images/img_profile_sample.png')}
                        />
                        <Text style={styles.ordersProfileName}>나나나</Text>
                      </View>

                      <View style={styles.ordersTableWrapper}>
                        <Text style={styles.ordersTableColFirst}>매콤 떡볶이 순한맛</Text>
                        <Text style={styles.ordersTableColSecond}>13개</Text>
                        <Text style={styles.ordersTableColThird}>13000원</Text>
                      </View>
                      <View style={styles.ordersTableWrapper}>
                        <Text style={styles.ordersTableColFirst}>매콤 떡볶이 순한맛</Text>
                        <Text style={styles.ordersTableColSecond}>13개</Text>
                        <Text style={styles.ordersTableColThird}>13000원</Text>
                      </View>
                      <View style={styles.ordersTableDivider}></View>
                      <View style={styles.ordersTableTotalWrapper}>
                        <Text style={styles.ordersOtherTableTotalTitle}>총 금액</Text>
                        <Text style={styles.ordersOtherTableTotalPrice}>13,000원</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.totalOrdersWrapper}>
                    <Text style={[styles.ordersTitle]}>종합 주문서</Text>

                    <View style={styles.othersOrderTableWrapper}>
                      <View style={styles.ordersTableWrapper}>
                        <Text style={[styles.ordersTableColFirst, styles.bold]}>메뉴명</Text>
                        <Text style={[styles.ordersTableColSecond, styles.bold]}>수량</Text>
                        <Text style={[styles.ordersTableColThird, styles.bold]}>단가</Text>
                      </View>
                      <View style={styles.ordersTableWrapper}>
                        <Text style={styles.ordersTableColFirst}>매콤 떡볶이 순한맛</Text>
                        <Text style={styles.ordersTableColSecond}>13개</Text>
                        <Text style={styles.ordersTableColThird}>13000원</Text>
                      </View>
                      <View style={styles.ordersTableWrapper}>
                        <Text style={styles.ordersTableColFirst}>매콤 떡볶이 순한맛</Text>
                        <Text style={styles.ordersTableColSecond}>13개</Text>
                        <Text style={styles.ordersTableColThird}>13000원</Text>
                      </View>
                      <View style={styles.ordersTableDivider}></View>
                      <View style={styles.ordersTableTotalWrapper}>
                        <Text style={styles.ordersTableTotalTitle}>총 금액</Text>
                        <Text style={styles.ordersTableTotalPrice}>13,000원</Text>
                      </View>
                    </View>
                  </View>
                </ScrollView>
              </View>

              <View style={{position: 'absolute', bottom: 90, right: 100, zIndex: 99}}>
                <ActionButton buttonColor="#494949">
                  <ActionButton.Item
                    buttonColor="#9b59b6"
                    title="내 주문 계산"
                    onPress={() => console.log('notes tapped!')}>
                    <Icon name="android-create" style={styles.actionButtonIcon} />
                  </ActionButton.Item>
                  <ActionButton.Item
                    buttonColor="#3498db"
                    title="1/N 계산"
                    onPress={() => {}}>
                    <Icon
                      name="android-notifications-none"
                      style={styles.actionButtonIcon}
                    />
                  </ActionButton.Item>
                </ActionButton>
              </View>

              <View style={styles.requestOrderBtn}>
                <TouchableOpacity activeOpacity={0.6}>
                    <Text style={styles.requestOrderBtnText}>결제요청</Text>
                </TouchableOpacity>
              </View>
            </Modal>
          </View>
        </View>
      </View>
    )
  }

  /**
   * TavView 탭 정보를 렌더링 하는 함수
   * (메뉴 카테고리 정보)
   * @param props
   * @returns {*}
   * @private
   */
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

  /**
   * TabView 하단에 보여지는 화면을 렌더링 하는 함수
   * (메뉴 리스트)
   *
   * @param route
   * @returns {*}
   * @private
   */
  _renderScene = ({ route }) => {
    if (this.state.routes.indexOf(route) !== this.state.index || !this.state.menus) {
      return <View/>;
    }

    const menu = this.state.menus.find(item => item.id === parseInt(route.key));
    if (!menu) {
      return <View/>
    }

    return <MenuList menus={menu.Menus}/>
  };

  /**
   * 그룹 아이디를 가지고 Socket 에 Join 요청을 하고
   * 주문에 필요한 모든 socket event 들을 등록한다
   *
   * @param groupId
   * @returns {Promise<void>}
   * @private
   */
  async _connectAndRegisterSocket(groupId) {
    const token = await getAccessToken();

    // 그룹 조인 성공 여부가 넘어온다
    this.socket.on('join-group-result', (message) => {
      // TODO 실패 여부에 따른 처리
    });

    // 멤버가 소켓에 연결 되었을때
    this.socket.on('connect-member', (member) => {
      console.log('멤버 접속', member)
    });

    // 새로운 멤버가 그룹에 추가 되었을때
    this.socket.on('new-group-member', (member) => {
      this.state.users.push(Object.assign({}, member.data, { key: `${member.data.id}` }));
      this.setState(this.state);
    });

    // 새로운 주문이 그룹에 추가 되었을때
    this.socket.on('new-order', (order) => {
      this.state.orders.push(order.data);
      this.setState({ orders: this.state.orders })
    });

    // 방에 접속하면 조인을 요청한다
    this.socket.emit('join-group', { token, groupId });
  }

  /**
   * 현재 그룹에서 주문한 총 금액 데이터를 반환한다
   *
   * @returns {*}
   * @private
   */
  _orderTotalPrice() {
    if (this.state.orders) {
      return this.state.orders
        .map(order => order.Menu.price)
        .reduce((previousValue, currentValue) => previousValue + currentValue, 0);
    } else {
      return 0
    }
  }

  /* 주문하기 모달 */
  setModalVisible(visible) {
    console.log('set', visible)
    this.setState({orderModalVisible: visible});
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  bold: {
    fontWeight: 'bold',
  },
  sectionHeader: {
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 15,
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
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: '#2c2c2c',
    height: 51,
    justifyContent: 'center'
  },
  priceText: {
    color: '#fff'
  },
  fixedBtnWrapper: {
    position: 'absolute',
    bottom: 45,
    flexDirection: 'row',
    alignSelf: 'center'
  },
  sendMyOrderBtn: {
    backgroundColor: '#FC5B26',
    paddingLeft: 25,
    paddingRight: 25,
    paddingTop: 12,
    paddingBottom: 12,
    borderRadius: 35,
    alignSelf: 'center'
  },
  orderSheet: {
    marginLeft: 15,
    backgroundColor: '#494949',
    paddingLeft: 25,
    paddingRight: 25,
    paddingTop: 12,
    paddingBottom: 12,
    borderRadius: 35,
    alignSelf: 'center'
  },
  modalNav: {
    padding: 50,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  orderNavTitle: {
    flex: 2, textAlign: 'center', fontSize: 18
  },
  myOrdersWrapper: {
    padding: 30, backgroundColor: '#F6F8FA'
  },
  otherOrdersWrapper: {
    padding: 30,
  },
  totalOrdersWrapper: {
    padding: 30,
    marginBottom: 150,
    backgroundColor: '#FFEDE7'
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
  },
  ordersOtherTableTotalTitle: {
    flex: 1, fontSize: 15, color: '#494949', fontWeight: 'bold',
  },
  ordersOtherTableTotalPrice: {
    flex: 1, fontSize: 15, textAlign: 'right', justifyContent: 'flex-end', color: '#494949', fontWeight: 'bold',
  },
  othersOrderTableWrapper: {
    paddingTop: 25,
    paddingBottom: 15,
  },
  requestOrderBtn: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 18,
    backgroundColor: '#333',
    justifyContent: 'center',
    flexDirection: 'row',
    alignSelf: 'center'
  },
  requestOrderBtnText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },


});
