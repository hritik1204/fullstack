# 📝 Centscape Wishlist Assignment

This project implements both the **backend link preview service** (Node.js + Express) and the **frontend wishlist app** (React Native + Expo bare workflow with MMKV).

---

## Project Structure

```
/server    # Express backend
/app       # React Native app (Expo bare workflow)
README.md  # (this file)
```

## 🚀 Features

### Backend (Express)
- **POST /preview**
  - Fetches metadata: `title`, `image`, `price`, `currency`, `siteName`, `sourceUrl`
  - **Rate limiting** → 10 requests/min/IP
  - **SSRF guard** → blocks private/loopback IPs
  - **Timeout ≤ 5s**
  - **Max redirects = 3**
  - **HTML size cap = 512 KB**
  - **Metadata extraction order**: OpenGraph → Twitter → fallback
- Consistent error responses, e.g.:
```json
{ "error": "Invalid URL" }
```

### Frontend (React Native + Expo)
- Wishlist UI with add-by-URL flow that hits the backend preview API
- Persistent storage using MMKV

---

## 🛠️ Backend: Setup & Run

1) Install dependencies
```bash
cd server
npm install
```

2) Development (with reload)
```bash
npm run dev
```

3) Production build & start
```bash
npm run build
npm start
```

4) API endpoint
```http
POST /preview
Content-Type: application/json

{
  "url": "https://example.com/product",
  "raw_html": "<html>...</html>" // optional, if provided no fetch is performed
}
```

Request body is validated against `server/schemas/preview.request.schema.json` (JSON Schema).

Successful response example:
```json
{
  "title": "Example Product",
  "image": "https://example.com/image.jpg",
  "price": "$49.99",
  "currency": "USD",
  "siteName": "example.com",
  "sourceUrl": "https://example.com/product"
}
```

---

## 📱 Frontend: Setup & Run (Expo bare)

1) Install dependencies
```bash
cd app
npm install
```

2) Prebuild native projects (first time or after native deps change)
```bash
npx expo prebuild
```

3) Run on simulators
```bash
npx expo run:ios       # iOS simulator
npx expo run:android   # Android emulator
```

Ensure your backend is running and reachable from the device/simulator. Configure the API base URL in the app if needed.