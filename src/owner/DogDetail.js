import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useModel } from '../model/user.js'

function DogDetail ({user}) {
   const { dogId } = useParams(),
         [ dog, setDog ] = useModel(null),
         [ errorText, showError ] = useState('')
   useEffect(
      () => {
         if (! dog) {
            user.getDog(dogId)
               .then(d => { setDog(d) })
               .catch(err => { showError(err.toString) })
         }
      },
      [user, dog, dogId, setDog, showError]
   )
   if (errorText !== '') return (
      <div>{errorText}</div>
   )
   else if (! dog) return (
      <div>Loading...</div>
   )
   else {
      return (
         <div className="dog-detail-screen">
            <DogInfo dog={dog} />
            <DogWalks dog={dog} />
         </div>
      )
   }
}

export default DogDetail

function DogInfo ({dog}) {
   const [ edit, setEdit ] = useState(dog.id === ''),
         [ name, setName ] = useState(dog.name),
         [ breed, setBreed ] = useState(dog.breed),
         [ age, setAge ] = useState(dog.age)
   function endEdit (ev) {
      ev.preventDefault()
      dog.update({name, breed, age}).then(() => setEdit(false))
   }
   if (edit) return (
      <form className="dog-info" onSubmit={endEdit}>
         <p><label>Name:<br/>
            <input type="text" name="name" value={name} onChange={ev => setName(ev.target.value)} />
            </label></p>
         <p><label>Breed:<br/>
            <input type="text" name="breed" value={breed} onChange={ev => setBreed(ev.target.value)} />
            </label></p>
         <p><label>Age:<br/>
            <input type="text" name="age" value={age} onChange={ev => setAge(ev.target.value)} />
            </label></p>
         <p><button type="submit">Save</button>
            <button type="reset">Reset</button></p>
      </form>
   )
   else return (
      <div className="dog-info">
         <p>Name:<br/>{name}</p>
         <p>Breed:<br/>{breed}</p>
         <p>Age:<br/>{age}</p>
         <p><button type="button" onClick={() => setEdit(true)}>Edit details</button></p>
      </div>
   )
}

function DogWalks ({dog}) {
   function addWalk () {}
   return (
      <div className="dog-walks">
         <h4>Walks:</h4>
         <ul className="schedule">
            { dog.schedule.map((item, n) => ( <ScheduleItem item={item} key={n} /> )) }
         </ul>
         <p><button type="button" onClick={addWalk}>Request walk</button></p>
      </div>
   )
}

function ScheduleItem ({item}) {
   const [ days, slot ] = item
   return (
      <li>{days}: {slot}</li>
   )
}
