import {SET_USER, SET_NICKNAME, LOG_OUT, SET_USER_LIST, SET_RECEIVER} from './actionTypes'

export const setUser = (user)=>({
  type: SET_USER,
  payload: user
})

export const setNickname = (nickname)=>({
  type: SET_NICKNAME,
  payload: nickname
})

export const logout = ()=>({
  type: LOG_OUT
})

export const setUserList = (userList)=>({
  type: SET_USER_LIST,
  payload: userList
})

export const setReceiver = (receiver)=>({
  type: SET_RECEIVER,
  payload: receiver
})