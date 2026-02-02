# @captchacat/vue

Vue 3 integration for Captchacat.

GitHub: https://github.com/Captchacat-Integrations/Vue

## Installation

```bash
npm install @captchacat/vue
```

## Usage

### Basic Form

The captcha widget automatically adds a hidden `captchacat-token` field to the parent form.

```vue
<template>
  <form action="/api/login" method="POST">
    <input name="email" type="email" />
    <input name="password" type="password" />
    <Captchacat site-key="your-site-key" />
    <button type="submit">Login</button>
  </form>
</template>

<script setup>
import { Captchacat } from "@captchacat/vue";
</script>
```

### With Callback

Use `@verify` event to know when verification completes.

```vue
<template>
  <Captchacat site-key="your-site-key" @verify="handleVerify" />
</template>

<script setup>
const handleVerify = (token: string) => {
  console.log('Verified!', token)
}
</script>
```

## Server-Side Validation

```ts
// Nuxt 3: server/api/login.post.ts
import { validateCaptchacatToken } from "@captchacat/vue/server";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const token = body["captchacat-token"];

  const result = await validateCaptchacatToken({
    apiKey: process.env.CAPTCHACAT_API_KEY!,
    token,
  });

  if (!result.valid) {
    throw createError({ statusCode: 403, message: "Captcha failed" });
  }

  // Proceed with login...
});
```

## API

### `<Captchacat />`

| Prop       | Type     | Required | Description                      |
| ---------- | -------- | -------- | -------------------------------- |
| `site-key` | `string` | Yes      | Your site key from the dashboard |

| Event    | Payload  | Description                     |
| -------- | -------- | ------------------------------- |
| `verify` | `string` | Emitted on verification success |

### `validateCaptchacatToken(options)`

| Option   | Type     | Required |
| -------- | -------- | -------- |
| `apiKey` | `string` | Yes      |
| `token`  | `string` | Yes      |

Returns: `Promise<{ valid: boolean, message?: string, rawResponse?: unknown }>`
