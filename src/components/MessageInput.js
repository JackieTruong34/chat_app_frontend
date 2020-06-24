import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Input from '@material-ui/core/Input'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'

import { useSelector } from 'react-redux'
import { MESSAGE_SENT, TYPING } from '../Events'

const useStyles = makeStyles(() => ({
  messageInputContainer: {
    position: 'absolute',
    bottom: 0,
    height: '48px',
    width: '95%',
    margin: '1vh 1vw',
    backgroundColor: 'white'
  }
}))

var lastUpdateTime, typingInterval

const MessageInput = (props) => {
  const classes = useStyles()
  const [message, setMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const socket = useSelector(state => state.socketReducer.socket)
  const activeChat = useSelector(state => state.chatReducer.activeChat)

  var sendMessage = (chatId, message) => {
    socket.emit(MESSAGE_SENT, { chatId, message })
  }

  var sendTyping = (chatId, isTyping) => {
    socket.emit(TYPING, { chatId, isTyping })
  }

  var handleSubmit = (e) => {
    e.preventDefault()
    sendMessage(activeChat.id, message)
    setMessage("")

  }

  var typing = () => {
    lastUpdateTime = Date.now()
    if (!isTyping) {
      setIsTyping(true)
      sendTyping(activeChat.id, true)
      startCheckingTyping()
    }
  }

  var startCheckingTyping = () => {
    typingInterval = setInterval(() => {
      if ((Date.now() - lastUpdateTime) > 500) {
        setIsTyping(false)
        stopCheckingTyping()
      }
    })
  }

  var stopCheckingTyping = () => {
    if (typingInterval) {
      clearInterval(typingInterval)
      sendTyping(activeChat.id, false)
    }
  }

  return (
    <div className={classes.messageInputContainer}>
      <form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container wrap="nowrap" spacing={2}>
          <Grid item xs={11}>
            <Input
              id="input"
              placeholder="Enter your message..."
              fullwidth="true"
              disableUnderline={true}
              value={message}
              style={{ backgroundColor: 'rgba(0, 0, 0, .04)', borderRadius: '18px', width: "100%", padding: '1vh' }}
              onKeyUp={(e) => { e.keyCode !== 13 && typing() }}
              onChange={(e) => { setMessage(e.target.value) }}
            />
          </Grid>
          <Grid item xs={1}>
            <Button color="secondary" disabled={message.length < 1} type="submit" size="small">Send</Button>
          </Grid>

        </Grid>
      </form>

    </div>
  )
}

export default MessageInput