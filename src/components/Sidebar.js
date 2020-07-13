import React, { useState, useRef } from 'react'
import { makeStyles, fade } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
// icons
import SettingsRounded from '@material-ui/icons/SettingsRounded'
import SearchIcon from '@material-ui/icons/Search'
import Videocam from '@material-ui/icons/Videocam'
import AddCommentIcon from '@material-ui/icons/AddComment'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import Input from '@material-ui/core/Input'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Fade from '@material-ui/core/Fade'
import Tooltip from '@material-ui/core/Tooltip'
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Button from '@material-ui/core/Button'
import { getTime } from '../Factories'
import Avatar from '@material-ui/core/Avatar'

// import socket events
import { PRIVATE_CHAT, LOGOUT, DELETE_CHAT, LEAVE_GROUP } from '../Events'

import { useDispatch, useSelector } from 'react-redux'
import { logout, setReceiver } from '../actions/userActions'
import { setActiveChat } from '../actions/chatActions'

let userProfileColor
const useStyles = makeStyles((theme) => ({
  search: {
    position: 'relative',
    borderRadius: '50px',
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },

  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    height: 42
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
    height: '12px',
  },
  icons: {
    fontSize: 22
  },
  buttons: {
    backgroundColor: 'rgba(0, 0, 0, .04)',
    padding: '0.8vh'
  },
  chats: {
    "&:hover": {
      cursor: 'pointer',
      backgroundColor: 'rgba(0, 0, 0, .04)',
      borderRadius: '10px'
    }
  },
  active: {
    backgroundColor: 'rgba(0, 0, 0, .04)',
    borderRadius: '10px'
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
  chatName: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    maxWidth: '12vw',
  },
  userProfile:{
    // "&.MuiIconButton-colorPrimary": {backgroundColor: userProfileColor},
    "&:hover": {
      cursor: 'pointer'
    }
  }

}))

const SidebarHeader = (props) => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.userReducer.user)
  const userList = useSelector(state => state.userReducer.userList)
  const chats = useSelector(state => state.chatReducer.chats)
  const socket = useSelector(state => state.socketReducer.socket)

  const classes = useStyles()

  const [receivers, setReceivers] = useState([])
  const [openModal, setOpenModal] = useState(false);
  const receiversRef = useRef()
  receiversRef.current = receivers

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // open menu list when clicking into user account icon
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleOpenMenu = (e) => {
    setAnchorEl(e.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const handleChooseReceivers = (receiver) => {
    if (!receivers.includes(receiver)) {
      setReceivers(receivers => [...receivers, receiver])
    } else {
      const newReceiversArr = receiversRef.current.filter(item => item !== receiver)
      setReceivers(newReceiversArr)
    }
  }

  const handleCreateNewChat = (receivers) => {
    console.log('user group: ', receivers)
    socket.emit(PRIVATE_CHAT, { sender: user, receivers: receivers, chats })
    handleCloseModal()
  }

  const handleLogout = () => {
    dispatch(logout())
    socket.emit(LOGOUT)
  }

  if(user){
    userProfileColor = user.representPhoto
  }

  return (
    <div className="sidebar-header" style={{ height: 'fit-content', margin: '0.5vh 0.8vw', maxHeight: 52 }}>
      <Grid container style={{ height: 52 }}>
        <Grid item xs>
          <Tooltip title="User account" placement="bottom-end">
            <Avatar className={classes.userProfile} onClick={handleOpenMenu} style={{ width: 40, height: 40, color: 'white', backgroundColor: user.representPhoto, margin: 5 }}>{user.name[0].toUpperCase()}</Avatar>
            
            {/* <IconButton size="medium" onClick={handleOpenMenu} className={classes.userProfile}>
              {JSON.stringify(user) !== '{}' ? user.name[0].toUpperCase() : "Unknown"[0].toUpperCase()}
            </IconButton> */}
          </Tooltip>

          {/* menu when clicking to the user account icon */}
          <Menu
            id="fade-menu"
            anchorEl={anchorEl}
            keepMounted
            open={open}
            onClose={handleCloseMenu}
            TransitionComponent={Fade}
            anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
            getContentAnchorEl={null}
          >
            <MenuItem onClick={handleCloseMenu}>Profile</MenuItem>
            <MenuItem onClick={() => { handleCloseMenu(); handleLogout() }}>Logout</MenuItem>
          </Menu>
        </Grid>

        <Grid item container xs={8} lg={6} xl={4} style={{ float: 'right', padding: '0.6vh', justifyContent: 'flex-end' }}>
          <Grid item xs>
            <Tooltip title="Settings" placement="bottom-end">
              <IconButton size="small" className={classes.buttons}>
                <SettingsRounded className={classes.icons} />
              </IconButton>
            </Tooltip>
          </Grid>

          <Grid item xs>
            <Tooltip title="Create new meeting" placement="bottom-end">
              <IconButton size="small" className={classes.buttons}>
                <Videocam className={classes.icons} />
              </IconButton>
            </Tooltip>
          </Grid>

          {/* write new chat icon */}
          <Grid item xs>
            <Tooltip title="Write new messages" placement="bottom-end">
              <IconButton size="small" className={classes.buttons} onClick={handleOpenModal}>
                <AddCommentIcon className={classes.icons} />
              </IconButton>
            </Tooltip>
            <Modal
              aria-labelledby="transition-modal-title"
              aria-describedby="transition-modal-description"
              className={classes.modal}
              open={openModal}
              onClose={() => { handleCloseModal(); setReceivers([]) }}
              closeAfterTransition
              BackdropComponent={Backdrop}
              BackdropProps={{
                timeout: 500,
              }}
            >
              <Fade in={openModal}>
                <div className={classes.paper}>
                  <List component="nav" aria-label="main mailbox folders" className={classes.list}>
                    <div className="modal-header" style={{ borderBottom: '1px solid lightgrey', textAlign: 'center', padding: '7px 5px' }}>
                      <Grid container>
                        <Grid item xs={2}>
                          <Button size="small" color="secondary" onClick={() => { handleCloseModal(); setReceivers([]) }}>Cancel</Button>
                        </Grid>
                        <Grid item xs>
                          <div className="add-user-title" style={{ fontWeight: 'bold'}}>To</div>
                        </Grid>
                        <Grid item xs={2}>
                          <Button size="small" color="primary" onClick={() => { handleCreateNewChat(receivers); handleCloseMenu(); setReceivers([]) }}>Done</Button>
                        </Grid>

                      </Grid>
                    </div>
                    <div className="chosen-receivers" style={{ minHeight: 40, width: '100%', borderBottom: '1px solid lightgrey', display: 'flex', flexWrap: 'wrap' }}>
                      {receivers.length === 0 ? (
                        <div className="title" style={{ margin: 'auto 0', height: 'fit-content', color: 'rgba(0, 0, 0, 0.4)' }}>Send to:</div>
                      ) : (
                          receiversRef.current.map(receiver => {
                            return (
                              <div key={receiver._id} className="receiver" style={{ backgroundColor: 'lightblue', borderRadius: '2px', height: 'fit-content', width: 'fit-content', margin: '7px 5px', padding: '7px 5px' }}>{receiver.name}</div>

                            )
                          })
                        )}

                    </div>

                    <List component="nav" aria-label="main mailbox folders" className={classes.list}>
                      {userList.filter(activeUser => activeUser.name !== user.name).length !== 0 ?
                        (userList.filter(activeUser => activeUser.name !== user.name).map((activeUser) => {
                          return (
                            <ListItem key={activeUser._id} button onClick={() => {
                              // sendPrivateMessage(activeUser);
                              handleChooseReceivers(activeUser);
                            }}>
                              <Avatar style={{ width: 40, height: 40, color: 'white', backgroundColor: 'lightgrey', marginRight: 10 }}>{activeUser.name[0].toUpperCase()}</Avatar>
                              <ListItemText primary={activeUser.name} />
                            </ListItem>
                          )
                        })) : (<div style={{ color: 'rgba(0, 0, 0, 0.4)' }}>No active user</div>)
                      }
                    </List>

                  </List>
                </div>
              </Fade>
            </Modal>
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}

const SidebarSearch = (props) => {
  const classes = useStyles()

  const dispatch = useDispatch()
  const receiver = useSelector(state => state.userReducer.receiver)
  const socket = useSelector(state => state.socketReducer.socket)
  const user = useSelector(state => state.userReducer.user)
  const activeChat = useSelector(state => state.chatReducer.activeChat)

  var handleSubmit = (e) => {
    e.preventDefault()
    socket.emit(PRIVATE_CHAT, { sender: user.name, receiver, activeChat })
    dispatch(setReceiver(""))
  }
  return (
    <div className={classes.search} style={{ height: 42, margin: '0.5vh 1vw', backgroundColor: 'rgba(0, 0, 0, .04)' }}>
      <form onSubmit={handleSubmit}>
        <div className={classes.searchIcon}>
          <SearchIcon style={{ color: 'rgba(0, 0, 0, 0.54)' }} />
        </div>
        <Input
          type="text"
          placeholder="Search…"
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
          disableUnderline={true}
          inputProps={{ 'aria-label': 'search' }}
          value={receiver}
          onChange={(e) => dispatch(setReceiver(e.target.value))}
        />
      </form>

    </div>
  )
}

const ChatList = () => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const chats = useSelector(state => state.chatReducer.chats)
  const user = useSelector(state => state.userReducer.user)
  const activeChat = useSelector(state => state.chatReducer.activeChat)
  const socket = useSelector(state => state.socketReducer.socket)

  const [isHovered, setIsHovered] = useState({}) // set hover by index of a div
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isMenuOpened, setIsMenuOpened] = useState({})

  const handleMouseEnter = (index) => {
    setIsHovered((prevState) => ({
      ...prevState, [index]: true
    }))
  }

  const handleMouseLeave = (index) => {
    setIsHovered((prevState) => ({
      ...prevState, [index]: false
    }))
  }

  const handleOpenMenu = (event, index) => {
    setAnchorEl(event.currentTarget);
    setIsMenuOpened((prevState) => ({
      ...prevState, [index]: true
    }))
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setIsMenuOpened({})

  };

  const handleDeleteChat = () => {
    socket.emit(DELETE_CHAT, { chatId: activeChat._id })
  }

  const handleLeaveGroup = ()=>{
    socket.emit(LEAVE_GROUP, {sender: user, chat: activeChat})
  }


  return (
    <div className="active-chat" style={{ marginTop: '2vh' }}>
      {chats.map((chat, index) => {
        if (chat.name) {
          
          const lastMess = chat.messages.filter(mes=>{
            return mes.isNotification !== true
          })
          const lastMessage = lastMess[lastMess.length-1];
          return (
            <div
              className={classes.chats}
              style={{ height: 48, margin: '1vh 0.8vw', }}
              key={chat._id}
              onClick={() => { dispatch(setActiveChat(chat)); chat.hasNewMessages = false; console.log('active chat: ', activeChat) }}
              onMouseEnter={() => { handleMouseEnter(index) }}
              onMouseLeave={() => { handleMouseLeave(index) }}
            >
              <Grid container>
                <Grid item xs={3} lg={2}>
                  <Avatar style={{ width: 40, height: 40, color: 'white', backgroundColor: chat.representPhoto, margin: 5 }}>{chat.name[0].toUpperCase()}</Avatar>
                </Grid>

                <Grid item xs style={{ padding: '0.8vh 0' }}>
                  <div className={`chat-name ${classes.chatName}`} style={chat.hasNewMessages ? { fontWeight: 'bold' } : { fontWeight: 'normal' }}>{chat.name}</div>
                  <Grid container space={3} style={{ color: 'rgba(153, 153, 153, 1)', fontSize: 'small' }}>
                    <Grid item xs={10} lg >
                      <div className="chat-last-message" style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '12vw', }}>{lastMessage !== undefined ? lastMessage.message : 'No messages!'}</div>
                    </Grid>
                    <Grid item xs={2}>
                      <div className="chat-time" style={{ textAlign: 'right' }}>{lastMessage ? getTime(new Date(lastMessage.time)) : null}</div>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={2} lg={1} style={{ display: 'inherit', justifyContent: 'flex-end' }}>
                  {isHovered[index] &&
                    <div className="chat-options-button" style={{ margin: 'auto' }}>
                      <IconButton size="small" style={{ margin: 'auto', padding: 0 }} onClick={(event) => { handleOpenMenu(event, index) }}>
                        <MoreHorizIcon />
                      </IconButton>
                      <Menu id="option-menu" anchorEl={anchorEl} keepMounted open={isMenuOpened[index] ? (isMenuOpened[index]) : (false)} onClose={() => handleCloseMenu(index)}>
                        {chat.users.length > 2 ? (<MenuItem onClick={() => { handleCloseMenu(index); handleLeaveGroup() }}>Leave Group</MenuItem>) : null}

                        <MenuItem onClick={() => { handleCloseMenu(index); handleDeleteChat() }}>Delete</MenuItem>
                      </Menu>
                    </div>
                  }
                </Grid>
              </Grid>
            </div>
          )
        }
        return null
      })}
    </div>

  )
}

const Sidebar = () => {

  return (
    <div className="container" style={{ borderRight: '1px solid lightgrey', height: '100vh' }}>
      <SidebarHeader />
      <SidebarSearch />
      <ChatList />
    </div>
  )
}

export default Sidebar