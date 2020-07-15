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
import ImageIcon from '@material-ui/icons/Image'
import CloseIcon from '@material-ui/icons/Close'
import DescriptionIcon from '@material-ui/icons/Description'
import { useSelector, useDispatch } from 'react-redux'
import { MESSAGE_SENT, TYPING, SEND_CHOSEN_FILES } from '../Events'
import { setChosenFiles } from '../actions/messageActions'

const useStyles = makeStyles(() => ({
  messageInputContainer: {
    position: 'absolute',
    bottom: 0,
    height: 'fit-content',
    width: '100%',
    backgroundColor: 'white',

  }
}))

var lastUpdateTime, typingInterval

const MessageInput = (props) => {
  const classes = useStyles()
  const [message, setMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [chosenEmoji, setChosenEmoji] = useState(null)
  const [anchorEl, setAnchorEl] = useState(null)
  const [chosenImages, setChosenImages] = useState([])

  const socket = useSelector(state => state.socketReducer.socket)
  const activeChat = useSelector(state => state.chatReducer.activeChat)
  const chosenFiles = useSelector(state => state.messageReducer.chosenFiles)

  const dispatch = useDispatch()
  const fileRef = React.useRef(null)



  var sendMessage = (chatId, message, isNotification) => {
    socket.emit(MESSAGE_SENT, { chatId, message, isNotification })
  }

  var sendTyping = (chatId, isTyping) => {
    socket.emit(TYPING, { chatId, isTyping })
  }

  // casual message text
  var handleOnChange = (e) => {
    // var message = chosenEmoji? (e.target.value + chosenEmoji): (e.target.value)
    // console.log('your mess: ', message)
    setMessage(e.target.value)
  }

  // file message

  var chosenImagesTemp = []
  var chosenFilesArray = []
  var chosenImagesArray = []

  const handleOpenChoosingFilesWindow = () => {
    fileRef.current.click()
  }

  const handleChoosingFiles = (e) => {
    e.preventDefault()
    chosenImagesTemp.push(e.target.files)
    for (var i = 0; i < chosenImagesTemp[0].length; i++) {
      chosenFilesArray.push(chosenImagesTemp[0][i])

      var type = chosenImagesTemp[0][i].type.split("/")[0]
      var name = chosenImagesTemp[0][i].name
      var extension = chosenImagesTemp[0][i].type.split("/")[1]
      chosenImagesArray.push({ url: URL.createObjectURL(chosenImagesTemp[0][i]), type: type, name: name, extension })

    }
    dispatch(setChosenFiles(chosenFilesArray))
    setChosenImages(chosenImagesArray)

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

  var handleOnThumbUp = (emojiObject, event) => {
    let sym = emojiObject.unified.split('-')
    let codesArray = []
    sym.forEach(el => codesArray.push('0x' + el))
    let emoji = String.fromCodePoint(...codesArray)
    setChosenEmoji(emojiObject)
    sendMessage(activeChat._id, emoji)
  }

  var handleSubmit = (e) => {
    e.preventDefault()
    if (message) {
      socket.emit(MESSAGE_SENT, { chatId: activeChat._id, message: message, isNotification: false })

    }
    // sendMessage(activeChat._id, message, false)
    setMessage("")
    if (chosenFiles) {
      chosenFiles.map(chosenFile => {
        var fileObj = {
          name: chosenFile.name,
          size: chosenFile.size,
          type: chosenFile.type,

        }
        if (chosenFile.type.split("/")[0] === "image") {
          var fileReader = new FileReader()
          fileReader.readAsDataURL(chosenFile)
          fileReader.onload = (e) => {

            var imgSrc = e.target.result // convert file data into base64string
            socket.emit(MESSAGE_SENT, { chatId: activeChat._id, message: Object.assign({}, fileObj, { data: imgSrc }), isNotification: false })
            console.log('file reader')

          }
        } else {
          var blob = new Blob([chosenFile], { type: chosenFile.type })
          var objectUrl = window.URL.createObjectURL(blob)

          var reader = new FileReader()
          reader.readAsDataURL(blob)


          reader.onload = (e) => {
            if (navigator.appVersion.toString().indexOf('.NET') > 0) {
              window.navigator.msSaveOrOpenBlob(blob, chosenFile.name)
            } else {
              var dataUrl = reader.result

              socket.binary(true).emit(MESSAGE_SENT, { chatId: activeChat._id, message: Object.assign({}, fileObj, { data: objectUrl, blob: dataUrl }), isNotification: false })
            }

          }

        }




      })
    }
    dispatch(setChosenFiles([]))

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

  const handleRemoveChosenFiles = () => {
    dispatch(setChosenFiles([]))
  }

  return (
    <div className={classes.messageInputContainer}>
      <div style={{ height: 'fit-content' }}>
        {chosenFiles.length !== 0 ? (
          <div className="chosen-files-container" style={{ borderTop: '1px solid lightgrey', height: 125, width: '100%', zIndex: 1, backgroundColor: 'white', display: 'flex' }}>
            {chosenImages.map(chosenFile => {
              return (

                <div className="chosen-file-container" style={{ margin: 'auto 5px' }} key={chosenFile.url}>
                  {chosenFile.type === "image" ? (<div className="chosen-image" style={{ backgroundImage: `url(${chosenFile.url})`, backgroundRepeat: 'no-repeat', height: 108, width: 108, backgroundSize: 'cover', borderRadius: 18 }}>

                  </div>) : (<div className="chosen-file" style={{ width: 240, height: 60, borderRadius: 18, border: '1px solid rgba(0, 0, 0, 0.15)', display: 'flex', overflow: 'hidden' }}>
                    <div className="illustrative-img" style={{ width: 60, backgroundColor: '#0084FF', display: 'flex' }}>
                      <DescriptionIcon style={{ color: 'white', margin: 'auto', fontSize: 44 }} />
                    </div>
                    <div className="file-info" style={{ flexGrow: 1, textAlign: 'left', marginLeft: 5 }}>
                      <div className="file-extension" style={{ fontWeight: 'bolder', paddingTop: 12 }}>{chosenFile.extension.toUpperCase()}</div>
                      <div className="file-name">{chosenFile.name}</div>
                    </div>
                  </div>)}


                </div>
              )
            })}
            <IconButton color="primary" size="small" style={{ width: 'fit-content', padding: 0, minWidth: 0, position: 'absolute', top: 0, right: 0 }} onClick={handleRemoveChosenFiles}>
              <CloseIcon />
            </IconButton>
          </div>
        ) : null
        }
      </div>
      <form className="message-input" noValidate autoComplete="off" onSubmit={handleSubmit} style={{ padding: "0 12px 12px 12px" }}>
        <input style={{ height: 0, width: 0, visibility: 'hidden' }} id="fileInput" type="file" ref={fileRef} onChange={handleChoosingFiles} multiple />

        <Grid container wrap="nowrap">
          <Grid item xs={1} style={{ display: 'flex' }}>
            <IconButton color="primary" size="small" style={{ width: 'fit-content', padding: 0, minWidth: 0, margin: 'auto' }} onClick={handleOpenChoosingFilesWindow}>
              <ImageIcon style={{ fontSize: '32px', margin: 0, padding: 0, color: '#0099FF' }} />
            </IconButton>
          </Grid>

          <Grid item xs={10}>
            <Grid container style={{ backgroundColor: 'rgba(0, 0, 0, .04)', borderRadius: '18px' }}>
              <Grid item xs={11}>
                <Input
                  id="input"
                  placeholder="Enter your message..."
                  disableUnderline={true}
                  value={message}
                  onKeyUp={(e) => { e.keyCode !== 13 && typing() }}
                  onChange={handleOnChange}
                  style={{ width: '100%', margin: '7px 9px' }}
                />
              </Grid>
              <Grid item xs={1}>
                <IconButton size="small" onClick={(e) => { setAnchorEl(e.currentTarget) }} style={{ margin: '7px 9px' }}>
                  <EmojiEmotionsOutlinedIcon style={{ color: "rgba(0, 0, 0, 0.26)", fontSize: '25px' }} />
                </IconButton>
                <Popover id="menu-picker" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => { setAnchorEl(null) }}>
                  <Picker onSelect={handleOnEmojiClick} set='facebook' emojiTooltip={true} />
                </Popover>

              </Grid>
            </Grid>


          </Grid>
          <Grid item xs={1} style={{ display: 'flex' }}>
            {message || chosenFiles.length !== 0 ? (
              <Button color="secondary" disabled={message.length < 1 && chosenFiles.length === 0} type="submit" size="small" style={{ width: 'fit-content', padding: 0, minWidth: 0, margin: 'auto' }}>
                <SendIcon style={{ fontSize: '32px', margin: 0, padding: 0, color: '#0099FF' }} />
              </Button>
            ) : (
                <div className="emoji-container" style={{ margin: 'auto' }}>
                  <Emoji emoji={{ id: '+1', name: 'Thumbs Up Sign' }} onClick={handleOnThumbUp} set='facebook' size={32} />
                </div>
              )}


          </Grid>
        </Grid>
      </form>
    </div>
  )
}

export default MessageInput