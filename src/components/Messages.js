import React, { useEffect, useRef } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useSelector, useStore } from 'react-redux'
import IconButton from '@material-ui/core/IconButton'

const useStyles = makeStyles(() => ({
  message: {
    backgroundColor: 'rgba(0, 0, 0, .04)',
    borderRadius: '2em',
    width: 'fit-content',
    height: 'fit-content',
    padding: '0.01vh 1vw',
    marginTop: '1vh',
    maxWidth: '20vw'
  },
  time: {
    margin: '1vh 0.5% 0 1.2%',
   
  },
  hidden:{
    marginTop: '1vh',
    visibility: 'hidden'
  },
  show: {
    marginTop: '1vh',
    visibility: 'visible',
    padding: '5px 0'
  }
}))

const TypingIndicator = (props) => {
  return (
    <div className="ticontainer" style={{ display: 'flex', flexDirection: 'row' }}>
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
  
  const classes = useStyles()

  const randomColor = ()=>{
    let r = Math.round((Math.random() * 255)); //red 0 to 255
    let g = Math.round((Math.random() * 255)); //green 0 to 255
    let b = Math.round((Math.random() * 255)); //blue 0 to 255
    let a = Math.round((Math.random() * 1)); // alpha 0 to 1
    return 'rgb(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
  }

  return (
    <div>
      {
        activeChat.messages.length !== 0 ? (
          activeChat.messages.map((mes) => {
            return (
              <div key={mes.id} className={`message-container ${mes.sender === user.name && "right"}`}>
                <div className={`icon ${mes.sender === user.name? `${classes.hidden}`:`${classes.show}`}`}>
                  <IconButton size="small" style={{width: 40, height: 40, borderRadius: '50%'}}>
                    {mes.sender[0].toUpperCase()}
                  </IconButton>
                </div>
                <div className={`message ${classes.message}`}>
                  <p>{mes.message}</p>
                </div>
                <div className={classes.time}><p style={{fontSize: 'small', color: 'rgba(0, 0, 0, 0.4)', padding: '4px 0'}}>{mes.time}</p></div>
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
  const classes = useStyles()

  const activeChat = useSelector(state => state.chatReducer.activeChat)
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
        <div ref={messagesEndRef} />
        {
          store.getState().chatReducer.activeChat.typingUsers.map((name) => {
            return (
              <TypingIndicator key={activeChat.id} typing={`${name} is typing`} />
            )
          })
        }
      </div>

    </div>
  )
}

export default Messages