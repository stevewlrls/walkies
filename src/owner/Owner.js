import { useState, useMemo, useEffect } from 'react'
import { Routes, Route, Outlet, useNavigate } from 'react-router-dom'
import Account from './Account.js'
import DogDetail from './DogDetail.js'
import './Owner.css'

function Owner ({user, onLogout}) {
   return (
      <div className="owner-screen">
         <AccountInfo user={user} />
         <Outlet />
         <Routes>
            <Route index element={<OwnerSummary user={user} />} />
            <Route path="account" element={<Account user={user} />} />
            <Route path="dog/:dogId" element={<DogDetail user={user} />} />
         </Routes>
      </div>
   )
}

export default Owner

function AccountInfo ({user}) {
   const navigate = useNavigate()
   return (
      <div className="account-info">
         <span>{user.name}</span>
         <span className="material-icons account-button" onClick={() => navigate('account')}>account_circle</span>
      </div>
   )
}

function OwnerSummary ({user}) {
   const [dogs, setDogs] = useState(null),
         [errorText, showError] = useState(''),
         nextWalk = useMemo(
            () => dogs ? dogs.reduce((w,d) => d.nextWalk(w), null) : null,
            [dogs]
         ),
         navigate = useNavigate()
   useEffect(
      () => {
         user.allDogs()
            .then(list => setDogs(list))
            .catch(err => showError(err.toString()))
      }, [user, setDogs, showError]
   )
   function newDog () { navigate('dog/new') }
   if (errorText !== '') return (
      <div>{errorText}</div>
   )
   else if (! dogs) return (
      <div>Loading...</div>
   )
   else return (
      <div className="owner-summary">
         <WalkSummary walk={nextWalk} />
         <h4>Dogs:</h4>
         <ul className="dog-list">
            { dogs.map(d => <DogSummary dog={d} key={d.id} />) }
         </ul>
         <p><button type="button" onClick={newDog}>New dog</button></p>
      </div>
   )
}

function WalkSummary ({walk, onClick}) {
   if (! walk) return (
      <div className="next-walk">No walks!</div>
   )
   const day = walk.toLocaleDateString([], {weekday: 'long'}),
         date = walk.toLocaleDateString([], {dateStyle: 'medium'}),
         time = walk.toLocaleTimeString([], {timeStyle: 'short'})
   return (
      <div className="next-walk" onClick={onClick}>
         <b>Next walk:</b><br/>{day}<br/>{date}<br/>{time}
      </div>
   )
}

function DogSummary ({dog}) {
   const schedule = useMemo(() => dog.scheduleDays(), [dog]),
         navigate = useNavigate()
   return (
      <div className="dog-summary" onClick={() => navigate(`dog/${dog.id}`)}>
         {dog.name}<br/><span className="schedule-days">{schedule}</span>
      </div>
   )
}
