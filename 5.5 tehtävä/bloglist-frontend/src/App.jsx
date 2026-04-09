import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [blogCVisible, setblogCVisible] = useState(false)

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

  const CreateBlog = async event => {
    event.preventDefault()

    if (!title || !author || !url) {
      setErrorMessage('please fill in all fields')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      return
    }

    try {
      const newBlog = await blogService.create({ title, author, url })
      setBlogs(blogs.concat(newBlog))
      setTitle('')
      setAuthor('')
      setUrl('')
      setErrorMessage(null)
    } catch (error) {
      console.error('Blog creation failed:', error)
      setErrorMessage('blog creation failed')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const blogCForm = () => { 
    const hideWhenVisible = { display: blogCVisible ? 'none' : '' }
    const showWhenVisible = { display: blogCVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setblogCVisible(true)}>create new blog</button>
        </div>
        <div style={showWhenVisible}>
          <h2>Create a new blog</h2>
          <form onSubmit={CreateBlog}>
            <div>
              <label> title:
                <input 
                  type="text"
                  value={title}
                  onChange={({ target }) => setTitle(target.value)} />
              </label>
            </div>
            <div>
              <label> author:
                <input 
                  type="text"
                  value={author} 
                  onChange={({ target }) => setAuthor(target.value)}
                />
              </label>
            </div>
            <div>
              <label> url:
                <input 
                  type="text"
                  value={url} 
                  onChange={({ target }) => setUrl(target.value)}
                />
              </label>
            </div>
            <div>
              <button type="submit">create</button>
              <button type="button" onClick={() => setblogCVisible(false)}>cancel</button>
            </div>
          </form>
        </div>
      </div>
    )
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
      {blogs.length === 0 ? (
        <p>No blogs made by user</p>
      ) : (
        blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )
      )}

      {blogCForm()}
    </div>
  )
}

export default App