const { response, request } = require('express')
const express = require('express')
// const morgan = require('morgan')
const app = express()
const cors = require('cors')

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

// app.get('/', (req, res) => {
//   res.send('<h1>Hello World!</h1>')
// })
app.get('/api/persons', (request, response) => {
    if (persons) {
        response.json(persons)
    } else {
        response.status(404).end()
    }
    
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    console.log(id)
    const person = persons.find(person => person.id === id)
    console.log(person)
    if (person) {
        res.json(person.number)
    } else {
        res.status(404).end()
    }
})

app.get('/info', (request, res) => {
    const info = {
        length: persons.length,
        time: String(new Date()),
    }
    console.log(info)
    res.send(`<p>Phonebook has info for ${info.length} people</p>
    <p>${info.time}</p>`)
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
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

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
