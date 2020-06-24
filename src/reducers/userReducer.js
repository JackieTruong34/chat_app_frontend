import {SET_USER, SET_NICKNAME, LOG_OUT, SET_USER_LIST, SET_RECEIVER} from '../actions/actionTypes'

const initState = {
  user: {},
  nickname: "",
  userList: [],
  receiver: ""
}

const userReducer = (state = initState, action)=>{
  switch(action.type){
    case SET_USER:
      state.user = action.payload
      return {...state, user: state.user}

    case SET_NICKNAME:
      state.nickname = action.payload
      return {...state, nickname: state.nickname}

    case LOG_OUT:
      state.user = {}
      return {...state, user: state.user}

    case SET_USER_LIST:
      state.userList = action.payload
      return {...state, userList: state.userList}

    case SET_RECEIVER:
      state.receiver = action.payload
      return {...state, receiver: state.receiver}
      
    default:
      return state
  }
}



export default userReducer