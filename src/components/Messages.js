import React, { useEffect, useRef } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useSelector, useStore } from 'react-redux'
import { getTime } from '../Factories'
import Avatar from '@material-ui/core/Avatar'
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import GetAppIcon from '@material-ui/icons/GetApp'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'

const useStyles = makeStyles((theme) => ({
  message: {
    backgroundColor: '#F1F0F0',
    borderRadius: '1.4em',
    width: 'fit-content',
    height: 'fit-content',
    padding: '0.01vh 1vw',
    margin: 'auto 0',
    maxWidth: '20vw'
  },
  imageMessage: {
    marginTop: '1vh',
    maxWidth: '25vw',
    "&:hover": {
      cursor: 'pointer',
    }
  },
  // time: {
  //   margin: 'auto',

  // },
  hidden: {
    marginTop: '1vh',
    visibility: 'hidden'
  },
  show: {
    marginTop: '1vh',
    marginRight: 7,
    visibility: 'visible',
    display: 'flex'
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    boxShadow: theme.shadows[5],

  },
  backdropStyle: {
    background: 'rgba(0,0,0,0.9)'
  }

}))

const TypingIndicator = (props) => {
  return (
    <div className="ticontainer" style={{ display: 'flex', flexDirection: 'row', padding: '0 1vw', marginTop: '1vh', color: 'rgba(0, 0, 0, 0.4)' }}>
      <div className="user-name">
        {props.typing}
      </div>
      <div className="tiblock">
        <div className="tidot"></div>
        <div className="tidot"></div>
        <div className="tidot"></div>
      </div>
    </div>
  )
}

const MessageList = () => {
  const activeChat = useSelector(state => state.chatReducer.activeChat)
  const user = useSelector(state => state.userReducer.user)
  const [open, setOpen] = React.useState({})
  const store = useStore()
  const classes = useStyles()
  const handleOpen = (index) => {
    setOpen((prevState) => ({
      ...prevState, [index]: true
    }))
  }

  const handleClose = (index) => {
    setOpen((prevState) => ({
      ...prevState, [index]: false
    }))
  }

  const convertBase64ToBlob = (base64, contentType) => {
    const byteCharacters = atob(base64)
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    const blob = new Blob([byteArray], { type: contentType })
    console.log('blob: ', blob)
    return blob
  }

  return (
    <div>
      {
        activeChat.messages.length !== 0 ? (
          activeChat.messages.map((mes, index) => {

            return (
              <div key={index} className="container" >
                {mes.isNotification ?
                  (
                    <div className="notification">
                      <div className="notification-message" style={{ textAlign: 'center', color: 'rgba(0, 0, 0, 0.4)', fontSize: '14px' }}>
                        <p>{mes.message}</p>
                      </div>
                    </div>
                  ) : (
                    <div className={`message-container ${mes.sender.name === user.name && "right"}`}>
                      <div className={`icon ${mes.sender.name === user.name ? `${classes.hidden}` : `${classes.show}`}`}>
                        <Avatar style={{ width: 30, height: 30, color: 'white', backgroundColor: mes.sender.representPhoto, margin: 'auto' }}>{mes.sender.name[0].toUpperCase()}</Avatar>
                      </div>

                      {mes.file ? (
                        <div className="file-container" style={{ display: 'flex' }}>
                          {mes.file.type.split("/")[0] === "image" ? (
                            <div className="image-message-container">
                              <div className={classes.imageMessage} onClick={() => { handleOpen(index) }}>
                                <img src={"data:" + mes.file.type + ";base64," + mes.file.data} alt={mes.file.name} style={{ borderRadius: '1.3em', maxWidth: '25vw', maxHeight: '25vh', border: '1px solid lightgrey' }} />
                              </div>
                              {open[index] &&
                                <Modal
                                  aria-labelledby="transition-modal-title"
                                  aria-describedby="transition-modal-description"
                                  className={classes.modal}
                                  open={open[index]}
                                  closeAfterTransition
                                  BackdropComponent={Backdrop}
                                  BackdropProps={{
                                    timeout: 500,
                                    classes: {
                                      root: classes.backdropStyle
                                    }

                                    // backgroundImage: "url('data:"+mes.file.type+";base64,"+mes.file.data+"')"
                                  }}
                                >
                                  <Fade in={open[index]}>
                                    <div className="image-container">
                                      <img src={"data:" + mes.file.type + ";base64," + mes.file.data} alt={mes.file.name} style={{ maxWidth: '70vw', maxHeight: '70vh' }} />
                                      <IconButton style={{ width: 'fit-content', padding: 0, minWidth: 0, position: 'absolute', top: 0, left: 0 }} onClick={() => { handleClose(index) }}>
                                        <CloseIcon style={{ color: 'white', fontSize: 40 }} />
                                      </IconButton>
                                    </div>
                                  </Fade>
                                </Modal>
                              }

                            </div>
                          ) : (
                              <div className={`message ${classes.message}`}>
                                {window.navigator && window.navigator.msSaveOrOpenBlob ? (
                                  window.navigator.msSaveOrOpenBlob(convertBase64ToBlob(mes.file.blob, mes.file.type), mes.file.name)

                                ) : (
                                    <Grid container style={{ margin: '6px 0px', width: 'fit-content' }} spacing={2}>
                                      <Grid item xs={2} md={1} style={{ display: 'flex', padding: 7 }}>
                                        <GetAppIcon style={{ fontSize: 16, color: `${mes.sender.name === user.name ? 'white' : 'black'}`, margin: 'auto' }} />
                                      </Grid>
                                      <Grid item xs style={{ display: 'flex' }}>
                                        <a href={mes.file.blob} target="_self" download={mes.file.name} style={{ textDecoration: 'none', margin: 'auto', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '12vw', }}>{mes.file.name}</a>
                                      </Grid>

                                    </Grid>


                                  )}
                                {/* <link href={mes.file.data} download={mes.file.name} />
                                {mes.file.name} */}
                              </div>
                            )}
                        </div>


                      ) : (<div className={`message ${classes.message}`}>
                        <p style={{ margin: '7px 5px' }}>{mes.message}</p>
                      </div>)}
                      <div className="time" style={{ display: 'flex', marginLeft: 10 }}><p style={{ fontSize: 'small', color: 'rgba(0, 0, 0, 0.4)', margin: 'auto' }}>{getTime(new Date(mes.time))}</p></div>
                    </div>
                  )}

              </div>
            )
          })

        ) : (
            <div>Say hi to your partner</div>
          )
      }

    </div>
  )
}

const Messages = (props) => {

  const activeChat = useSelector(state => state.chatReducer.activeChat)
  const chosenFiles = useSelector(state => state.messageReducer.chosenFiles)
  const store = useStore()
  // auto scroll down function
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()

  }, [activeChat.messages.length])

  return (
    <div className="thread-container">
      <div className="thread">
        <MessageList />

        <div className="typing-indicator-container" style={{ height: 40 }}>
          {
            store.getState().chatReducer.activeChat.typingUsers.map((name) => {
              return (
                <TypingIndicator key={activeChat._id} typing={`${name} is typing`} />
              )
            })
          }
        </div>
        <div ref={messagesEndRef} />

      </div>

    </div>


  )
}

export default Messages