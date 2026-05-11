import { Link } from 'react-router-dom'
import Blog from './Blog'
import Newblog from './Newblog'

const Blogs = ({
  blogs,
  user,
  errorMessage,
  onLogout,
  onBlogCreated,
  onError,
  onLike,
  onRemove,
  expandedBlogId,
  onToggle
}) => {
  return (
    <div>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <Link to="/blogs">Blogs</Link>
        {user ? (
          <button onClick={onLogout}>Logout</button>
        ) : (
          <Link to="/">Login</Link>
        )}
      </div>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      {user ? (
        <div>
          <p>{user.name ? `${user.name} logged in` : `${user.username} logged in`}</p>
          <Newblog onBlogCreated={onBlogCreated} onError={onError} />
        </div>
      ) : (
        <p>Login to create blogs</p>
      )}

      <h2>blogs</h2>
      {blogs.map(blog => (
        <Blog
          key={blog.id}
          blog={blog}
          expanded={expandedBlogId === blog.id}
          onToggle={onToggle}
          onLike={onLike}
          onRemove={onRemove}
          currentUser={user}
        />
      ))}
    </div>
  )
}

export default Blogs
