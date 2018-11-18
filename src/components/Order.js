/**
 * Created by uran on 08/11/2018.
 */
import React from 'react'
import {
  TouchableOpacity,
  Text,
  View,
  TextInput,
  ScrollView,
  FlatList,
  StyleSheet
} from 'react-native'
import { Actions } from 'react-native-router-flux'
import AppButton from './AppButton'


const Order = () => {

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <ScrollView
          contentContainerStyle={{ flex: 1}}
          horizontal= {true}
        >
          {/*<FlatList*/}
            {/*data={[*/}
              {/*{img: '', name: '우란'},*/}
              {/*{img: '', name: '서강준'},*/}
              {/*{img: '', name: '다블리'},*/}
              {/*{img: '', name: '나연'},*/}
              {/*{img: '', name: '혜'},*/}
              {/*{img: '', name: '지밀턴'},*/}
              {/*{img: '', name: '지미'},*/}
              {/*{img: '', name: '당근케이크'},*/}
            {/*]}*/}
            {/*renderItem={({item}) =>*/}
              {/*<Text style={styles.item}>{item.name}</Text>*/}
            {/*}*/}
          />
        </ScrollView>
      </View>
    </View>
  )
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
});

export default Order