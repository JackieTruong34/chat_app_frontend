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
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Button from '@material-ui/core/Button'
import { getTime } from '../Factories'
import Avatar from '@material-ui/core/Avatar'

// import socket events
import { PRIVATE_CHAT, LOGOUT, DELETE_CHAT } from '../Events'

import { useDispatch, useSelector, useStore } from 'react-redux'
import { logout, setReceiver } from '../actions/userActions'
import { setActiveChat } from '../actions/chatActions'

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
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },

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

  const sendPrivateMessage = (receivers) => {
    socket.emit(PRIVATE_CHAT, { sender: user, receivers, chats })

  }

  const handleChooseReceivers = (receiver) => {
    setReceivers(receivers => [...receivers, receiver])
  }

  const handleCreateNewChat = () => {
    console.log('user group: ', receivers)
    sendPrivateMessage(receivers)
    handleCloseModal()
  }

  const handleLogout = () => {
    dispatch(logout())
    socket.emit(LOGOUT)
  }

  return (
    <div className="sidebar-header" style={{ height: 'fit-content', margin: '0 0.8vw', maxHeight: 52 }}>
      <Grid container style={{ height: 52 }}>
        <Grid item xs>
          <Tooltip title="User account" placement="bottom-end">
            <IconButton size="medium" onClick={handleOpenMenu}>
              {/* <AccountCircle className={classes.icons}/> */}
              {JSON.stringify(user) !== '{}' ? user.name[0].toUpperCase() : "Unknown"[0].toUpperCase()}
            </IconButton>
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

        <Grid item container xs={4} style={{ float: 'right', padding: '0.6vh' }}>
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
                    <div className="to" style={{ textAlign: 'center', borderBottom: '1px solid lightgrey' }}>To: </div>
                    {userList.length !== 0 ? (
                      userList.filter(activeUser => activeUser.name !== user.name).map((user) => {
                        return (
                          <ListItem key={user._id} button onClick={() => handleChooseReceivers(user)}>
                            <ListItemIcon>
                              <IconButton>{user.name[0].toUpperCase()}</IconButton>
                            </ListItemIcon>
                            <ListItemText primary={user.name} />
                          </ListItem>
                        )
                      })
                    ) : (<div></div>)}
                    <Button onClick={() => { handleCreateNewChat(); setReceivers([]) }}>Create Chat</Button>
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
  const store = useStore()
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

  return (
    <div className="active-chat" style={{ marginTop: '2vh' }}>
      {chats.map((chat, index) => {
        if (chat.name) {
          const lastMessage = chat.messages[chat.messages.length - 1];
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
                <Grid item xs={2} >
                  <Avatar style={{width: 40, height: 40, color: 'white', backgroundColor: 'lightgrey', margin: 5}}>{chat.name[0].toUpperCase()}</Avatar>
                  
                </Grid>

                <Grid item xs style={{ padding: '0.8vh 0' }}>
                  <div className={`chat-name`} style={chat.hasNewMessages ? { fontWeight: 'bold' } : { fontWeight: 'normal' }}>{chat.name}</div>
                  <Grid container space={3} style={{ color: 'rgba(153, 153, 153, 1)', fontSize: 'small' }}>
                    <Grid item xs >
                      <div className="chat-last-message" style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '12vw', }}>{lastMessage !== undefined ? lastMessage.message : 'No messages!'}</div>
                    </Grid>
                    <Grid item xs={3}>
                      <div className="chat-time" style={{ textAlign: 'right' }}>{lastMessage ? getTime(new Date(lastMessage.time)) : null}</div>
                    </Grid>
                  </Grid>
                </Grid>

                {isHovered[index] &&
                  <Grid item xs={1} style={{ display: 'inherit' }}>
                    <IconButton size="small" style={{ margin: 'auto' }} onClick={(event) => { handleOpenMenu(event, index) }}>
                      <MoreHorizIcon />
                    </IconButton>
                    <Menu id="option-menu" anchorEl={anchorEl} keepMounted open={isMenuOpened[index] ? (isMenuOpened[index]) : (false)} onClose={() => handleCloseMenu(index)}>
                      {chat.users.length > 2 ? (<MenuItem onClick={() => { handleCloseMenu(index) }}>Leave Group</MenuItem>) : null}

                      <MenuItem onClick={() => { handleCloseMenu(index); handleDeleteChat() }}>Delete</MenuItem>
                    </Menu>

                  </Grid>
                }

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
  const activeChat = useSelector(state => state.chatReducer.activeChat)

  return (
    <div className="container" style={{ borderRight: '1px solid lightgrey', height: '100vh' }}>
      <SidebarHeader />
      <SidebarSearch />
      <ChatList />
    </div>
  )
}

export default Sidebar