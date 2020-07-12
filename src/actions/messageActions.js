import {SET_MESSAGE, SET_IS_TYPING, SET_CHOSEN_FILES} from './actionTypes'

export const setMessage = (message)=>({
  type: SET_MESSAGE,
  payload: message
})

export const setIsTyping = (isTyping)=>({
  type: SET_IS_TYPING,
  payload: isTyping
})

export const setChosenFiles = (files)=>({
  type: SET_CHOSEN_FILES,
  payload: files
})