const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}
if (process.argv.length===3) {
    console.log('phonebook')
    Person
        .find({})
        .then(person => {
            console.log(`${Person.name} ${Person.number}`)
            mongoose.connection.close()
        })
}

const PASSWORD = process.argv[2]

const new_name = process.argv[3]

const new_number = process.argv[4]

const url =
  `mongodb+srv://Juhani:${PASSWORD}@cluster0.m28hx.mongodb.net/people?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)
 
// const person = new Person({
//   name: 'Richard Feynman',
//   number: '044-458755',
// })

Person.find({}).then(result => {
  result.forEach(person => {
      console.log(person)
  })
  mongoose.connection.close()
})

// person.save().then(response => {
//   console.log(`Added ${new_name} number ${new_number} to phonebook!`)
//   mongoose.connection.close()
// })