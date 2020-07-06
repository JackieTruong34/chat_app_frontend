import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import InfoIcon from '@material-ui/icons/Info'
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Button from '@material-ui/core/Button'
import Input from '@material-ui/core/Input'
import ActiveChatDetail from './ActiveChatDetail'
import Avatar from '@material-ui/core/Avatar'

import { useSelector, useStore } from 'react-redux'
import { ADD_USER_TO_CHAT, CHANGE_CHAT_NAME, USERS_IN_CHAT } from '../Events'

const useStyles = makeStyles((theme) => ({
  iconBtn: {
    padding: 5,
    backgroundColor: 'white'
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: 'white',
    borderRadius: '4px',
    padding: '10px',
    width: '400px',
    minHeight: '25vh'
  },
  list: {
    height: '120px',
    overflowY: 'scroll'
  },
  iconModalContainer: {
    width: 'fit-content'
  }

}))

const AddIconModal = () => {
  const store = useStore()
  const userList = useSelector(state => state.userReducer.userList)
  const activeChat = useSelector(state => state.chatReducer.activeChat)
  const socket = useSelector(state => state.socketReducer.socket)

  const classes = useStyles();
  const [open, setOpen] = React.useState(false)
  const [receivers, setReceivers] = React.useState([])

  const receiversRef = React.useRef()
  receiversRef.current = receivers

  const addUserToChat = (receivers) => {
    if (receivers) {
      socket.emit(ADD_USER_TO_CHAT, { receivers, activeChat, chats: store.getState().chatReducer.chats })
    }
  }

  const handleClick = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleChooseReceivers = (receiver) => {
    if (!receivers.includes(receiver)) {
      setReceivers(receivers => [...receivers, receiver])
    } else {
      const newReceiversArr = receiversRef.current.filter(item=>item !== receiver)
      setReceivers(newReceiversArr)
    }
  }

  return (
    <div className={classes.iconModalContainer}>
      <IconButton size="medium" className={classes.iconBtn} onClick={handleClick}>
        <PersonAddIcon />
      </IconButton>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={() => { handleClose(); setReceivers([]) }}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <div className="modal-header" style={{ borderBottom: '1px solid lightgrey', textAlign: 'center', padding: '7px 5px' }}>
              <Grid container>
                {/* cancle button */}
                <Grid item xs={2}>
                  <Button onClick={() => { handleClose(); setReceivers([]); }} color="secondary" size="small" >Cancel</Button>
                </Grid>
                <Grid item xs style={{ margin: 'auto', height: 'fit-content' }}>
                  <div class="add-user-title" style={{fontWeight: 'bold'}}>Add More People</div>
                </Grid>
                {/* done button */}
                <Grid item xs={2}>
                  <Button onClick={() => { addUserToChat(receivers); handleClose(); setReceivers([]); }} color="primary" size="small" >Done</Button>
                </Grid>
              </Grid>

            </div>

            <div className="chosen-receivers" style={{ minHeight: 40, width: '100%', borderBottom: '1px solid lightgrey', display: 'flex', flexWrap: 'wrap' }}>
              {receivers.length === 0 ? (
                <div className="title" style={{ margin: 'auto 0', height: 'fit-content', color: 'rgba(0, 0, 0, 0.4)' }}>Add to group:</div>
              ) : (
                  receiversRef.current.map(receiver => {
                    return (
                      <div key={receiver._id} className="receiver" style={{ backgroundColor: 'lightblue', borderRadius: '2px', height: 'fit-content', width: 'fit-content', margin: '7px 5px', padding: '7px 5px' }}>{receiver.name}</div>

                    )
                  })
                )}

            </div>

            <List component="nav" aria-label="main mailbox folders" className={classes.list}>
              {userList.filter(onlineUser => !store.getState().chatReducer.activeChat.users.includes(onlineUser._id)).length !== 0 ?
                (userList.filter(onlineUser => !store.getState().chatReducer.activeChat.users.includes(onlineUser._id)).map((activeUser) => {
                  return (
                    <ListItem key={activeUser._id} button onClick={() => {
                      // sendPrivateMessage(activeUser);
                      handleChooseReceivers(activeUser);
                    }}>
                      <Avatar style={{width: 40, height: 40, color: 'white', backgroundColor: 'lightgrey', marginRight: 10}}>{activeUser.name[0].toUpperCase()}</Avatar>
                      <ListItemText primary={activeUser.name} />
                    </ListItem>
                  )
                })) : (<div style={{color: 'rgba(0, 0, 0, 0.4)'}}>No active user</div>)
              }
            </List>

          </div>
        </Fade>
      </Modal>
    </div>
  )
}

const InfoIconModal = () => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const socket = useSelector(state => state.socketReducer.socket)
  const activeChat = useSelector(state => state.chatReducer.activeChat)
  const handleOpen = () => {
    setOpen(true);
    socket.emit(USERS_IN_CHAT, { chat: activeChat })
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div className={classes.iconModalContainer}>
      <IconButton size="medium" className={classes.iconBtn} onClick={handleOpen}>
        <InfoIcon />
      </IconButton>
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
          <ActiveChatDetail />
        </Fade>
      </Modal>
    </div>
  )
}

const ChatHeading = () => {
  const classes = useStyles()
  const store = useStore()
  const activeChat = useSelector(state => state.chatReducer.activeChat)
  const socket = useSelector(state => state.socketReducer.socket)
  const [chatName, setChatName] = React.useState(store.getState().chatReducer.activeChat.name)
  const chatNameRef = React.useRef()
  chatNameRef.current = chatName

  useEffect(()=>{
    setChatName(store.getState().chatReducer.activeChat.name)
  },[store.getState().chatReducer.activeChat])
  
  const handleChange = (e) => {
    setChatName(e.target.value)
  }

  const handleChangeChatName = (e) => {
    e.preventDefault()
    socket.emit(CHANGE_CHAT_NAME, { activeChat: activeChat, newChatName: chatName })
    setChatName(chatNameRef.current)
  }

  return (
    <div className="heading-container" style={{ height: 52, borderBottom: '1px solid lightgrey' }}>
      <div className="container" style={{ padding: '1vh 1vw' }}>
        <Grid container >
          <Grid item xs >
            <form type="text" onSubmit={handleChangeChatName} style={{ display: 'flex' }}>
              {/* <div className="chat-last-message" style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '12vw', }}></div> */}
              <Input style={{ width: '200px' }} value={chatNameRef.current} disableUnderline={true} onChange={handleChange} inputProps={{ style: { fontWeight: 'bold', fontSize: '18.72px' } }} />
              {chatName ? (<Button type="submit">Change</Button>) : null}
            </form>
          </Grid>
          {/* <Grid item xs><h2 style={{ margin: 0, padding: 0 }}>{store.getState().chatReducer.activeChat.name}</h2></Grid> */}
          <Grid item xs>
            {activeChat.name !== "Community" ? (
              <div className="icon-modals-container" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <AddIconModal />
                <InfoIconModal />
              </div>
            ) : null}
          </Grid>
        </Grid>

      </div>
    </div>
  )
}

export default ChatHeading