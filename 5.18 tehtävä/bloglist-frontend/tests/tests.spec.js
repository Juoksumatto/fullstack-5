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
})