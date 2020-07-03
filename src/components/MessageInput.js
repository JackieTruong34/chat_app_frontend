import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Input from '@material-ui/core/Input'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import 'emoji-mart/css/emoji-mart.css'
import { Picker, Emoji } from 'emoji-mart'
import IconButton from '@material-ui/core/IconButton'
import Popover from '@material-ui/core/Popover'
import SendIcon from '@material-ui/icons/Send'
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

  var handleOnEmojiClick = (emojiObject, event) => {
    let sym = emojiObject.unified.split('-')
    let codesArray = []
    sym.forEach(el => codesArray.push('0x' + el))
    let emoji = String.fromCodePoint(...codesArray)
    setChosenEmoji(emojiObject)
    setMessage(message + emoji)
    console.log('Your mess: ', emojiObject)
  }

  var handleOnThumbUp = (emojiObject, event)=>{
    let sym = emojiObject.unified.split('-')
    let codesArray = []
    sym.forEach(el => codesArray.push('0x' + el))
    let emoji = String.fromCodePoint(...codesArray)
    setChosenEmoji(emojiObject)
    sendMessage(activeChat._id, emoji)
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
        <Grid container wrap="nowrap" spacing={3}>
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
                    <Picker onSelect={handleOnEmojiClick} set='facebook' emojiTooltip={true} />
                  </Popover>

                </Grid>
              </Grid>
            </div>
          </Grid>
          <Grid item xs={1}>
            {message ? (
              <Button color="secondary" disabled={message.length < 1} type="submit" size="small" style={{width: 'fit-content', padding: 0, margin: '13px 0 0 0'}}>
                <SendIcon style={{ fontSize: '25px', margin: 0, padding: 0}} color='primary' />
              </Button>
            ) : (
              <div className="emoji-container" style={{marginTop: 7}}>
                <Emoji emoji={{ id: '+1', name: 'Thumbs Up Sign' }} onClick={handleOnThumbUp} set='facebook' size={32} style={{marginTop: '9px'}}/>
              </div>
              )}


          </Grid>
        </Grid>
      </form>
    </div>
  )
}

export default MessageInput