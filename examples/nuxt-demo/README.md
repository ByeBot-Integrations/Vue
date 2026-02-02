# Nuxt Demo

Example Nuxt 3 app using `@captchacat/vue`.

## Run

```bash
# From this directory
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Structure

```
pages/
├── index.vue              # Form with Captchacat component
server/api/
└── login.post.ts          # Server-side token validation
```

## Configuration

Update these values in the code:

- `pages/index.vue`: `site-key="your-site-key"`
- `server/api/login.post.ts`: `apiKey: "your-api-key"`
