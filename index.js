const express = require('express')
// const cool = require('cool-ascii-faces')
// const morgan = require('morgan')
const app = express()
const cors = require('cors')

app.use(express.static('build'))
app.use(cors())
app.use(express.json())

// app.use(morgan('combined'))
// const morg = morgan('tiny')


let persons = [
    {
      "id": 1,
      "name": "Arto Hellas",
      "number": "040-123456"
    },
    {
      "id": 2,
      "name": "Ada Lovelace",
      "number": "23-24-453544"
    },
    {
      "id": 3,
      "name": "Dan Abramov",
      "number": "12-43-234545"
    },
    {
      "id": 4,
      "name": "Mary Poppendick",
      "number": "44-3432242"
    }
  ]

const requestLogger = (request, response, next) => {
    console.log('Method: ', request.method)
    console.log('Path: ', request.path)
    console.log('Body: ', request.body)
    console.log('---')
    next()
}

app.use(requestLogger)


console.log('get ennen')
app.get('/', (req, res) => {
    console.log('get sisällä')
    res.send('<h1>Backend toimii!</h1>')
})
console.log('get jälkeen')

app.get('/api/persons', (req, res) => {
    console.log('api persons sisällä')
    if (persons) {
        res.json(persons)
    } else {
        res.status(404).end()
    }
})
console.log('api persons jälkeen')

// app.get('/cool', (req, res) => res.send(cool()))

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log(id)
    const person = persons.find(person => person.id === id)
    console.log(person)
    if (person) {
        response.json(person.number)
    } else {
        response.status(404).end()
    }
})

app.get('/info', (request, response) => {
    const info = {
        length: persons.length,
        time: String(new Date()),
    }
    console.log(info)
    response.send(`<p>Phonebook has info for ${info.length} people</p>
    <p>${info.time}</p>`)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const generateId = () => {
    const maxId = persons.length > 0
        ? Math.floor(20*Math.random())
        : 0
    return maxId + 1
} 

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number,
    }
    persons.concat(person)

    response.json(person)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
