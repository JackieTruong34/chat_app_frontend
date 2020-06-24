import {SET_MESSAGE, SET_IS_TYPING} from '../actions/actionTypes'

const initState = {
  message: "",
  isTyping: false
}

const messageReducer = (state = initState, action)=>{
  switch(action.type){
    case SET_MESSAGE: 
      state.message = action.payload
      return {...state, message: state.message}
    case SET_IS_TYPING:
      state.isTyping = action.payload
      return {...state, isTyping: state.isTyping}
    default:
      return state
  }
}

export default messageReducer