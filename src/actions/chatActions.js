import {SET_CHAT, SET_ACTIVE_CHAT} from './actionTypes'

export const setChats = (chat)=>({
  type: SET_CHAT,
  payload: chat
})

export const setActiveChat = (chat)=>({
  type: SET_ACTIVE_CHAT,
  payload: chat
})