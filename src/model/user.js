import { useState, useEffect } from 'react'
import { Server } from './server.js'
import { Dog } from './dog.js'

const LS_Key = '_mdSavedSession'

export class User {
   constructor (from) {
      if (from) Object.assign(this, from)
      else this._reset()
   }

   onChange (fn) {
      this._onChange = fn
   }

   async logIn (email, password) {
      return Server.send('/api/user/login', {email, password})
         .then(rsp => {
            Object.assign(this, rsp)
            this.saveSession()
         })
   }

   async logOut () {
      return Server.send('/api/user/logout')
         .finally(() => {
            window.localStorage.removeItem(LS_Key)
            this._reset()
         })
   }

   async restoreSession () {
      const saved = window.localStorage.getItem(LS_Key)
      if (saved) {
         return Server.send('/api/user/restore', JSON.parse(saved))
            .then(rsp => {
               Object.assign(this, rsp)
            })
      }
      else return null
   }

   saveSession () {
      window.localStorage.setItem(LS_Key, JSON.stringify({
         id: this.id,
         token: this.token
      }))
   }

   async allDogs () {
      return Server.fetch(`/api/owner/dogs?owner=${this.id}`)
         .then(rsp => rsp.map(d => new Dog(d)))
   }

   async getDog (id) {
      if (id === 'new') return new Dog({owner: this.id})
      return this.allDogs().then(dogs => {
         const dog = dogs.find(d => d.id === id)
         if (! dog) throw new Error('No such dog')
         return dog
      })
   }

   _reset () {
      this.id = ''
      this.name = ''
      this.email = ''
      this.kind = ''
      this.address = null
      this.phone = null
      this.token = null
      this._onChange = null
   }

   update (det) {
      const data = {
         id: this.id,
         token: this.token,
         name: det.name || this.name,
         email: det.email || this.email,
         address: det.address || this.address,
         phone: det.phone || this.phone
      }
      return Server.send('/api/user/update', data).then(rsp => {
         if (this._onChange) {
            const to = new User(this)
            Object.assign(to, data)
            this._onChange(to)
         }
      })
   }

   get loggedIn () { return this.id !== '' }
}

export function useModel (obj) {
   const [ item , setItem ] = useState(obj)
   useEffect(
      () => {
         if (item) item.onChange(to => { setItem(to) })
      },
      [item]
   )
   return [item, setItem]
}
