import { validateByebotToken } from '@byebot/vue/server'

export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event)
  if (!formData) {
    throw createError({ statusCode: 400, message: 'Invalid form data' })
  }

  // Parse form fields
  const fields: Record<string, string> = {}
  for (const field of formData) {
    if (field.name && field.data) {
      fields[field.name] = field.data.toString()
    }
  }

  const { username, 'byebot-token': token } = fields

  // Validate captcha token
  if (!token) {
    throw createError({ statusCode: 400, message: 'Captcha token missing' })
  }

  const result = await validateByebotToken({
    apiKey: 'd4d23b11b464dcc984ad',
    token,
  })

  if (!result.valid) {
    throw createError({
      statusCode: 403,
      message: 'Captcha validation failed',
    })
  }

  // Captcha valid - in a real app, you would verify credentials here
  console.log('Login attempt:', { username })

  return { success: true, username }
})
