import React from 'react'
import { Alert, StyleSheet, Text, View } from "react-native";
import { BarCodeScanner, Permissions } from 'expo';
import * as groupApi from '../../api/groups';
import { Actions } from "react-native-router-flux";

export default class QRScanner extends React.Component {

  state = {
    hasCameraPermission: null,
    isScanned: false
  };

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  render() {
    const { hasCameraPermission } = this.state;

    if (hasCameraPermission === null) {
      return <Text>카메라 권한을 요청합니다</Text>;
    }
    if (hasCameraPermission === false) {
      return <Text>
        카메라 사용 권한이 없습니다
        해당 기능은 카메라 권한이 있어야 사용 가능합니다
      </Text>;
    }
    return (
      <View style={{ flex: 1 }}>
        <BarCodeScanner
          onBarCodeScanned={this.handleBarCodeScanned.bind(this)}
          style={StyleSheet.absoluteFill}/>
      </View>
    );
  }

  handleBarCodeScanned = async ({ type, data }) => {
    if (this.state.isScanned) return;

    const regex = /(ltogether:\/\/tables)\/([0-9]+)/;
    const matchValues = data.match(regex);

    if (matchValues.length >= 3) {
      if (matchValues[1] === 'ltogether://tables') {

        // 스캔 성공으로 상태를 업데이트 해서 더이상 스캔 완료 요청이 들어오지 않도록 변경
        this.setState({ isScanned: true });

        // 테이블 정보
        const tableId = matchValues[2];

        // 테이블 아이디로 그룹을 찾는 API 요청
        const findGroupResponse = await groupApi.getGroups(JSON.stringify({
          TableId: tableId,
          states: ['ongoing', 'payment-in-progress']
        }));

        // 그룹을 찾는 API 호출 자체를 실패했을때 에러 발생
        if (findGroupResponse.ok !== true) {
          Alert.alert('알림', '그룹에 참여하지 못했습니다 다시 시도해주세요');
          this.setState({ isScanned: false });
          return
        }

        // 찾아진 그룹 정보
        const foundGroups = (await findGroupResponse.json()).data;

        // 해당 테이블에 그룹이 없을 경우 그룹을 생성한다
        if (foundGroups.length === 0) {
          const createGroupResponse = await groupApi.createGroup(tableId);

          // 그룹 생성에 실패했을때 에러 발생
          if (createGroupResponse.ok !== true) {
            const body = await response.json();
            Alert.alert('알림', body.message);
            this.setState({ isScanned: false });
            return
          }

          // 그룹 생성에 성공 했을때 찾아진 그룹 정보에 가입된 그룹 데이터를 추가한다
          foundGroups.push((await createGroupResponse.json()).data)
        }

        // 마지막 그룹 정보에 해당하는 데이터로 조인 시킨다
        const group = foundGroups[0];
        const joinResponse = await groupApi.joinGroup(group.id);
        if (joinResponse.ok !== true) {
          const body = await joinResponse.json();
          Alert.alert('알림', body.message);
          this.setState({ isScanned: false });
        } else {
          // 그룹 조인에 성공 하면 Welcome 페이지로 넘겨준다
          Actions.reset('welcome')
        }
      }
    }
  };
}
