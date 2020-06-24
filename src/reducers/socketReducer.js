import {SET_SOCKET} from '../actions/actionTypes'

const initState = {
  socket: null
}

const socketReducer = (state = initState, action)=>{
  switch(action.type){
    case SET_SOCKET:
      state.socket = action.payload
      return {...state, socket: state.socket}
    default:
      return state
  }
}

export default socketReducer