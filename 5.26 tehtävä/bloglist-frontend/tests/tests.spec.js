const { test, describe, expect, beforeEach } = require('@playwright/test')

describe('Blog app', () => {
  test.describe.configure({ mode: 'serial' })

  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'No Name',
        username: 'noname',
        password: 'yesman'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible()
    await expect(page.getByLabel('username')).toBeVisible()
    await expect(page.getByLabel('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {

      await page.getByLabel('username').fill('noname')
      await page.getByLabel('password').fill('yesman')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('No Name logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByLabel('username').fill('')
      await page.getByLabel('password').fill('')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('please enter username and password')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByLabel('username').fill('noname')
      await page.getByLabel('password').fill('yesman')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('No Name logged in')).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()

      await page.getByLabel('title').fill('a new blog')
      await page.getByLabel('author').fill('Onni')
      await page.getByLabel('url').fill('https://github.com/Juoksumatto/fullstack-5')
      await page.getByRole('button', { name: /create/i }).click()

      await expect(page.getByText('Blog created succesfully')).toBeVisible()
      await expect(page.getByText('a new blog Onni')).toBeVisible()
    })

    test('blog can be liked', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByLabel('title').fill('blog')
      await page.getByLabel('author').fill('onni')
      await page.getByLabel('url').fill('https://github.com/Juoksumatto/fullstack-5')
      await page.getByRole('button', { name: /create/i }).click()
      await expect(page.getByText('Blog created succesfully')).toBeVisible()

      await page.getByRole('button', { name: /view/i }).first().click()
      await expect(page.getByText(/Likes: 0/).first()).toBeVisible()

      const likeButton = page.getByRole('button', { name: /like/i }).first()
      await likeButton.click()

      await expect(page.getByText(/Likes: 1/).first()).toBeVisible({ timeout: 10000 })
    })

    test('blog can be deleted by the user who created it', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByLabel('title').fill('blog to be deleted')
      await page.getByLabel('author').fill('Onni Hölttä')
      await page.getByLabel('url').fill('https://github.com/Juoksumatto/fullstack-5')
      await page.getByRole('button', { name: /create/i }).click()
      await expect(page.getByText('Blog created succesfully')).toBeVisible()

      const viewButtons = page.getByRole('button', { name: 'View' })
      await viewButtons.last().click()

      const removeButton = page.getByRole('button', { name: 'remove' }).last()
      await expect(removeButton).toBeVisible()

      page.on('dialog', async dialog => {
        expect(dialog.message()).toContain('Remove blog')
        await dialog.accept()
      })

      await removeButton.click()

      await expect(page.getByText('blog to be deleted Onni Hölttä')).not.toBeVisible()
    })

    test('Only blog creator can see remove button', async ({ page, request }) => {
      await request.post('http://localhost:3003/api/users', {
        data: { username: 'mrnobody', name: 'Mr Nobody', password: 'nopassword' }
      })

      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByLabel('title').fill('blog to be deleted')
      await page.getByLabel('author').fill('Onni Hölttä')
      await page.getByLabel('url').fill('https://github.com/Juoksumatto/fullstack-5')
      await page.getByRole('button', { name: /create/i }).click()
      await expect(page.getByText('Blog created succesfully')).toBeVisible()

      await page.getByRole('button', { name: 'View' }).last().click()
      await expect(page.getByRole('button', { name: 'remove' }).last()).toBeVisible()

      await page.getByRole('button', { name: 'logout' }).click()
      await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible()

      await page.getByLabel('username').fill('mrnobody')
      await page.getByLabel('password').fill('nopassword')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('Mr Nobody logged in')).toBeVisible()

      await page.reload()
      await expect(page.getByRole('heading', { name: 'blogs' })).toBeVisible()

      await page.waitForFunction(() => {
        return document.querySelectorAll('.blog').length > 0
      }, { timeout: 15000 })

      const blogs = page.locator('.blog')
      const lastBlog = blogs.last()
      await lastBlog.getByRole('button', { name: 'View' }).click()
      await expect(lastBlog.getByRole('button', { name: 'remove' })).not.toBeVisible()
    })

    test('blogs are ordered according to likes', async ({ page }) => {
      const timestamp = Date.now()
      const titleHigh = `most liked ${timestamp}`
      const titleLow = `least liked ${timestamp}`

      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByLabel('title').fill(titleLow)
      await page.getByLabel('author').fill('Author')
      await page.getByLabel('url').fill('https://example.com/1')
      await page.getByRole('button', { name: /create/i }).click()
      await expect(page.getByText('Blog created succesfully')).toBeVisible()

      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByLabel('title').fill(titleHigh)
      await page.getByLabel('author').fill('Author')
      await page.getByLabel('url').fill('https://example.com/2')
      await page.getByRole('button', { name: /create/i }).click()
      await expect(page.getByText('Blog created succesfully')).toBeVisible()

      const highBlog = page.locator('.blog').filter({ hasText: titleHigh }).first()
      await highBlog.getByRole('button', { name: /view/i }).click()
      await expect(highBlog.getByText(/Likes: 0/)).toBeVisible()

      const likeButton = highBlog.getByRole('button', { name: /like/i })
      const responsePromise = page.waitForResponse(res =>
        res.url().includes('/api/blogs/') && res.request().method() === 'PUT'
      )
      await likeButton.click()
      await responsePromise
      await expect(highBlog.getByText(/Likes: 1/)).toBeVisible({ timeout: 10000 })

      await page.reload()
      await expect(page.getByRole('heading', { name: 'blogs' })).toBeVisible()
      const blogs = page.locator('.blog')
      await expect(blogs.first()).toContainText(titleHigh)
      await expect(blogs.last()).toContainText(titleLow)
    })
  })
})