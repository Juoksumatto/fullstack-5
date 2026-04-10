import { useState } from 'react'
import blogService from '../services/blogs'

const Newblog = ({ onBlogCreated, onError }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [isVisible, setIsVisible] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    
    if (!title || !author || !url) {
      onError('please fill in all fields')
      return
    }

    try {
      const newBlog = await blogService.create({ title, author, url })
      onBlogCreated(newBlog)
      setTitle('')
      setAuthor('')
      setUrl('')
      setIsVisible(false)
    } catch {
      onError('blog creation failed')
    }
  }

  const hideWhenVisible = { display: isVisible ? 'none' : '' }
  const showWhenVisible = { display: isVisible ? '' : 'none' }

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={() => setIsVisible(true)}>create new blog</button>
      </div>
      <div style={showWhenVisible}>
        <h2>Create a new blog</h2>
        <form onSubmit={handleSubmit}>
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
              <button type="button" onClick={() => setIsVisible(false)}>cancel</button>
            </div>
        </form>
      </div>
    </div>
  )
}

export default Newblog