import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Input from '@material-ui/core/Input'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Picker from 'emoji-picker-react'
import IconButton from '@material-ui/core/IconButton'
import Popover from '@material-ui/core/Popover'

import EmojiEmotionsOutlinedIcon from '@material-ui/icons/EmojiEmotionsOutlined'
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
  const [chosenEmoji, setChosenEmoji] = useState(null)
  const [anchorEl, setAnchorEl] = useState(null);

  const socket = useSelector(state => state.socketReducer.socket)
  const activeChat = useSelector(state => state.chatReducer.activeChat)

  var sendMessage = (chatId, message) => {
    socket.emit(MESSAGE_SENT, { chatId, message })
  }

  var sendTyping = (chatId, isTyping) => {
    socket.emit(TYPING, { chatId, isTyping })
  }

  var handleOnChange = (e) => {
    // var message = chosenEmoji? (e.target.value + chosenEmoji): (e.target.value)
    // console.log('your mess: ', message)
    setMessage(e.target.value)
  }

  var handleOnEmojiClick = (event, emojiObject) => {
    let sym = emojiObject.unified.split('-')
    let codesArray = []
    sym.forEach(el => codesArray.push('0x' + el))
    let emoji = String.fromCodePoint(...codesArray)
    setChosenEmoji(emojiObject)
    setMessage(message + emoji)
    console.log('Your mess: ', message + emoji)
  }

  var handleSubmit = (e) => {
    e.preventDefault()
    sendMessage(activeChat._id, message)
    setMessage("")

  }

  var typing = () => {
    lastUpdateTime = Date.now()
    if (!isTyping) {
      setIsTyping(true)
      sendTyping(activeChat._id, true)
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
      sendTyping(activeChat._id, false)
    }
  }

  return (
    <div className={classes.messageInputContainer}>
      <form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container wrap="nowrap" spacing={2}>
          <Grid item xs={11}>
            <div className="input-container" style={{ backgroundColor: 'rgba(0, 0, 0, .04)', borderRadius: '18px', width: "100%", padding: '1vh' }}>
              <Grid container spacing={3}>
                <Grid item xs={11}>
                  <Input
                    id="input"
                    placeholder="Enter your message..."
                    disableUnderline={true}
                    value={message}
                    onKeyUp={(e) => { e.keyCode !== 13 && typing() }}
                    onChange={handleOnChange}
                    style={{ width: '100%' }}
                  />
                </Grid>
                <Grid item xs={1}>
                  <IconButton size="small" onClick={(e) => { setAnchorEl(e.currentTarget) }}>
                    <EmojiEmotionsOutlinedIcon style={{ color: "rgba(0, 0, 0, 0.26)", fontSize: '25px' }} />
                  </IconButton>
                  <Popover id="menu-picker" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => { setAnchorEl(null) }}>
                    <Picker onEmojiClick={handleOnEmojiClick} />
                  </Popover>

                </Grid>
              </Grid>
            </div>
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