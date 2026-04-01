# 🎮 PS5 Trailers — Production-Grade Game Trailer Platform

<div align="center">

![PS5 Trailers](https://img.shields.io/badge/PS5-Trailers-006FFF?style=for-the-badge&logo=playstation&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js_14-000?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)

A **production-grade, full-stack video streaming platform** for PS5 game trailers — built with the same engineering standards as top-tier startup products.

[Live Demo](#) · [Report Bug](#) · [Request Feature](#)

</div>

---

## ✨ Features

### 🎬 Video System
- HLS adaptive bitrate streaming via Cloudinary
- Custom-built video player with full controls
- Auto thumbnail generation from video
- 4K / 1080p / 720p quality selection
- Playback speed control (0.5x → 2x)
- Download support

### 👤 Authentication
- Google OAuth via NextAuth.js
- Email/password credentials
- JWT-based sessions
- Role-based access (User / Admin)

### ❤️ Engagement
- Like / Unlike system
- Nested comments (replies)
- View count tracking
- Trending algorithm (gravity-based scoring)
- Watch history tracking

### 🔍 Discovery
- Full-text search across title, description, tags
- Category browsing (16 categories)
- Trending videos feed
- Related video recommendations

### 🛠️ Admin Panel
- Upload videos with metadata
- Manage / edit / delete videos
- Publish / Draft / Archive status
- Feature videos on homepage
- Analytics dashboard

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **Animation** | Framer Motion |
| **State** | Redux Toolkit |
| **Auth** | NextAuth.js v4 |
| **Database** | MongoDB + Mongoose |
| **Storage** | Cloudinary |
| **Video** | HLS.js (adaptive streaming) |
| **Validation** | Zod |
| **Forms** | React Hook Form |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier works)
- Cloudinary account (free tier: 25GB)
- Google OAuth credentials (optional)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/ps5-trailers-platform.git
cd ps5-trailers-platform
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
```bash
cp .env.local.example .env.local
# Fill in all required values
```

**Minimum required variables:**
```env
MONGODB_URI=mongodb+srv://...
NEXTAUTH_SECRET=your-secret-min-32-chars
NEXTAUTH_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-secret
```

### 4. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```

ps5-trailers-platform/
│
├── .next/
├── node_modules/
│
├── public/
│   ├── fonts/
│   ├── images/
│   │   ├── backgrounds/
│   │   ├── icons/
│   │   ├── logos/
│   │   ├── thumbnails/
│   ├── scripts/
│   │   └── seed.ts
│
├── src/
│   │
│   ├── app/
│   │   │
│   │   ├── admin/
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── upload/
│   │   │   │   └── page.tsx
│   │   │   ├── videos/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   │
│   │   ├── api/
│   │   │   ├── analytics/
│   │   │   │   └── route.ts
│   │   │   ├── auth/
│   │   │   │   ├── [...nextauth]/
│   │   │   │   │   └── route.ts
│   │   │   │   └── register/
│   │   │   │       └── route.ts
│   │   │   │
│   │   │   ├── comment/
│   │   │   │   └── route.ts
│   │   │   ├── like/
│   │   │   │   └── route.ts
│   │   │   ├── search/
│   │   │   │   └── route.ts
│   │   │   ├── trending/
│   │   │   │   └── route.ts
│   │   │   ├── upload/
│   │   │   │   └── route.ts
│   │   │   ├── user/
│   │   │   │   ├── history/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── liked/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── me/
│   │   │   │   │   └── route.ts
│   │   │   │   └── route.ts
│   │   │   ├── videos/
│   │   │   │   ├── [id]/
│   │   │   │   │   └── route.ts
│   │   │   │   └── route.ts
│   │   │
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   │
│   │   ├── browse/
│   │   │   └── page.tsx
│   │   │
│   │   ├── category/
│   │   │   └── [name]/
│   │   │       └── page.tsx
│   │   │
│   │   ├── profile/
│   │   │   ├── liked/
│   │   │   ├── playlists/
│   │   │   └── watch-history/
│   │   │       └── page.tsx
│   │   │
│   │   ├── search/
│   │   │   └── page.tsx
│   │   │
│   │   ├── trending/
│   │   │   └── page.tsx
│   │   │
│   │   ├── video/
│   │   │   └── [id]/
│   │   │       ├── loading.tsx
│   │   │       ├── page.tsx
│   │   │       └── VideoPageClient.tsx
│   │   │
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   ├── comments/
│   │   │   │   └── Comments.tsx
│   │   │   ├── common/
│   │   │   │   └── Providers.tsx
│   │   │   ├── home/
│   │   │   │   ├── CategoryFilter.tsx
│   │   │   │   ├── HeroSection.tsx
│   │   │   │   └── HomeContent.tsx
│   │   │   ├── layout/
│   │   │   │   ├── AppLayout.tsx
│   │   │   │   ├── Navbar.tsx
│   │   │   │   └── Sidebar.tsx
│   │   │   ├── ui/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── FormElements.tsx
│   │   │   │   └── Skeleton.tsx
│   │   │   ├── user/
│   │   │   └── video/
│   │   │       ├── VideoCard.tsx
│   │   │       ├── VideoGrid.tsx
│   │   │       └── VideoPlayer.tsx
│   │   │
│   │   ├── config/
│   │   │
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   │   └── authSlice.ts
│   │   │   ├── comment/
│   │   │   │   └── commentSlice.ts
│   │   │   ├── ui/
│   │   │   │   └── uiSlice.ts
│   │   │   └── video/
│   │   │       └── videoSlice.ts
│   │   │
│   │   ├── hooks/
│   │   │   ├── index.ts
│   │   │   ├── useDebounce.ts
│   │   │   └── useInfiniteScroll.ts
│   │   │
│   │   ├── lib/
│   │   │   ├── apiMiddleware.ts
│   │   │   ├── auth.ts
│   │   │   ├── cloudinary.ts
│   │   │   └── db.ts
│   │   │
│   │   ├── middleware/
│   │   │   └── auth.ts
│   │   │
│   │   ├── models/
│   │   │   ├── Comment.ts
│   │   │   ├── Like.ts
│   │   │   ├── User.ts
│   │   │   └── Video.ts
│   │   │
│   │   ├── services/
│   │   │
│   │   ├── store/
│   │   │   └── index.ts
│   │   │
│   │   ├── styles/
│   │   │
│   │   ├── types/
│   │   │   └── index.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── cn.ts
│   │   │   ├── constants.ts
│   │   │   └── format.ts
│   │
│   │   ├── globals.css
│   │   ├── HomeClient.tsx
│   │   ├── layout.tsx
│   │   ├── not-found.tsx
│   │   ├── page.tsx
│   │   └── error.tsx
│
├── .env.local
├── .eslintrc.json
├── .gitignore
├── .prettierrc
├── middleware.ts
├── next-env.d.ts
├── next.config.js
├── package-lock.json
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.js
└── tsconfig.json


---

## 🔐 Security

- JWT-based authentication with NextAuth
- Role-based route protection (middleware)
- In-memory rate limiting on API routes
- Zod validation on all API inputs
- Secure headers configured in `next.config.js`
- XSS protection via React's built-in escaping
- File type + size validation on uploads

---

## 📊 API Reference

### Videos
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/videos` | Public | List videos |
| GET | `/api/videos/:id` | Public | Get single video |
| POST | `/api/videos` | Admin | Create video record |
| PUT | `/api/videos/:id` | Admin | Update video |
| DELETE | `/api/videos/:id` | Admin | Delete video |

### Upload
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/upload` | Admin | Upload video + thumbnail |
| GET | `/api/upload` | Admin | Get presigned URL |

### Engagement
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/like` | User | Like/unlike video |
| GET | `/api/like` | User | Check like status |
| GET | `/api/comment` | Public | Get comments |
| POST | `/api/comment` | User | Post comment |
| DELETE | `/api/comment` | User | Delete comment |

### Discovery
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/search?q=` | Public | Search videos |
| GET | `/api/trending` | Public | Get trending videos |
| GET | `/api/analytics` | Admin | Platform analytics |

---

## 🚢 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Add all environment variables in Vercel's dashboard under **Settings → Environment Variables**.

### Docker
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json .
RUN npm install --production
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| **Primary BG** | `#000000` |
| **Surface** | `#111111` |
| **Elevated** | `#161616` |
| **Border** | `#1F1F1F` |
| **Accent Blue** | `#006FFF` |
| **Font Display** | Barlow Condensed |
| **Font Body** | Barlow |

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

Built with ❤️ for the PlayStation community

</div>
