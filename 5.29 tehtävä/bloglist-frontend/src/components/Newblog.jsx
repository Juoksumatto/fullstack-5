import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import blogService from '../services/blogs'
import { Table, TableBody, TableCell, TableContainer, TableRow, Paper } from '@mui/material'

const Newblog = ({ onBlogCreated, onError }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!title || !author || !url) {
      onError('please fill in all fields')
      return
    }

    try {
      const newBlog = await blogService.create({ title, author, url })
      onBlogCreated(newBlog)
      setSuccessMessage('Blog created succesfully' )
      setTitle('')
      setAuthor('')
      setUrl('')

      setTimeout(() => {
        setSuccessMessage('')
        navigate('/blogs')
      }, 3000)
    } catch {
      onError('blog creation failed')
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <Link to="/blogs">Back to blogs</Link>
      </div>
      <h2>Create a new blog</h2>

      {successMessage && (
        <div style={{
          color: 'green',
          background: 'lightgrey',
          fontSize: '20px',
          borderStyle: 'solid',
          borderRadius: '5px',
          padding: '10px',
          marginBottom: '10px'
        }}>
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <TableContainer component={Paper} sx={{ maxWidth: 300 }}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>
                  <label htmlFor="title">Title</label>
                </TableCell>
                <TableCell>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={({ target }) => setTitle(target.value)}
                    required
                    style={{ width: '100%' }}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <label htmlFor="author">Author</label>
                </TableCell>
                <TableCell>
                  <input
                    id="author"
                    type="text"
                    value={author}
                    onChange={({ target }) => setAuthor(target.value)}
                    required
                    style={{ width: '100%' }}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <label htmlFor="url">URL</label>
                </TableCell>
                <TableCell>
                  <input
                    id="url"
                    type="text"
                    value={url}
                    onChange={({ target }) => setUrl(target.value)}
                    required
                    style={{ width: '100%' }}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={2} align="right">
                  <button type="submit" style={{ minWidth: 120 }}>create</button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </form>
    </div>
  )
}

export default Newblog