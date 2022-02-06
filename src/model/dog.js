import { Server } from './server.js'

const Weekdays = [
   'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Mon-Fri', 'Sat-Sun'
]

export class Dog {
   constructor (d) {
      this.id = ''
      this.owner = ''
      this.name = ''
      this.breed = ''
      this.age = ''
      this.schedule = []
      this._onChange = null
      if (d) Object.assign(this, d)
   }

   onChange (fn) {
      this._onChange = fn
   }

   nextWalk (after) {
      const walks = []
      const d = new Date(),
            today = d.getDay(),
            now = d.toTimeString().slice(0, 5)
      function addWalk (day, slot) {
         const when = new Date(d),
               hms = slot.split(':').map(t => parseInt(t, 10))
         when.setDate(when.getDate() + (day - today) + (day < today || slot < now ? 7 : 0))
         when.setHours(hms[0], hms[1], 0)
         walks.push(when)
      }
      this.schedule.forEach(([days, time]) => {
         const day = Weekdays.indexOf(days)
         switch (day) {
            case 7: // week days
               for (let d = 1; d < 6; d++) addWalk(d, time)
               break
            case 8: // week-ends
               addWalk(0, time); addWalk(6, time)
               break
            default:
               addWalk(day, time)
         }
      })
      return walks.reduce(
         (a,w) => (a === null || w.getTime() < a.getTime() ? w : a),
         after
      )
   }

   scheduleDays () {
      const schedule = Array(7).fill('-')
      this.schedule.forEach(([days, time]) => {
         const day = Weekdays.indexOf(days)
         switch (day) {
            case 7: // week days
               for (let d = 1; d < 6; d++) schedule[d] = Weekdays[d].slice(0, 1)
               break
            case 8: // week-ends
               schedule[0] = schedule[6] = 'S'
               break
            default:
               schedule[day] = Weekdays[day].slice(0, 1)
         }
      })
      return schedule.join('')
   }

   update (det) {
      const data = {
         id: this.id,
         owner: this.owner,
         name: det.name || this.name,
         breed: det.breed || this.breed,
         age: det.age || this.age
      }
      return Server.send('/api/dogs/update', data)
         .then(rsp => {
            if (this._onChange) {
               const to = new Dog(this)
               Object.assign(to, data, {id: rsp.id})
               this._onChange(to)
            }
         })
   }
}
