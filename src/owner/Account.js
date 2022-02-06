import { useState } from 'react'
import './Account.css'

function Account ({user}) {
   const [edit, setEdit] = useState(false),
         [name, setName] = useState(user.name),
         [addr, setAddress] = useState(user.address.split('|').join("\n")),
         [email, setEmail] = useState(user.email),
         [phone, setPhone] = useState(user.phone)
   function endEdit (ev) {
      ev.preventDefault()
      setAddress(
         addr.split("\n")
            .map(s => s.trim().replace(/\s*,$/, ''))
            .filter(s => s !== '')
            .join("\n")
      )
      user.update({name, address: addr.split("\n").join('|'), email, phone})
         .then(() => setEdit(false))
   }
   if (edit) return (
      <form className="account-screen" onSubmit={endEdit}>
         <p><label>Name:<br/>
            <input type="text" name="name" value={name} onChange={ev => setName(ev.target.value)} />
         </label></p>
         <p><label>Address:<br/>
            <textarea name="address" value={addr} onChange={ev => setAddress(ev.target.value)} />
         </label></p>
         <p><label>Email:<br/>
            <input type="email" name="email" value={email} onChange={ev => setEmail(ev.target.value)} />
         </label></p>
         <p><label>Tel:<br/>
            <input type="tel" name="phone" value={phone} onChange={ev => setPhone(ev.target.value)} />
         </label></p>
         <p><button type="submit">Save details</button>
            <button type="reset">Reset</button></p>
      </form>
   )
   else return (
      <div className="account-screen">
         <p>Name:<br/>{name}</p>
         <p>Address:<br/><span className="address">{addr}</span></p>
         <p>Email:<br/>{email}</p>
         <p>Tel:<br/>{phone}</p>
         <p><button type="button" onClick={() => setEdit(true)}>Edit details</button></p>
      </div>
   )
}

export default Account
