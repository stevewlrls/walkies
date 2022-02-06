const Users = [
   {
      id: '0123658', kind: 'owner',
      name: 'Janet Peach', email: 'janet.peach@gumail.com',
      address: 'Tree Tops|Wakebridge Road|Cumberton|Messex|DQ1 5RX',
      phone: '01257-765289'
   }
]

const Passwords = new Map([
   ['0123658', 'SunnySide']
])

const Dogs = [
   { id: '0301234', owner: '0123658', name: 'Poochy', breed: 'Cockerpoo', age: 2,
     schedule: [
        ['Mon-Fri', '09:30'],
     ]
   }
]

function newDog (data) {
   const lastId = Math.max(...Dogs.map(d => parseInt(d.id, 10))),
         nextId = ('000000' + (lastId + 1)).slice(-6),
         dog = {
            id: nextId,
            owner: data.owner,
            name: data.name,
            breed: data.breed,
            age: data.age,
            schedule: []
         }
   Dogs.push(dog)
   return dog
}

export class Server {
   static async fetch (uri) {
      const req = new URL(uri, window.location.href)
      switch (req.pathname) {
         case '/api/owner/dogs': {
            const owner = req.searchParams.get('owner'),
                  dogs = Dogs.filter(d => d.owner === owner)
            if (! dogs) throw new Error('Invalid owner id')
            return dogs
         }
         default:
            throw new Error('Bad api endpoint')
      }
   }

   static async send (uri, data) {
      const req = new URL(uri, window.location.href)
      switch (req.pathname) {
         case '/api/user/login': {
            const user = Users.find(u => u.email === data.email)
            if (! user || Passwords.get(user.id) !== data.password)
               throw new Error('Bad user or password')
            return Object.assign(user, {token: 'abcdef0123456789'})
         }
         case '/api/user/restore': {
            const user = Users.find(u => u.id === data.id)
            if (! user || data.token !== 'abcdef0123456789')
               throw new Error('Bad user or token')
            return Object.assign(user, {token: 'abcdef0123456789'})
         }
         case '/api/user/update': {
            const user = Users.find(u => u.id === data.id)
            if (! user) throw new Error('Bad user')
            if (Users.some(u => u.email === data.email && u !== user))
               throw new Error('Duplicate email address')
            user.name = data.name
            user.address = data.address
            user.email = data.email
            user.phone = data.phone
            return user
         }
         case '/api/dogs/update': {
            if (data.id === '') return newDog(data)
            const dog = Dogs.find(d => d.id === data.id)
            if (! dog) throw new Error('Bad dog')
            dog.name = data.name
            dog.breed = data.breed
            dog.age = data.age
            return dog
         }
         default:
            throw new Error('Bad api endpoint')
      }
   }
}
