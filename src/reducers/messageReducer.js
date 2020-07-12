import {SET_MESSAGE, SET_IS_TYPING, SET_CHOSEN_FILES} from '../actions/actionTypes'

const initState = {
  message: "",
  isTyping: false,
  chosenFiles: []
}

const messageReducer = (state = initState, action)=>{
  switch(action.type){
    case SET_MESSAGE: 
      state.message = action.payload
      return {...state, message: state.message}
    case SET_IS_TYPING:
      state.isTyping = action.payload
      return {...state, isTyping: state.isTyping}
    case SET_CHOSEN_FILES:
      state.chosenFiles = action.payload
      return {...state, chosenFiles: state.chosenFiles}
    default:
      return state
  }
}

export default messageReducer