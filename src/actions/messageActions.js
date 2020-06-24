import {SET_MESSAGE, SET_IS_TYPING} from './actionTypes'

export const setMessage = (message)=>({
  type: SET_MESSAGE,
  payload: message
})

export const setIsTyping = (isTyping)=>({
  type: SET_IS_TYPING,
  payload: isTyping
})