import { useParams, Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'

const BlogDetail = ({ blogs, onLike, onRemove, currentUser }) => {
  const id = Number(useParams().id)
  const blog = blogs.find(b => b.id === id)
  const navigate = useNavigate()

  if (!blog) {
    return <div>Blog not found</div>
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

  const isCreator =
    currentUser &&
    blog.userId === currentUser.username

  const Button = styled.button`
  border: 2px solid lightblue;
  background-color: white;
  font-size: 16px;
  padding: 5px 10px;
  margin-right: 5px;
  margin-left: 7px;
  cursor: pointer;
  &: hover {
    background-color: lightblue;
    transfoerm: translateY(-1px);
  }
  `

  const Rbutton = styled.button`
  border: 2px solid red;
  background-color: white;
  font-size: 16px;
  padding: 5px 10px;
  cursor: pointer;
  &: hover { 
    background-color: red;
    color: white;}
    transform: translateY(-1px);
  `

  const Div = styled.div`
  border: 1px solid lightgray;
  padding: 10px;
  margin-bottom: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  background-color: #f9f9f9;
  `

  const BButton = styled.button`
  display: inline-block;
  border: 2px solid blue;
  background-color: white;
  font-size: 16px;
  padding: 5px 10px;
  text-decoration: text;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    background-color: blue;
    color: white;
  }
  `

  if (currentUser) {
    return (
      <Div>
        <h2>{blog.title}</h2>
        <p>Author: {blog.author}</p>
        <p>URL: <a href={blog.url} target="_blank" rel="noopener noreferrer">{blog.url}</a></p>
        <p>Likes: {blog.likes || 0} <Button onClick={handleLike}>Like</Button>{isCreator && <Rbutton onClick={handleRemove}>remove</Rbutton>}</p>
        <br />
        <BButton onClick={() => navigate('/blogs')}>Back to blogs</BButton>
      </Div>
    )
  }

  return (
    <Div>
      <h2>{blog.title}</h2>
      <p>Author: {blog.author}</p>
      <p>URL: <a href={blog.url} target="_blank" rel="noopener noreferrer">{blog.url}</a></p>
      <p>Likes: {blog.likes || 0} </p>
      {isCreator && <button onClick={handleRemove}>remove</button>}
      <br />
      <Link to="/blogs">Back to blogs</Link>
    </Div>
  )
}

export default BlogDetail