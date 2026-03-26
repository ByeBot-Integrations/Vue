# @byebot/vue

Vue 3 integration for Byebot.

GitHub: https://github.com/ByeBot-Integrations/Vue

## Installation

```bash
npm install @byebot/vue
```

## Usage

### Basic Form

The captcha widget automatically adds a hidden `byebot-token` field to the parent form.

```vue
<template>
  <form action="/api/login" method="POST">
    <input name="email" type="email" />
    <input name="password" type="password" />
    <Byebot site-key="your-site-key" />
    <button type="submit">Login</button>
  </form>
</template>

<script setup>
import { Byebot } from "@byebot/vue";
</script>
```

### With Callback

Use `@verify` event to know when verification completes.

```vue
<template>
  <Byebot site-key="your-site-key" @verify="handleVerify" />
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
import { validateByebotToken } from "@byebot/vue/server";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const token = body["byebot-token"];

  const result = await validateByebotToken({
    apiKey: process.env.BYEBOT_API_KEY!,
    token,
  });

  if (!result.valid) {
    throw createError({ statusCode: 403, message: "Captcha failed" });
  }

  // Proceed with login...
});
```

## API

### `<Byebot />`

| Prop       | Type     | Required | Description                      |
| ---------- | -------- | -------- | -------------------------------- |
| `site-key` | `string` | Yes      | Your site key from the dashboard |

| Event    | Payload  | Description                     |
| -------- | -------- | ------------------------------- |
| `verify` | `string` | Emitted on verification success |

### `validateByebotToken(options)`

| Option   | Type     | Required |
| -------- | -------- | -------- |
| `apiKey` | `string` | Yes      |
| `token`  | `string` | Yes      |

Returns: `Promise<{ valid: boolean, message?: string, rawResponse?: unknown }>`
