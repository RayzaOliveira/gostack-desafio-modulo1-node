const express = require('express')
const cors = require('cors')

const { v4: uuid } = require('uuid')

const app = express()

app.use(express.json())
app.use(cors())

const ERRORS = {
  notExists: 'Repository does not exists.',
}

const repositories = []

app.get('/repositories', (request, response) => {
  return response.status(200).json(repositories)
})

app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    techs,
    url,
    likes: 0,
  }

  repositories.push(repository)

  return response.json(repository)
})

app.put('/repositories/:id', (request, response) => {
  const { title, url, techs } = request.body
  const { id } = request.params

  const foundRepositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  )

  if (foundRepositoryIndex === -1) {
    return response.status(400).json({ error: ERRORS.notExists })
  }

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[foundRepositoryIndex].likes,
  }

  repositories[foundRepositoryIndex] = repository

  return response.json(repository)
})

app.delete('/repositories/:id', (request, response) => {
  const { id } = request.params

  const foundRepositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  )

  if (foundRepositoryIndex >= 0) {
    repositories.splice(foundRepositoryIndex, 1)
  } else {
    return response.status(400).json({ error: ERRORS.notExists })
  }

  return response.status(204).send()
})

app.post('/repositories/:id/like', (request, response) => {
  const { id } = request.params

  const foundRepositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  )

  if (foundRepositoryIndex === -1) {
    return response.status(400).json({ error: ERRORS.notExists })
  }

  repositories[foundRepositoryIndex].likes += 1

  return response.json(repositories[foundRepositoryIndex])
})

module.exports = app
