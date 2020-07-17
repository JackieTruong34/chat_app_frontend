import React, { forwardRef, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Avatar from '@material-ui/core/Avatar'
import AvatarGroup from '@material-ui/lab/AvatarGroup'
import Tooltip from '@material-ui/core/Tooltip'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'

import { useSelector } from 'react-redux'
import { USERS_IN_CHAT } from '../Events'
const useStyles = makeStyles(() => ({
  root: {
    backgroundColor: 'white',
    borderRadius: '4px',
    padding: '10px',
    width: '400px',
    minHeight: '25vh'
  }
}))

const ActiveChatDetail = () => {
  const classes = useStyles()
  const activeChat = useSelector(state => state.chatReducer.activeChat)
  const socket = useSelector(state => state.socketReducer.socket)

  const [usersInChat, setUsersInChat] = useState([])
  React.useEffect(() => {
    socket.on(USERS_IN_CHAT, ({ usersInChat }) => {
      setUsersInChat(usersInChat)
    })
    return () => {
      socket.off(USERS_IN_CHAT) // prevent getting memory leak in react hook
    }
  }, [])


  return (
    <div className={classes.root}>
      {activeChat ? (
        <div>
          <div className="active-chat-detail-header" style={{ borderBottom: '1px solid lightgrey', padding: '16px 14px' }}>
            <Avatar style={{ margin: 'auto', width: 80, height: 80, backgroundColor: activeChat.representPhoto }}>{activeChat.name[0].toUpperCase()}</Avatar>
            <h2 style={{ textAlign: 'center' }}>{activeChat.name}</h2>
          </div>
          <div className="active-chat-detail-member">
            <h4 style={{ textAlign: 'left' }}>People: </h4>

            {usersInChat ? (
              <List className="user-list-container" style={{ maxHeight: 300, overflow: 'auto', position: 'relative' }}>
                {usersInChat.map(user => {
                  return (
                    <ListItem key={user._id}>
                      <ListItemIcon>
                        <Avatar style={{ backgroundColor: user.representPhoto }}>{user.name[0].toUpperCase()}</Avatar>

                      </ListItemIcon>
                      <ListItemText>{user.name}</ListItemText>
                    </ListItem>

                  )
                })}
              </List>

            ) : null}


          </div>
        </div>
      ) : null}

    </div>
  )
}

export default forwardRef(ActiveChatDetail)