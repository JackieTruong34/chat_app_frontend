import React, { useEffect } from 'react'
// import custom components
import Sidebar from './Sidebar'
import ActiveUserList from './ActiveUserList'
import { COMMUNITY_CHAT, MESSAGE_RECEIVED, TYPING, PRIVATE_CHAT, USER_CONNECTED, USER_DISCONNECTED, NEW_CHAT_USER, ACTIVE_CHAT } from '../Events'
import ChatHeading from './ChatHeading'
import Messages from './Messages'
import MessageInput from './MessageInput'
import Grid from '@material-ui/core/Grid'

import { useDispatch, useSelector, useStore } from 'react-redux'
import { setUserList } from '../actions/userActions'
import { setChats, setActiveChat } from '../actions/chatActions'
import { SET_ACTIVE_CHAT } from '../actions/actionTypes'

const ChatContainer = () => {
  const socket = useSelector(state => state.socketReducer.socket)
  const user = useSelector(state => state.userReducer.user)
  const chats = useSelector(state => state.chatReducer.chats)
  const activeChat = useSelector(state => state.chatReducer.activeChat)
  const store = useStore()
  const dispatch = useDispatch()

  console.log('active chat: ', activeChat)

  // componentDidMount()
  useEffect(() => {
    initSocket(socket)
  }, [])

  var initSocket = (socket) => {
    // socket.emit(COMMUNITY_CHAT, resetChat)
    // listen on private message namespace
    socket.on(PRIVATE_CHAT, addChat)
    // socket.on(ACTIVE_CHAT, (chat)=>{
    //   dispatch(setActiveChat(chat))

    // })
    // socket.once('connect', () => {
    //   socket.emit(COMMUNITY_CHAT, resetChat)
    // })

    // listen on event when user is connected
    socket.on(USER_CONNECTED, (connectedUsers) => {
      dispatch(setUserList([]))
      for (let key in connectedUsers) {
        const newUserList = [...store.getState().userReducer.userList, connectedUsers[key]]
        dispatch(setUserList(newUserList))
      }
    })

    // listen on event when user is disconnected
    socket.on(USER_DISCONNECTED, (connectedUsers) => {
      dispatch(setUserList([]))
      for (let key in connectedUsers) {
        const newUserList = [...store.getState().userReducer.userList, connectedUsers[key]]
        dispatch(setUserList(newUserList))
      }
    })

    socket.on(NEW_CHAT_USER, addUserToChat)
  }

  // Adds chat to the chat container, if reset is true removes all chats
  // and sets that chat to the main chat.
  // Sets the message and typing socket events for the chat.
  // the chat parameter here is the result of the callback function createChat() in the socketManager
  var resetChat = (chat) => {
    return addChat(chat, true)
  }

  var addChat = (chat, reset = false) => {
    const newChats = reset ? [chat] : [...store.getState().chatReducer.chats, chat]

    dispatch(setChats(newChats))
    
    const messageEvent = `${MESSAGE_RECEIVED}-${chat._id}`
    const typingEvent = `${TYPING}-${chat._id}`

    // receive message event from messageEvent namespace
    socket.on(messageEvent, receiveMessage(chat._id))

    // receive typing event from typingEvent namespace
    socket.on(typingEvent, receiveTyping(chat._id))

  }

  var receiveMessage = (chatId) => {
    return (message) => {
      var newChats = store.getState().chatReducer.chats.map((chat) => {
        // only append messages array of an active chat
        if (chat._id === chatId) {
          chat.messages.push(message)
          if(store.getState().chatReducer.activeChat){
            if(chat._id !== store.getState().chatReducer.activeChat._id){
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
    console.log('newUser: ', newUser.map(user => {return user.name}))
    const newChats = store.getState().chatReducer.chats.map(chat => {
      if (chat._id === chatId) {
        // Object.assign({}, store.getState().chatReducer.activeChat, { name: store.getState().chatReducer.activeChat.users.concat(newUser).join(", "), users: store.getState().chatReducer.activeChat.users.concat(newUser) })
        if(store.getState().chatReducer.activeChat){
          if(chat._id === store.getState().chatReducer.activeChat._id){
            dispatch(setActiveChat(Object.assign({}, chat, { name: chat.name.concat(newUser.map(user => {return `, ${user.name}`})), users: chat.users.concat(newUser.map(user => {return user._id})) })))
          }
        }
        
        return Object.assign({}, chat, { name: chat.name.concat(newUser.map(user => {return `, ${user.name}`})), users: chat.users.concat(newUser.map(user => {return user._id})) })
      }
      return chat
    })
    console.log('newChats: ', newChats)
    dispatch(setChats(newChats))
  }


  // remove users from chat
  var removeUsersFromChat = (removeUsers) => {
    const newChats = chats.map(chat => {
      let newUsers = chat.users.filter(user => !removeUsers.includes(user))
      return Object.assign({}, chat, { users: newUsers })
    })
    dispatch(setChats(newChats))
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