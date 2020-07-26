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
import ListItemText from '@material-ui/core/ListItemText'
import Button from '@material-ui/core/Button'
import Input from '@material-ui/core/Input'
import ActiveChatDetail from './ActiveChatDetail'
import Avatar from '@material-ui/core/Avatar'
import VideocamIcon from '@material-ui/icons/Videocam'
import CallEndIcon from '@material-ui/icons/CallEnd'

import { useSelector, useStore } from 'react-redux'
import {
  ADD_USER_TO_CHAT, CHANGE_CHAT_NAME, USERS_IN_CHAT,
  CALL_USER, CALL_MADE, MAKE_ANSER, ANSWER_MADE
} from '../Events'

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
  },
  paperVideo: {
    backgroundColor: 'white',
    borderRadius: 4,
    position: 'relative',
    width: '70vw',
    height: '70vh'
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
      const newReceiversArr = receiversRef.current.filter(item => item !== receiver)
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
                  <div className="add-user-title" style={{ fontWeight: 'bold' }}>Add More People</div>
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
                      <Avatar style={{ width: 40, height: 40, color: 'white', backgroundColor: `${activeUser.representPhoto}`, marginRight: 10 }}>{activeUser.name[0].toUpperCase()}</Avatar>
                      <ListItemText primary={activeUser.name} />
                    </ListItem>
                  )
                })) : (<div style={{ color: 'rgba(0, 0, 0, 0.4)' }}>No active user at the moment!</div>)
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

const VideoCall = () => {
  const classes = useStyles()
  const { RTCPeerConnection, RTCSessionDescription } = window

  const [open, setOpen] = React.useState(false);
  const activeChat = useSelector(state => state.chatReducer.activeChat)
  const socket = useSelector(state => state.socketReducer.socket)
  const user = useSelector(state => state.userReducer.user)
  // let peerConnection1 = null
  // let peerConnection2 = null
  let peerConnection1 = new RTCPeerConnection({
    iceServers: [{
      urls: 'stun:stun.l.google.com:19302',

    }]
  })

  let peerConnection2 =  new RTCPeerConnection({
    iceServers: [{
      urls: 'stun:stun.l.google.com:19302',

    }]
  })


  if (peerConnection1) {
    peerConnection1.ontrack = (event) => {
      let remoteVideo = document.getElementById("remote-video");
      remoteVideo.srcObject = event.streams[0]
    }
  }
  if (peerConnection2) {
    peerConnection2.ontrack = (event) => {
      let remoteVideo = document.getElementById("remote-video")
      remoteVideo.srcObject = event.streams[0]
    }
  }



  // call
  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenCam = () => {
    setOpen(true);

    handleCallUser()

  }



  const handleCallUser = async () => {
    if (peerConnection1) {
      let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      if (peerConnection1.signalingState !== "closed" && stream) {
        const localVideo = document.getElementById("local-video");
        localVideo.srcObject = stream

        let localStream = stream
        stream.getTracks().forEach(async track => await peerConnection1.addTrack(track, localStream))

        peerConnection1.onnegotiationneeded = async () => {
          let offer = await peerConnection1.createOffer()
          await peerConnection1.setLocalDescription(offer)
          socket.emit(CALL_USER, { offer: offer, to: activeChat.users })
          peerConnection1.onicecandidate = (event) => {
            if (event.candidate) {
              socket.emit("candidate", { candidate: event.candidate, to: activeChat.users, pc: "pc1" })
            }
          }
        }


        console.log('peer 1: ', peerConnection1)

      }
    }


  }


  socket.on(CALL_MADE, async ({ offer, receiver }) => {
    setOpen(true)
    if (peerConnection2) {
      if (peerConnection2.signalingState !== "closed") {
        var sdpOffer = new RTCSessionDescription(offer)
        await peerConnection2.setRemoteDescription(sdpOffer)

        let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        if (stream) {
          const localVideo = document.getElementById("local-video")
          localVideo.srcObject = stream

          let localStream = stream
          stream.getTracks().forEach(async track => await peerConnection2.addTrack(track, localStream))

          let answer = await peerConnection2.createAnswer()
          await peerConnection2.setLocalDescription(answer)

          socket.emit(MAKE_ANSER, ({ answer: answer, to: receiver }))


          peerConnection2.onicecandidate = (event) => {
            if (event.candidate) {
              socket.emit("candidate", { candidate: event.candidate, to: activeChat.users, pc: "pc2" })
            }
          }
          console.log('peer 2: ', peerConnection2)
        }
      }
    }

  })

  socket.on(ANSWER_MADE, async ({ answer, receiver }) => {
    if (peerConnection1) {
      if (peerConnection1.signalingState == "stable") {
        console.log("negotiating")
        return
      }
      if (peerConnection1.signalingState !== "closed") {
        await peerConnection1.setRemoteDescription(new RTCSessionDescription(answer))

      }

      if (candidatesArray.length) {
        candidatesArray.forEach(async candidate => {
          var sdpCandidate = new RTCIceCandidate(candidate)
          await peerConnection1.addIceCandidate(sdpCandidate)
        })
      }
    }


  })

  let candidatesArray = []
  socket.on("gotCandidate", async ({ candidate, pc }) => {
    if (pc == "pc1") {
      if (peerConnection2) {
        try {
          if (peerConnection2.signalingState != "stable" && !peerConnection2.remoteDescription) {
            candidatesArray.push(candidate)
            return
          }
          var sdpCandidate = new RTCIceCandidate(candidate)
          await peerConnection2.addIceCandidate(sdpCandidate)
        } catch (error) {
          console.log("error while adding ice candidate on peer 2: ", error)
        }
      }


    }
    if (pc == "pc2") {
      if (peerConnection1) {
        try {
          if (peerConnection1.signalingState != "stable" && !peerConnection1.remoteDescription) {
            candidatesArray.push(candidate)
            return
          }
          var sdpCandidate = new RTCIceCandidate(candidate)
          await peerConnection1.addIceCandidate(sdpCandidate)
        } catch (error) {
          console.log("error while adding ice candidate on peer 1: ", error)
        }
      }

    }
  })

  const handleEndCall = () => {
    socket.emit("endCall", ({ users: activeChat.users }))
  }

  socket.on("closeVideoCall", () => {
    const localVideo = document.getElementById("local-video")
    const remoteVideo = document.getElementById("remote-video")

    if (peerConnection1) {
      peerConnection1.ontrack = null
      peerConnection1.onicecandidate = null
      peerConnection1.onsignalingstatechange = null
      peerConnection1.close()

    }
    if (peerConnection2) {
      peerConnection2.ontrack = null
      peerConnection2.onicecandidate = null
      peerConnection2.onsignalingstatechange = null
      peerConnection2.close()

    }

    if (remoteVideo.srcObject) {
      remoteVideo.srcObject.getTracks().forEach(track => { track.stop() })
      remoteVideo.srcObject = null
    }
    if (localVideo.srcObject) {
      localVideo.srcObject.getTracks().forEach(track => track.stop())
      localVideo.srcObject = null

    }

    setOpen(false)
  })

  return (
    <IconButton size="medium" className={classes.iconBtn} onClick={handleOpenCam}>
      <VideocamIcon />
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={() => { handleClose(); }}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paperVideo}>
            <div className="remote-video-container" style={{ width: '100%', height: '100%', backgroundColor: 'black' }}>
              <video autoPlay id="remote-video" className="video-call" style={{ width: '100%', height: '100%' }}></video>
            </div>
            <div className="local-video-container" style={{ width: 100, height: 100, position: 'absolute', top: 0, right: 0 }}>
              <video autoPlay muted id="local-video" className="video-call" style={{ width: '100%', height: '100%' }}></video>
            </div>
            <div className="call-options">
              <IconButton size="medium" color="secondary" onClick={handleEndCall} style={{ position: 'absolute', bottom: 0 }}>
                <CallEndIcon style={{ color: 'white' }} />
              </IconButton>
            </div>


          </div>
        </Fade>
      </Modal>
    </IconButton>

  )
}

const ChatHeading = () => {
  const store = useStore()
  const activeChat = useSelector(state => state.chatReducer.activeChat)
  const socket = useSelector(state => state.socketReducer.socket)
  const [chatName, setChatName] = React.useState(store.getState().chatReducer.activeChat.name)
  const chatNameRef = React.useRef()
  chatNameRef.current = chatName

  useEffect(() => {
    setChatName(store.getState().chatReducer.activeChat.name)
  }, [store.getState().chatReducer.activeChat])

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
              {/* {chatName ? (<Button type="submit">Change</Button>) : null} */}
            </form>
          </Grid>
          {/* <Grid item xs><h2 style={{ margin: 0, padding: 0 }}>{store.getState().chatReducer.activeChat.name}</h2></Grid> */}
          <Grid item xs>
            {activeChat.name ? (
              <div className="icon-modals-container" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <AddIconModal />
                <InfoIconModal />
                <VideoCall />

              </div>
            ) : null}
          </Grid>

        </Grid>

      </div>
    </div>
  )
}

export default ChatHeading