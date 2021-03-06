/* eslint-disable linebreak-style */
const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const Person = require('./models/person')
// const cool = require('cool-ascii-faces')
// const morgan = require('morgan')
const app = express()
const cors = require('cors')

app.use(express.static('build'))
app.use(cors())
app.use(express.json())

// app.use(morgan('combined'))
// const morg = morgan('tiny')
const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(result => {
    console.log('connected to MongoDB')
    console.log(result)
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}


const requestLogger = (request, response, next) => {
  console.log('Method: ', request.method)
  console.log('Path: ', request.path)
  console.log('Body: ', request.body)
  console.log('---')
  next()
}

app.use(requestLogger)

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.get('/info', (request, response) => {
  const info = {
    length: Person.findAll().length,
    time: String(new Date()),
  }
  console.log(info)
  response.send(`<p>Phonebook has info for ${info.length} people</p>
    <p>${info.time}</p>`)
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
      console.log(result)
    })
    .catch(error => next(error))
})


// Uusi henkil?? luetteloon
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({
      error: 'name missing'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })
  // .then(savedPerson => savedPerson.toJSON())
  person.save()
    .then(savedAndFormattedPerson => {
      response.json(savedAndFormattedPerson)
    })
    .catch(error => next(error))

})

// Henkil??n numeron muutoksen k??sittely.
// app.put('/api/persons/:id', (request, response, next) => {
//     const body = request.body
//     const person = {
//       name: body.name,
//       number: body.number,
//     }

//     Person.findByIdAndUpdate(request.params.id, person, { new: true })
//       .then(updatedPerson => {
//         response.json(updatedPerson)
//       })
//       .catch(error => next(error))
//   })



const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
