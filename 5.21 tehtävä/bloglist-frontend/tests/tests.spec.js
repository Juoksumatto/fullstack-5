const { test, describe, expect, beforeEach } = require('@playwright/test')

describe('Blog app', () => {
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
      await page.getByRole('button', { name: /like/i }).first().click()
      await expect(page.getByText(/Likes: 1/).first()).toBeVisible()
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

      const removeButtons = page.getByRole('button', { name: 'remove' })
      await removeButtons.last().click()

      await expect(page.getByText('blog to be deleted Onni Hölttä')).not.toBeVisible()
    })
  })
})
