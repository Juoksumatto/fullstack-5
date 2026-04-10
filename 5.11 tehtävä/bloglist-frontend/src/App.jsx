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
  const [expandedBlogId, setExpandedBlogId] = useState(null)

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

  const handleLike = async (id) => {
    try {
      const updatedBlog = await blogService.like(id)
      setBlogs(blogs.map(blog => blog.id === id ? updatedBlog : blog))
    } catch (error) {
      console.error('Failed to like blog:', error)
      setErrorMessage('Failed to like blog')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const handleRemove = async (id) => {
    try {
      await blogService.remove(id)
      const updatedBlogs = await blogService.getAll()
      setBlogs(updatedBlogs)
      if (expandedBlogId === id) {
        setExpandedBlogId(null)
      }
    } catch (error) {
      console.error('Failed to remove blog:', error)
      setErrorMessage('Failed to remove blog')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const viewfullblog = (id) => {
    setExpandedBlogId(expandedBlogId === id ? null : id)
  }

  return (
    <div>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      {user ? (
        <div>
          <button onClick={handleLogout}>logout</button>
          <p>{user.name ? `${user.name} logged in` : `${user.username} logged in`}</p>
          <Newblog onBlogCreated={handleBlogCreated} onError={handleError} />
        </div>
      ) : (
        <div>
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
      )}

      <h2>blogs</h2>
      {blogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          expanded={expandedBlogId === blog.id}
          onToggle={viewfullblog}
          onLike={handleLike}
          onRemove={handleRemove}
        />
      )}
    </div>
  )
}

export default App