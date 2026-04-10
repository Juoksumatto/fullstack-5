const Blog = ({ blog, expanded, onToggle, onLike, onRemove }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleLike = async () => {
    try {
      await onLike(blog.id)
    } catch (error) {
      console.error('Failed to like blog:', error)
    }
  }

  const handleRemove = async () => {
    try {
      await onRemove(blog.id)
    } catch (error) {
      console.error('Failed to remove blog:', error)
    }
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {!expanded && blog.author}
        <button onClick={() => onToggle(blog.id)}>
          {expanded ? 'Hide' : 'View'}
        </button>
      </div>
      {expanded && (
        <div>
          <p>URL: {blog.url}</p>
          <p>Likes: {blog.likes || 0} <button onClick={handleLike}>Like</button></p>
          <p>{blog.author}</p>
          <button onClick={handleRemove}>remove</button>
        </div>
      )}
    </div>)
}

export default Blog