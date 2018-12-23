/**
 * Created by uran on 08/11/2018.
 *
 * 테이블에 추가된 유저가 메뉴를 주문하고 데이터를 보는 화면
 */
import React, { Component } from 'react'
import {
  Alert,
  Dimensions,
  FlatList,
  Modal,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
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
import SheetList from "./sheet/SheetList";
import { SecureStore } from "expo";
import { numberCommaFormat } from "../../utils/NumberUtil";
import { Actions } from "react-native-router-flux";


export default class Order extends Component {

  state = {
    groupId: null,
    index: 0,
    routes: [{ key: 'dummy' }],
    menus: [],
    orders: [],
    purchases: [],
    preOrders: [],
    orderModalVisible: false,
    orderStateModalVisible: false,
  };

  constructor(props) {
    super(props);

    // 소켓 생성
    this.socket = SocketIOClient(URL);
  }

  async componentDidMount() {

    // Me 정보
    const me = JSON.parse(await SecureStore.getItemAsync('me'));

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

    // 그룹 아이디 state 저장
    this.setState({ groupId });

    // 그룹 상세 정보 요청
    const groupResponse = await groupApi.getGroup(groupId);
    if (groupResponse.ok !== true) {
      Alert.alert('알림', '그룹 정보를 가져오지 못했습니다');
      return
    }

    // 내가 참여하고 있는 그룹 상세 정보
    const group = await groupResponse.json();
    const { Table, GroupMembers, GroupPurchases } = group.data;
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

    // 이 그룹에 내 정보를 가져온다
    const groupMemberMe = GroupMembers.filter(groupMember => groupMember.UserId === me.id);

    // 내 정보가 리더인지 아닌지를 저장한다
    const isLeader = groupMemberMe.length >= 1 && groupMemberMe[0].role === 'leader';

    // 내가 이 그룹에서 결제를 했는지 데이터를 확인한다
    const mePurchaseData = GroupPurchases.filter(purchase => purchase.UserId === me.id)[0];
    const isPurchased = mePurchaseData != null && mePurchaseData.states === 'purchased';

    // 그룹 정보 적용
    this.setState({
      users: GroupMembers.map(item => {

        // 해당 유저의 결제 데이터 확인
        const purchaseData = GroupPurchases.filter(purchase => item.UserId === purchase.UserId)[0];
        const hasPurchaseData = purchaseData != null;

        return {
          key: `${item.id}`,
          isUserPurchased: hasPurchaseData && purchaseData.states === 'purchased',
          ...item
        }
      }),
      menus: shopMenus.data,
      routes: shopMenus.data.map(category => {
        return { key: `${category.id}`, title: category.name }
      }),
      orders: orders.data,
      group: meGroup.data,
      isLeader,
      isPurchased,
      me
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
          {this._renderPriceView()}
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

          {/* 내 주문전송 버튼 -- 현재 진행중인 상태에만 버튼이 보이도록 설정 */}
          {this.state.group && this.state.group.states === 'ongoing' &&
          <View style={styles.sendMyOrderBtn}>
            <TouchableOpacity activeOpacity={0.6} onPress={this._postOrders.bind(this)}>
              <Text style={{ color: '#fff', fontSize: 18 }}>내 주문 전송</Text>
            </TouchableOpacity>
          </View>
          }

          {/* 결제하기 버튼 -- 주문 진행 상태일떄 보일 수 있도록 설정 */}
          {this.state.group && this.state.group.states === 'payment-in-progress' && !this.state.isPurchased &&
          <View style={styles.sendMyOrderBtn}>
            <TouchableOpacity activeOpacity={0.6} onPress={this._purchaseRequest.bind(this)}>
              <Text style={{ color: '#fff', fontSize: 18 }}>결제하기</Text>
            </TouchableOpacity>
          </View>
          }

          {/* 결제 완료 버튼 -- 이미 결제를 완료한 경우 보여지는 버튼 */}
          {this.state.group && this.state.group.states === 'payment-in-progress' && this.state.isPurchased &&
          <View style={styles.sendMyOrderBtn}>
            <TouchableOpacity activeOpacity={0.6}>
              <Text style={{ color: '#fff', fontSize: 18 }}>결제완료</Text>
            </TouchableOpacity>
          </View>
          }

          {/*주문서 버튼*/}
          <View style={styles.orderSheet}>
            <TouchableOpacity
              onPress={() => {
                this.setModalVisibility(!this.state.orderModalVisible);
              }}
              activeOpacity={0.6}>
              <Text style={{ color: '#fff', fontSize: 18 }}>주문서</Text>
            </TouchableOpacity>

            <Modal
              animationType="slide"
              transparent={false}
              visible={this.state.orderModalVisible === true}
              onRequestClose={() => {
              }}>
              <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                <View>

                  {/* 모달 상단부 */}
                  <View style={styles.modalNav}>
                    <TouchableOpacity
                      onPress={() => {
                        this.setModalVisibility(!this.state.orderModalVisible);
                      }}
                      activeOpacity={0.6}
                      style={{ flex: 1 }}>
                      <View>
                        <Image source={require('../../assets/images/ic_cancel.png')}/>
                      </View>
                    </TouchableOpacity>
                    <Text style={styles.orderNavTitle}>주문서</Text>
                    <View style={{ flex: 1 }}/>
                  </View>
                </View>

                {/* 주문서 리스트 */}
                <SheetList orders={this.state.orders} style={{ marginBottom: 110 }}/>

                {/* 상태를 변경하는 버튼 (리더 권한을 가지고 있고 결제 요청 전에만 볼 수 있음) */}
                {this.state.isLeader && this.state.group && this.state.group.states === 'ongoing' &&
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => {
                    this.setChangeOrderStateModalVisibility(!this.state.orderStateModalVisible);
                  }}
                  style={styles.requestOrderBtn}
                >
                  <Text style={styles.requestOrderBtnText}>결제요청</Text>
                </TouchableOpacity>
                }

                {this.state.orderStateModalVisible === true &&
                  <View
                    style={styles.orderStateModalWrapper}
                  >
                    <View style={styles.orderStateBtnWrapper}>
                      <View style={styles.changeOrderStateBtn}>
                        <TouchableOpacity onPress={() => this._requestGroupChangePurchaseType('dutch')}>
                          <Text style={{fontSize: 18}}>내 주문 계산</Text>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.changeOrderStateBtn}>
                        <TouchableOpacity onPress={() => this._requestGroupChangePurchaseType('split')}>
                          <Text style={{fontSize: 18}}>1 / N 계산</Text>
                        </TouchableOpacity>
                      </View>
                      <TouchableOpacity onPress={() => this.setChangeOrderStateModalVisibility(!this.state.orderStateModalVisible)}>
                        <Image style={styles.changeOrderStateBtnCancel} source={require('../../assets/images/ic_cancel_white.png')}/>
                      </TouchableOpacity>
                    </View>
                  </View>
                }
              </SafeAreaView>
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

    return <MenuList onChangeMenuAmount={this._onChangeMenuAmount.bind(this)} menus={menu.Menus}/>
  };

  /**
   * 그룹의 돈 계산 방법에 따라 내가 내야할 금액을 보여주는 뷰를 가져온다
   * @private
   */
  _renderPriceView = () => {
    if (this.state.group) {
      const total = this._orderTotalPrice();
      switch (this.state.group.paymentType) {
        case 'dutch':
          const totalPrice = this.state.orders.filter(order => order.UserId === this.state.me.id)
            .map(order => order.Menu.price)
            .reduce((previousValue, currentValue) => previousValue + currentValue, 0);
          return <View>
            <Text style={styles.priceWrapper}>총 {numberCommaFormat(total)}원 중 내가 주문한 금액
              : {numberCommaFormat(totalPrice, true)}원</Text>
          </View>;

        case 'split':
          const userCount = this.state.users.length;
          return <View>
            <View style={styles.priceWrapper}>
              <Text style={styles.colorWhiteGray}>총 {numberCommaFormat(total)}원</Text>
              <View style={styles.divison}>
                <Image source={require('../../assets/images/ic_division.png')}/>
              </View>
              <Text style={styles.colorWhiteGray}>{userCount}명</Text>
              <View style={styles.divison}>
                <Image source={require('../../assets/images/ic_result.png')}/>
              </View>
              <Text style={styles.totalPrice}>{numberCommaFormat(total / userCount, true)}원</Text>
            </View>
          </View>;
      }
    }

    return <View/>
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

    // 그룹에 상태가 변경 되었을때 (주문중, 결제요청, 완료)
    this.socket.on('update-group-states', (states) => {
      switch (states.data) {
        case 'ongoing':

          break;

        case 'payment-in-progress':

          break;

        case 'archived':
          Alert.alert(
            '알림',
            '모든 사람이 결제했기 때문에 이 그룹은 종료됩니다',
            [
              { text: '예', onPress: () => Actions.reset('welcome') }
            ],
            { cancelable: false }
          );
          break;
      }
      this.setState({ group: { ...this.state.group, states: states.data } });
    });

    // 그룹에 결제 방법이 변경 되었을때
    this.socket.on('update-group-paymentType', (paymentType) => {
      this.setState({ group: { ...this.state.group, paymentType: paymentType.data } });
    });

    // 그룹에 결제 정보가 업데이트 되었을때
    this.socket.on('update-group-purchase', (groupPurchase) => {
      const { data } = groupPurchase;

      const target = this.state.users.filter(user => user.UserId === data.UserId)[0];
      target.isUserPurchased = data.states === 'purchased';

      // 내가 이 그룹에서 결제를 했는지 데이터를 확인한다
      const mePurchaseData = this.state.users.filter(user => user.UserId === this.state.me.id)[0];
      const isPurchased = mePurchaseData != null && mePurchaseData.isUserPurchased;

      this.setState({ users: this.state.users, isPurchased });
    });

    // 방에 접속하면 조인을 요청한다
    this.socket.emit('join-group', { token, groupId });
  }

  /**
   * 메뉴 리스트에서 메뉴 갯수를 조정하였을때 불리는 콜백
   *
   * @param menu 변경된 메뉴 정보
   * @param type [plus, minus]
   * @private
   */
  _onChangeMenuAmount(menu, type) {
    switch (type) {
      case 'plus':
        const value = Object.assign({}, menu);
        delete value.amount;
        this.state.preOrders.push(value);
        this.setState({ preOrders: this.state.preOrders });
        break;

      case 'minus':
        this.state.preOrders.splice(this.state.preOrders.findIndex(preOrder => preOrder.id === menu.id), 1);
        this.setState({ preOrders: this.state.preOrders });
        break;
    }
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

  /**
   * 유저가 추가한 메뉴를 주문 전송한다
   *
   * @returns {Promise<void>}
   * @private
   */
  async _postOrders() {
    if (this.state.preOrders.length === 0) {
      Alert.alert('알림', '추가된 메뉴가 없습니다');
      return
    }

    const orderResponse = await groupApi.postGroupOrders(this.state.groupId, this.state.preOrders.map(preOrder => {
      return {
        MenuId: preOrder.id
      }
    }));

    if (orderResponse.ok !== true) {
      Alert.alert('알림', '주문에 실패하였습니다');
      return
    }

    // 요청 성공 데이터로 뷰 업데이트
    await orderResponse.json();

    // 기존에 유저가 수량을 변경해놓은걸 초기화한다
    const menus = this.state.menus.map(menuCategory => {
      return Object.assign(menuCategory, {
        Menus: menuCategory.Menus.map(menu => {
          return Object.assign(menu, { amount: 0 });
        })
      })
    });

    // 한번에 업데이트가 되지 않는 문제로 menus 를 state 에서 빈 어레이로 변경했다가 다시 값을 집어 넣는다
    this.setState({ menus: [], preOrders: [] });
    this.setState({ menus })
  }

  /**
   * 그룹의 상태를 변경할거냐는 Alert을 보여준다
   * @returns {Promise<void>}
   * @private
   */
  async _requestGroupToProgressInPurchase() {
    Alert.alert(
      '알림',
      '정말로 결제 요청 상태로 변경하시겠습니까?\n더 이상 결제 방식 변경과, 주문을 추가할 수 없습니다',
      [
        { text: '아니요', onPress: () => console.log('Canceled'), style: 'cancel' },
        { text: '예', onPress: () => this._groupToProgressInPurchase() }
      ],
      { cancelable: false }
    )
  }

  /**
   * 그룹을 결제 상태로 변경한다
   *
   * @returns {Promise<void>}
   * @private
   */
  async _groupToProgressInPurchase() {
    const changeResponse = await groupApi.changeGroupToPurchas(this.state.groupId);
    if (changeResponse.ok !== true) {
      Alert.alert('알림', '상태 변경에 실패하였습니다');
      return
    }
  }

  /**
   * 그룹 결제 방식 변경 Alert
   *
   * @param paymentType 결제 방식
   * @returns {Promise<void>}
   * @private
   */
  async _requestGroupChangePurchaseType(paymentType) {
    Alert.alert(
      '알림',
      '결제 방법을 변경하시겠습니까?',
      [
        { text: '아니요', onPress: () => console.log('Canceled'), style: 'cancel' },
        { text: '예', onPress: () => this._groupChangePurchaseType(paymentType) }
      ],
      { cancelable: false }
    );
  }

  /**
   * 그룹 결제 방식 변경
   *
   * @param paymentType 결제 방식
   * @returns {Promise<void>}
   * @private
   */
  async _groupChangePurchaseType(paymentType) {
    let response;

    // 모달을 닫아준다
    this.setChangeOrderStateModalVisibility(!this.state.orderStateModalVisible);
    this.setModalVisibility(!this.state.orderModalVisible);

    switch (paymentType) {
      case 'split':
        response = await groupApi.changeGroupPurchaseTypeToSplit(this.state.groupId);
        break;

      case 'dutch':
        response = await groupApi.changeGroupPurchaseTypeToDutch(this.state.groupId);
        break;
    }

    if (!response || response.ok !== true) {
      Alert.alert('알림', '결제 방법 변경에 실패하였습니다');
      return;
    }

    this._groupToProgressInPurchase();
  }

  /**
   * 결제 하기 요청
   *
   * @returns {Promise<void>}
   * @private
   */
  async _purchaseRequest() {
    Alert.alert(
      '알림',
      '정말로 결제하시겠습니까?',
      [
        {
          text: '아니요',
          style: 'cancel',
          onPress: () => {
          }
        },
        { text: '예', onPress: () => this._purchase() }
      ],
      { cancelable: false }
    );
  }

  /**
   * 결제
   *
   * @returns {Promise<void>}
   * @private
   */
  async _purchase() {
    await groupApi.purchase(this.state.groupId);
  }

  /**
   * 주문하기 모달 Visibility 변경
   *
   * @param visible
   */
  setModalVisibility(visible) {
    this.setState({ orderModalVisible: visible });
  }

  /**
   * 주문하기 결제방식 모달 변경
   *
   */

  setChangeOrderStateModalVisibility(visible) {
    this.setState({ orderStateModalVisible: visible });
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
  priceWrapper: {
    flexDirection: 'row',
    textAlign: 'right',
    justifyContent: 'flex-end',
    fontSize: 13,
    color: '#fff',
  },
  priceText: {
    color: '#FFFFFF',
    opacity: 0.8,
    textAlign: 'right'
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
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 36,
    paddingRight: 36,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  orderNavTitle: {
    flex: 2, textAlign: 'center', fontSize: 18
  },
  requestOrderBtn: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 24,
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
  divison: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  totalPrice: {
    color: '#FFF662',
    fontSize: 14,
  },
  colorWhiteGray: {
    color: '#fff',
    opacity: 0.8,
    fontSize: 14,
  },
  orderStateBtnWrapper: {
    position: 'absolute', left: 0, right: 0,
    alignItems: 'center',
    bottom: 70,
  },
  changeOrderStateBtn: {
    padding: 10,
    paddingLeft: 30,
    paddingRight: 30,
    marginTop: 25,
    textAlign: 'center',
    backgroundColor: '#fff',
    borderColor: '#fff',
    borderWidth: 5,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeOrderStateBtnCancel: {
    marginTop: 25,
  },
  orderStateModalWrapper: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  }
});
