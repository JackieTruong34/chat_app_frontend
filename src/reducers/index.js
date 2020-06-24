import {combineReducers} from 'redux'
// import reducer
import socketReducer from './socketReducer'
import userReducer from './userReducer'
import chatReducer from './chatReducer'
import messageReducer from './messageReducer'

export default combineReducers({
  socketReducer,
  userReducer,
  chatReducer,
  // messageReducer,
})