/**
 * Created by uran on 04/11/2018.
 */
import React from 'react'
import { Router, Scene } from 'react-native-router-flux'
import Login from './src/components/Login.js'
import Register from './src/components/Register'

const Routes = () => (
  <Router>
    <Scene key="root">
      <Scene key="login" component={Login} title="Login" initial={true}/>
      <Scene key = "register" component = {Register} title = "Register" />
    </Scene>
  </Router>
)
export default Routes
