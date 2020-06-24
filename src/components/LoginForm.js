import React, { useState } from 'react'

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'

// import dispatch, selector
import { useDispatch, useSelector } from 'react-redux'
import { setNickname, setUser } from '../actions/userActions'

import { VERIFY_USER, USER_CONNECTED } from '../Events'

const useStyles = makeStyles((theme) => ({
  formContainer: {
    width: '20vw',
    height: '40vh',
    margin: '20vh auto',
    border: '1px solid lightgrey',
  },
  formTitle: {
    margin: '5vh auto',
    fontWeight: 'bolder',
    fontSize: 'x-large',
    width: 'fit-content',
  },
  form: {
    padding: '0 2vw'
  },
  error: {
    color: '#fa3e3e',
    fontSize: 'large',
    margin: '2vh 0',
    textAlign: 'center'
  }
}));

var LoginForm = () => {
  const socket = useSelector(state => state.socketReducer.socket)
  const nickname = useSelector(state => state.userReducer.nickname)

  const dispatch = useDispatch()

  const classes = useStyles();

  // const [nickname, setNickName] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    // console.log('state: ', store.getState().userReducer)
    e.preventDefault()
    // send verify user event to the server
    if (nickname) {
      socket.emit(VERIFY_USER, nickname, ({ isUser, user }) => {
        if (isUser) {
          setError('User name taken!')
        } else {
          setError('')
          socket.emit(USER_CONNECTED, user)
          dispatch(setUser(user))
        }
      })
    } else {
      setError('You need to enter your nickname')
    }

  }

  return (
    <div className={classes.formContainer}>
      <div className={classes.formTitle}>Login</div>
      <form type="text" onSubmit={(e) => { handleSubmit(e) }} autoComplete="off" className={classes.form}>
        <TextField
          label="Nickname"
          value={nickname}
          onChange={(e) => { dispatch(setNickname(e.target.value)) }}
          fullWidth={true}
          variant="outlined"
        />
        <div className={classes.error} >{error ? error : null}</div>
        <Button type="submit" fullWidth={true} color="primary" variant="contained">Login</Button>


      </form>


    </div>


  );
}

export default LoginForm