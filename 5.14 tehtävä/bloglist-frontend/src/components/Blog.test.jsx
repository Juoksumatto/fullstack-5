import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { test, expect, vi } from 'vitest'

describe('Blog', () => {
  test('shows all when view button is clicked', async () => {
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

    const { rerender } = render(
      <Blog
        blog={blog}
        expanded={false}
        onToggle={mockOnToggle}
        onLike={mockOnLike}
        onRemove={mockOnRemove}
      />
    )

    expect(screen.queryByText(/github.com/i)).not.toBeInTheDocument()

    const viewButton = screen.getByRole('button', { name: /view/i })
    await user.click(viewButton)

    rerender(
      <Blog
        blog={blog}
        expanded={true}
        onToggle={mockOnToggle}
        onLike={mockOnLike}
        onRemove={mockOnRemove}
      />
    )

    expect(screen.getByText(/github.com/i)).toBeInTheDocument()

    expect(screen.getByText((content, element) => {
      return element.tagName === 'P' && content.includes('Likes:') && content.includes('7')
    })).toBeInTheDocument()

    expect(screen.getByText(/Likes:.*7/)).toBeInTheDocument()

    expect(screen.getByText('Onni Hölttä')).toBeInTheDocument()
  })
})