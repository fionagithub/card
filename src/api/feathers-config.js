import 'babel-polyfill'
import feathers from 'feathers'
import hooks from 'feathers-hooks'
import auth from 'feathers-authentication-client'
import socketio from 'feathers-socketio'
import io from 'socket.io-client'
import feathersVuex from 'feathers-vuex'
import store from '../config/store'
const API_HOST ='http://api-beta.laputacloud.com'
//const API_HOST = process.env.NODE_ENV === 'development' ? 'http://192.168.123.240:3033' : window.location.origin.replace(/:\/\/m\./g, '://api-beta.')
const socket = io(API_HOST, {
  transports: ['websocket']
})
const feathersClient = feathers()
  .configure(hooks())
  .configure(socketio(socket, {
    timeout: 5000
  }))
  .configure(auth({
    storage: window.localStorage,
    // timeout:2500
  }))
  .configure(feathersVuex(store, {
    auth: {
      userService: '/users'
    },
    _test:true
  }))

feathersClient.service('/tickets')
feathersClient.service('/devices')

feathersClient.service('/metadata')
feathersClient.service('/feedback')

feathersClient.hooks({
  error(hook) {
  //  console.log('-er--', hook)
    store.state._error = hook
  },
  after(hook){
    store.state._error=null
   // console.log('-af--', hook)
     store.state.global_err_tips= {
        isFlag: false,
        loginUri: null,
        tips: null,
      }

  }
})

export default feathersClient
