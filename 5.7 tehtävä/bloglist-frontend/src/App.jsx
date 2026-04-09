import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Newblog from './components/newblog'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [expandedBlogId, exspandedblog] = useState(null)

  useEffect(() => {
    const loggedUserJSON = localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('loggedBlogAppUser')
    blogService.setToken(null)
  }

  const handleLogin = async event => {
    event.preventDefault()
    
    if (!username || !password) {
      setErrorMessage('please enter username and password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      return
    }

    console.log('logging in with', username, password)

    try {
      const user = await loginService.login({ username, password })
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
    } catch (error) {
      console.error('Login failed:', error)
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }
  const handleBlogCreated = (newBlog) => {
    setBlogs(blogs.concat(newBlog))
    setErrorMessage(null)
  }

  const handleError = (message) => {
    setErrorMessage(message)
    setTimeout(() => setErrorMessage(null), 5000)
  }

  const viewfullblog = (id) => {
    exspandedblog(expandedBlogId === id ? null : id)
  }
  if (!user) {
    return (
      <div>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div>
            <label>
              username
              <input
                type="text"
                value={username}
                onChange={({ target }) => setUsername(target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              password
              <input
                type="password"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
              />
            </label>
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <button onClick={handleLogout}>logout</button>

      <h2>blogs</h2>
      <p>{user.name ? `${user.name} logged in` : `${user.username} logged in`}</p>
      {blogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          expanded={expandedBlogId === blog.id}
          onToggle={viewfullblog}
        />
      )}
      <Newblog onBlogCreated={handleBlogCreated} onError={handleError} />

    </div>
  )
}

export default App