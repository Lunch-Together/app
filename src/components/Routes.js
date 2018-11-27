/**
 * Created by uran on 04/11/2018.
 */
import React from 'react'
import { ActionConst, Router, Scene } from 'react-native-router-flux'
import Login from './login/Login.js'
import Register from './register/Register'
import Home from './home/Home'
import Order from './order/Order'
import QRScanner from "./scanner/QRScanner";
import LocalLogin from "./login/local/LocalLogin";
import Welcome from "./welcome/Welcome";

const Routes = () => (
  <Router>
    <Scene key="root">
      <Scene key="welcome" component={Welcome} title="welcome" initial={true} hideNavBar={true}/>
      <Scene key="login" component={Login} title="로그인"/>
      <Scene key="register" component={Register} title="회원가입"/>
      <Scene key="home" component={Home} title="런치투게더" type={ActionConst.RESET}/>
      <Scene key="order" component={Order} title="런치투게더"/>
      <Scene key="qrScan" component={QRScanner} title="스캔"/>
      <Scene key="localLogin" component={LocalLogin} title="런치투게더"/>
    </Scene>
  </Router>
);
export default Routes
