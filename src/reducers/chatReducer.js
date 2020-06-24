import {SET_CHAT, SET_ACTIVE_CHAT} from '../actions/actionTypes'

const initState = {
  chats: [],
  activeChat: null,
}

const chatReducer = (state = initState, action)=>{
  switch(action.type){
    case SET_CHAT:
      state.chats = action.payload
      return {...state, chats: state.chats}
    case SET_ACTIVE_CHAT:
      state.activeChat = action.payload
      return {...state, activeChat: state.activeChat}
    default:
      return state
  }
} 

export default chatReducer