import { Link } from 'react-router-dom'
import styled from 'styled-components'
import Blog from './Blog'

const Navigation = styled.div`
  background: #e8e8e8;
  padding: 1rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 2rem;
`

const NavLink = styled(Link)`
  display: inline-block;
  margin-right: 1rem;
  text-decoration: none;
  color: #333;
  padding: 0.25rem 0;
  font-weight: 500;
  &:hover {
    color: #000;
  }
`

const LogoutButton = styled.button`
  background: #d32f2f;
  color: white;
  border: 1px solid #b71c1c;
  padding: 8px 14px;
  cursor: pointer;
  border-radius: 6px;
  min-width: 100px;
  font-weight: 700;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
  transition: background 150ms ease, transform 150ms ease;
  &:hover {
    background: #b71c1c;
    transform: translateY(-1px);
  }
`

const Message = styled.p`
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
  color: ${props => props.type === 'success' ? '#155724' : '#721c24'};
  background: ${props => props.type === 'success' ? '#d4edda' : '#f8d7da'};
  border: 1px solid ${props => props.type === 'success' ? '#c3e6cb' : '#f5c6cb'};
`

const Blogs = ({
  blogs,
  user,
  errorMessage,
  onLogout,
  onLike,
  onRemove
}) => {
  return (
    <div>

      <Navigation>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <NavLink to="/blogs">blogs</NavLink>

          {user && (
            <NavLink to="/blogs/new">
              new blog
            </NavLink>
          )}

          {!user && (
            <NavLink to="/">login</NavLink>
          )}
        </div>

        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span>
              {user.name || user.username} logged in
            </span>

            <LogoutButton onClick={onLogout}>
              logout
            </LogoutButton>
          </div>
        )}
      </Navigation>

      {errorMessage && (
        <Message type={errorMessage.toLowerCase().includes('created') ? 'success' : 'error'}>
          {errorMessage}
        </Message>
      )}

      {!user && (
        <p>Login to create blogs</p>
      )}

      <h2>blogs</h2>

      {blogs.map(blog => (
        <Blog
          key={blog.id}
          blog={blog}
          onLike={onLike}
          onRemove={onRemove}
          currentUser={user}
        />
      ))}
    </div>
  )
}

export default Blogs