import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import { test } from 'vitest'

describe('Blog', () => {
  test('renders title and author', () => {
    const blog = {
      title: 'this a test blog',
      author: 'Onni Hölttä',
      url: 'https://github.com/Juoksumatto/fullstack-5',
      likes: 7,
    }

    render(<Blog blog={blog} />)

    screen.debug()

    expect(screen.getByText(/this a test blog/i)).toBeDefined()
    expect(screen.getByText(/Onni Hölttä/i)).toBeDefined()
    expect(screen.queryByText('https://github.com/Juoksumatto/fullstack-5')).toBeNull()
    expect(screen.queryByText('7')).toBeNull()
  })
})