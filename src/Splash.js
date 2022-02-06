import { useState } from 'react'
import logo from './pup2.svg'
import './Splash.css'

function Splash ({ onLogin, onRegister }) {
   const [email, setMail] = useState(''),
         [password, setPwd] = useState('')
   function newMail (ev) { setMail(ev.target.value) }
   function newPwd (ev) { setPwd(ev.target.value) }
   function doLogin (ev) {
      ev.preventDefault()
      if (onLogin) onLogin({email, password})
   }
   function newAccount () {
      if (onRegister) onRegister({email, password})
   }
   return (
      <div className="splash-screen">
         <h1><img className="app-logo" src={logo} alt="" /><br />Walkies!</h1>
         { onLogin ? (
            <form onSubmit={doLogin}>
               <label>Email: <input type="text" value={email} onChange={newMail} /></label>
               <label>Password: <input type="password" value={password} onChange={newPwd} /></label>
               <div className="button-box">
                  <button type="submit">Log in</button>
                  <button type="button" onClick={newAccount}>Register</button>
               </div>
            </form>
         ) : ( <div>Loading ...</div> ) }
      </div>
   )
}

export default Splash
