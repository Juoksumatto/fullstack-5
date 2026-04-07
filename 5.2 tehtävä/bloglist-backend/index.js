const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

const users = [
  { username: 'noname', name: 'No Name', password: 'yesman' }
]

const blogs = [
  { id: 1, title: 'this is a blog post yup defineadly true dont doubt it its true', author: 'Onni Hölttä', url: 'https://github.com/Juoksumatto/Fullstack-5', likes: 72376 },
]

app.post('/api/login', (req, res) => {
  const { username, password } = req.body

  let user = users.find(u => u.username === username)

  if (!user) {
    user = { username, name: username, password }
    users.push(user)
  } else {
    if (user.password !== password) {
      return res.status(401).json({ error: 'invalid username or password' })
    }
  }

  const token = `token_${username}_${Date.now()}`

  res.json({
    token,
    username: user.username,
    name: user.name
  })
})

app.get('/api/blogs', (req, res) => {
  res.json(blogs)
})

const PORT = process.env.PORT || 3003

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
