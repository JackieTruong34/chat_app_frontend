import React, { useEffect } from 'react'
// import custom components
import Sidebar from './Sidebar'
import ActiveUserList from './ActiveUserList'
import Grid from '@material-ui/core/Grid'
import { MESSAGE_RECEIVED, TYPING, PRIVATE_CHAT, USER_CONNECTED, USER_DISCONNECTED, NEW_CHAT_USER, DELETE_CHAT, CHANGE_CHAT_NAME, LEAVE_GROUP } from '../Events'
import ChatHeading from './ChatHeading'
import Messages from './Messages'
import MessageInput from './MessageInput'

import { useDispatch, useSelector, useStore } from 'react-redux'
import { setUserList, } from '../actions/userActions'
import { setChats, setActiveChat } from '../actions/chatActions'

const ChatContainer = () => {
  const socket = useSelector(state => state.socketReducer.socket)
  const user = useSelector(state => state.userReducer.user)
  const chats = useSelector(state => state.chatReducer.chats)
  const activeChat = useSelector(state => state.chatReducer.activeChat)
  const store = useStore()
  const dispatch = useDispatch()

  // componentDidMount()
  useEffect(() => {
    initSocket(socket)

  }, [])

  // componentWillUnmount()
  // useEffect(()=>{
  //   return () => {
  //     socket.off(USER_DISCONNECTED)
  //   }

  // }, [])


  var initSocket = (socket) => {
    socket.on(PRIVATE_CHAT, addChat)

    socket.on(DELETE_CHAT, deleteChat)

    // listen on event when user is connected
    socket.on(USER_CONNECTED, (arrayConnectedUsers) => {
      dispatch(setUserList(arrayConnectedUsers))

    })

    // listen on event when user is disconnected
    socket.on(USER_DISCONNECTED, (arrayConnectedUsers) => {
      dispatch(setUserList(arrayConnectedUsers))

      // if(userName === user.name){
      //   dispatch(setChats([]))
      //   dispatch(setActiveChat(null))
      // }

      // socket.off(PRIVATE_CHAT)

    })

    socket.on(NEW_CHAT_USER, addUserToChat)

    socket.on(CHANGE_CHAT_NAME, changeChatName)

    socket.on(LEAVE_GROUP, leaveGroup)
  }

  var addChat = (chat) => {
    const newChats = [...store.getState().chatReducer.chats, chat]
    dispatch(setChats(newChats))

    const messageEvent = `${MESSAGE_RECEIVED}-${chat._id}`
    const typingEvent = `${TYPING}-${chat._id}`

    // receive message event from messageEvent namespace
    socket.on(messageEvent, receiveMessage(chat._id))

    // receive typing event from typingEvent namespace
    socket.on(typingEvent, receiveTyping(chat._id))

  }

  var receiveMessage = (chatId) => {
    return ({ message }) => {
      console.log('message: ', message)
      var newChats = store.getState().chatReducer.chats.map((chat) => {
        // only append messages array of an active chat
        if (chat._id === chatId) {
          chat.messages.push(message)
          if (store.getState().chatReducer.activeChat) {
            if (chat._id !== store.getState().chatReducer.activeChat._id) {
              chat.hasNewMessages = true
            }
          } else {
            chat.hasNewMessages = true
          }
        }
        return chat
      })
      dispatch(setChats(newChats))

    }
  }

  var receiveTyping = (chatId) => {
    return ({ sender, isTyping }) => {
      // only show the "user is typing" for the client that is not the sender
      if (sender.name !== user.name) {
        var newChats = store.getState().chatReducer.chats.map((chat) => {
          if (chat._id === chatId) {
            // typingUser = [] (initiate)

            // Scenasrio 1: user is typing
            // active chat checks if the user is in typingUser array or not
            // if not, then active chat push user into the array

            // Scenerio 2: user is not typing
            // Remove objects that is current user and reassigns the active chat's typingUser array

            if (isTyping && !chat.typingUsers.includes(sender.name)) {
              chat.typingUsers.push(sender.name)
            } else if (!isTyping && chat.typingUsers.includes(sender.name)) {
              var index = chat.typingUsers.indexOf(sender.name)
              if (index !== -1) chat.typingUsers.splice(index, 1)
              // chat.typingUsers = chat.typingUsers.filter(name => name !== sender.name)
            }
          }
          return chat
        })
        dispatch(setChats(newChats))
      }
    }
  }

  var addUserToChat = ({ chatId, newUser }) => {
    const newChats = store.getState().chatReducer.chats.map(chat => {
      if (chat._id === chatId) {
        // Object.assign({}, store.getState().chatReducer.activeChat, { name: store.getState().chatReducer.activeChat.users.concat(newUser).join(", "), users: store.getState().chatReducer.activeChat.users.concat(newUser) })
        if (store.getState().chatReducer.activeChat) {
          if (chat._id === store.getState().chatReducer.activeChat._id) {
            dispatch(setActiveChat(Object.assign({}, chat, { users: chat.users.concat(newUser.map(user => { return user._id })) })))
          }
        }

        return Object.assign({}, chat, { users: chat.users.concat(newUser.map(user => { return user._id })) })
      }
      return chat
    })
    dispatch(setChats(newChats))
  }

  var changeChatName = ({ chatId, newChatName }) => {
    const newChats = store.getState().chatReducer.chats.map(chat => {
      if (chat._id === chatId) {
        if (store.getState().chatReducer.activeChat) {
          if (chat._id === store.getState().chatReducer.activeChat._id) {
            dispatch(setActiveChat(Object.assign({}, chat, { name: newChatName })))
          }
        }
        return Object.assign({}, chat, { name: newChatName })
      }
      return chat
    })
    dispatch(setChats(newChats))
  }

  var leaveGroup = ({ chat, isSender }) => {
    if (isSender === false) {
      const newChats = store.getState().chatReducer.chats.map(item => {
        if (item._id === chat._id) {

          if (store.getState().chatReducer.activeChat) {
            if (item._id === store.getState().chatReducer.activeChat._id) {
              dispatch(setActiveChat(Object.assign({}, item, { users: chat.users })))
            }
          }

          return Object.assign({}, item, { users: chat.users })
        }

        return item
      })

      dispatch(setChats(newChats))
    } else if (isSender === true) {
      var newChats = store.getState().chatReducer.chats.filter(item => {
        return item._id !== chat._id
      })
      dispatch(setActiveChat(null))
      dispatch(setChats(newChats))
      socket.off(`${MESSAGE_RECEIVED}-${chat._id}`)
    }

  }

  var deleteChat = (chat) => {
    const newChats = store.getState().chatReducer.chats.filter(object => object._id !== chat._id)
    dispatch(setChats(newChats))
    dispatch(setActiveChat(null))
  }


  // render component
  return (
    <div className="container" style={{ height: '100%' }}>
      <Grid container>
        <Grid item xs={3}>
          <Sidebar />
        </Grid>
        <Grid item xs>
          {
            store.getState().chatReducer.activeChat !== null ? (
              <div className="chat-room" style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
                {/* display chat dialouge part (messages in an active chat) */}
                <ChatHeading />
                <Messages />
                <MessageInput />
              </div>
            ) : (<div className="chat-room choose">
              <h3>Welcome to our chat application!</h3>
            </div>)
          }
        </Grid>
        <Grid item xs={2}>
          <ActiveUserList />
        </Grid>
      </Grid>
    </div>
  )
}

export default ChatContainer