# KeyGen

A minimal Next.js app for generating cryptographically secure passwords, API keys, and UUIDs.

## Features

- **Password generator** — configurable length (8–64), uppercase/lowercase/digits/symbols, strength indicator
- **API Key generator** — hex, base64url, `sk-...` prefixed, or segmented `xxxx-xxxx-...` format
- **UUID v4** — RFC 4122 compliant
- **Batch mode** — generate 5 variants at once with one-click copy
- **Dark mode** — follows system preference
- All generation uses `crypto.getRandomValues()` — nothing leaves the browser

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Stack

- [Next.js 15](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) (utility resets only)
- Zero runtime dependencies beyond React/Next
