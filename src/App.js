import React, { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { User, useModel } from './model/user.js'
import Splash from './Splash.js'
import Owner from './owner/Owner.js'
import './App.css'

function App() {
   const [user,] = useModel(new User()),
         [initial, setInitial] = useState(true),
         [errorText, showError] = useState(''),
         navigate = useNavigate()
   // On initial render, restore any saved session
   useEffect(
      () => {
         if (initial) {
            user.restoreSession()
               .then(() => setInitial(false))
               .catch(err => showError(err.toString()))
         }
      },
      [initial, user, showError]
   )
   function doLogin({email, password}) {
      user.logIn(email, password)
         .then(() => {
            showError('')
            navigate(user.kind)
         })
         .catch(err => showError(err.toString()))
   }
   function doLogout() {
      user.logOut().finally(() => { navigate('/') })
   }
   if (initial) return ( <div className="app-wrapper"><Splash /></div> )
   else return (
      <div className="app-wrapper">
         <Routes>
            <Route path="/" element={<Splash onLogin={doLogin} />} />
            <Route path="owner/*" element={<Owner user={user} onLogout={doLogout} />} />
         </Routes>
         <p>{errorText}</p>
      </div>
   )
}

export default App
