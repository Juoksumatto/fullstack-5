const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

const users = [
  { username: 'noname', name: 'No Name', password: 'yesman' }
]

const blogs = [
  { id: 1, title: 'likes', author: 'Onni Hölttä', url: 'https://github.com/Juoksumatto/Fullstack-5', likes: 72376 },
]

app.post('/api/login', (req, res) => {
  const { username, password } = req.body

  const user = users.find(u => u.username === username && u.password === password)
  
  if (!user) {
    return res.status(401).json({ error: 'invalid username or password' })
  }

  const token = `token_${username}_${Date.now()}`
  
  res.json({
    token,
    username: user.username,
    name: user.name
  })
})

app.get('/api/blogs', (req, res) => {
  const token = req.get('authorization')
  
  if (!token) {
    return res.status(401).json({ error: 'token missing' })
  }

  res.json(blogs)
})

const PORT = process.env.PORT || 3003

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
