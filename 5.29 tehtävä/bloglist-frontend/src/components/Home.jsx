import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import loginService from '../services/login'
import blogService from '../services/blogs'
import { Table, TableBody, TableCell, TableContainer, TableRow, Paper } from '@mui/material'

const Home = ({ user, onLoginSuccess, onLogout }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError('')
      const user = await loginService.login({ username, password })
      blogService.setToken(user.token)
      localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      setUsername('')
      setPassword('')
      if (onLoginSuccess) {
        onLoginSuccess(user)
      }
      navigate('/blogs')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    }
  }

  if (user) {
    return (
      <div>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <Link to="/blogs">Blogs</Link>
          <button onClick={handleLogout}>Logout</button>
        </div>
        <h1>Welcome, {user.name || user.username}!</h1>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <Link to="/blogs">Blogs</Link>
        <Link to="/">Login</Link>
        <Link to="/blogs/new">New Blog</Link>
      </div>
      <h1>Login</h1>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={handleLogin}>
        <TableContainer component={Paper} sx={{ marginTop: 2, maxWidth: 450 }}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>
                  <label htmlFor="username">Username</label>
                </TableCell>
                <TableCell>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    style={{ width: '100%' }}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <label htmlFor="password">Password</label>
                </TableCell>
                <TableCell>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ width: '100%' }}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={2} align="right">
                  <button type="submit" disabled={loading} style={{ minWidth: 120 }}>
                    {loading ? 'Logging in...' : 'Login'}
                  </button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </form>
    </div>
  )
}

export default Home