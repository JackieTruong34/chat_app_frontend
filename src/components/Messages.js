import React, { useEffect, useRef } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useSelector, useStore } from 'react-redux'
import { getTime } from '../Factories'
import Avatar from '@material-ui/core/Avatar'
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

const useStyles = makeStyles((theme) => ({
  message: {
    backgroundColor: 'rgba(0, 0, 0, .04)',
    borderRadius: '1.3em',
    width: 'fit-content',
    height: 'fit-content',
    padding: '0.01vh 1vw',
    marginTop: '1vh',
    maxWidth: '20vw'
  },
  imageMessage: {
    marginTop: '1vh',
    maxWidth: '25vw',
    "&:hover": {
      cursor: 'pointer',
    }
  },
  time: {
    margin: '1vh 0.5% 0 1.2%',

  },
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
  const [open, setOpen] = React.useState(false)
  const classes = useStyles()
  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
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
                        <Avatar style={{ width: 32, height: 32, color: 'white', backgroundColor: mes.sender.representPhoto, margin: 'auto' }}>{mes.sender.name[0].toUpperCase()}</Avatar>
                      </div>

                      {mes.isImage ? (
                        <div className="image-message-container">
                          <div className={classes.imageMessage} onClick={handleOpen}>
                            <img src={"data:" + mes.type + ";base64," + mes.data} alt={mes.name} style={{ borderRadius: '1.3em', maxWidth: '25vw', maxHeight: '25vh' }} />
                          </div>
                          <Modal
                            aria-labelledby="transition-modal-title"
                            aria-describedby="transition-modal-description"
                            className={classes.modal}
                            open={open}
                            onClose={handleClose}
                            closeAfterTransition
                            BackdropComponent={Backdrop}
                            BackdropProps={{
                              timeout: 500,
                            }}
                          >
                            <Fade in={open}>
                              <div className="image-container">
                                <img src={"data:" + mes.type + ";base64," + mes.data} alt={mes.name} style={{maxWidth: '70vw', maxHeight: '70vh'}} />

                              </div>
                            </Fade>
                          </Modal>
                        </div>

                      ) : (<div className={`message ${classes.message}`}>
                        <p>{mes.message}</p>
                      </div>)}
                      <div className={classes.time}><p style={{ fontSize: 'small', color: 'rgba(0, 0, 0, 0.4)', padding: '4px 0' }}>{getTime(new Date(mes.time))}</p></div>
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
    <div>
      <div className="thread-container">
        <div className="thread">
          <MessageList />
          <div className="typing-indicator-container" style={{ height: 30 }}>
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
    </div>

  )
}

export default Messages