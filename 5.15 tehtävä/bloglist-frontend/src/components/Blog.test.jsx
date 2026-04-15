import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { test, expect, vi } from 'vitest'

describe('Blog', () => {
  test('like woks twice when clicked twice', async () => {
    const blog = {
      title: 'this a test blog',
      author: 'Onni Hölttä',
      url: 'https://github.com/Juoksumatto/fullstack-5',
      likes: 7,
      user: { name: 'Onni' }
    }

    const mockOnToggle = vi.fn()
    const mockOnLike = vi.fn()
    const mockOnRemove = vi.fn()

    const user = userEvent.setup()

    render(
      <Blog
        blog={blog}
        expanded={true}
        onToggle={mockOnToggle}
        onLike={mockOnLike}
        onRemove={mockOnRemove}
      />
    )

    const likeButton = screen.getByRole('button', { name: /like/i })

    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockOnLike).toHaveBeenCalledTimes(2)
    expect(mockOnLike).toHaveBeenNthCalledWith(1, blog.id)
    expect(mockOnLike).toHaveBeenNthCalledWith(2, blog.id)
  })
})