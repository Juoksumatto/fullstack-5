const Blog = ({ blog, expanded, onToggle }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
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
          <p>Likes: {blog.likes || 0} <button>Like</button></p>
          <p>{blog.author}</p>
        </div>
      )}
    </div>)
}

export default Blog