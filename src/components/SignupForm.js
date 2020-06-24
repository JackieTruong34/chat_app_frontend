import React, { useState } from 'react'

const SignupForm = () => {

  const [userName, setUserName] = useState("")
  const handleChange = (e) => {
    setUserName(e.target.value)
  }
  const handleSubmit = ()=>{
    
  }
  return (
    <div className="signup-form">
      <form onSubmit={handleSubmit}>
        <input onChange={handleChange} />
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

export default SignupForm