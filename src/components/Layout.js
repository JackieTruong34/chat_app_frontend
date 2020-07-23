import React, { useEffect } from 'react'
import io from 'socket.io-client'
import { VERIFY_USER } from '../Events'
import ChatContainer from './ChatContainer'
import LoginSignupTabs from './LoginSignupTabs'

// import dispatch, selector
import { useDispatch, useSelector, useStore } from 'react-redux'
import { setSocket } from '../actions/socketActions' // import set socket function
import { setUser } from '../actions/userActions'
// port 3001: server
// port 3000: reactjs
// const socketURL = "http://192.168.1.86:3001"
// const socketURL = "http://192.168.0.56:3001"
const socketURL = "http://localhost:3001"
const Layout = (props) => {
  const dispatch = useDispatch()
  const store = useStore()
  const user = useSelector(state => state.userReducer.user)
  // console.log('state: ', store.getState())

  // component will mount
  useEffect(() => {
    const socket = io(socketURL)
    socket.on('connect', () => {
      console.log('user?: ', !store.getState().userReducer.user)
      if (!store.getState().userReducer.user) {
        reconnect(socket)
      } else {
        console.log('Socket connected!')
      }
      

    })
    dispatch(setSocket(socket))
  }, [])

  var reconnect = (socket) => {
    socket.emit(VERIFY_USER, user.name, ({ isUserOnline, user, error }) => {
      if (isUserOnline) {
        dispatch(setUser({}))
      } else {
        dispatch(setUser(user))
      }
    })
  }

  return (
    <div className="contaienr">
      {JSON.stringify(user) === '{}' ? (
        <div>
          <LoginSignupTabs />
        </div>

      ) : <ChatContainer />}
    </div>
  )
}

export default Layout