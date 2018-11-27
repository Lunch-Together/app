import React from 'react'
import { StyleSheet, Text, View } from "react-native";
import { BarCodeScanner, Permissions } from 'expo';

export default class QRScanner extends React.Component {

  state = {
    hasCameraPermission: null,
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
          onBarCodeScanned={this.handleBarCodeScanned}
          style={StyleSheet.absoluteFill}/>
      </View>
    );
  }

  handleBarCodeScanned = ({ type, data }) => {
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  }

}
