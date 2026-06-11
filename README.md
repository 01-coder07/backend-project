# VideoTube Backend

A production-grade REST API backend inspired by YouTube's core functionality. Built with Node.js, Express, and MongoDB — featuring JWT authentication with refresh token rotation, Cloudinary media uploads, and MongoDB aggregation pipelines for channel and watch history data.

---

## Features

- **Auth system** — register, login, logout with HTTP-only cookies
- **JWT access + refresh tokens** — short-lived access tokens, refresh token rotation on every re-issue
- **Media uploads** — avatar and cover image upload via Multer → Cloudinary
- **Channel profiles** — subscriber count, subscribed-to count, and `isSubscribed` flag via MongoDB aggregation
- **Watch history** — nested `$lookup` pipeline joining videos with their owner details
- **Account management** — update profile, change password, swap avatar/cover image

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (ES Modules) |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (access + refresh tokens) |
| File uploads | Multer (local) → Cloudinary |
| Password hashing | bcrypt |
| Config | dotenv |
| Formatting | Prettier |

---

## Project Structure

```
src/
├── controllers/
│   └── user.controller.js     # All user-related business logic
├── db/
│   └── db.js                  # MongoDB connection
├── middlewares/
│   ├── auth.middleware.js      # JWT verification
│   └── multer.middleware.js    # File upload handling
├── models/
│   ├── user.model.js           # User schema with bcrypt + JWT methods
│   ├── subscription.model.js   # Subscriber ↔ Channel mapping
│   └── video.model.js          # Video schema with aggregate-paginate
├── routes/
│   └── user.routes.js          # All /api/v1/users/* routes
├── utils/
│   ├── ApiError.js             # Custom error class
│   ├── ApiResponse.js          # Standardised response wrapper
│   ├── asyncHandler.js         # Async error boundary HOF
│   └── cloudinary.js           # Cloudinary upload util
├── app.js                      # Express app setup
└── index.js                    # Entry point
```

---

## API Endpoints

Base URL: `/api/v1/users`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | ✗ | Register with avatar + cover image |
| POST | `/login` | ✗ | Login, returns access + refresh tokens in cookies |
| POST | `/logout` | ✓ | Logout, clears cookies + invalidates refresh token |
| POST | `/refresh-token` | ✗ | Issue new access token using refresh token |
| POST | `/change-password` | ✓ | Change password |
| GET | `/current-user` | ✓ | Get logged-in user details |
| PATCH | `/update-account` | ✓ | Update fullName and email |
| PATCH | `/avatar` | ✓ | Replace avatar image |
| PATCH | `/cover-image` | ✓ | Replace cover image |
| GET | `/c/:username` | ✓ | Get channel profile with subscriber stats |
| GET | `/history` | ✓ | Get watch history with video owner details |

---

## Key Implementation Details

**Token rotation** — on every `/refresh-token` call, both the access token and refresh token are reissued and the old refresh token is invalidated in the database. This limits the window for a stolen token to be exploited.

**Aggregation pipeline** — `getUserChannelProfile` runs a single pipeline that joins the subscriptions collection twice: once to count subscribers, once to count channels the user is subscribed to. It also computes `isSubscribed` inline using `$cond` + `$in`, so the frontend gets everything in one request.

**`asyncHandler` HOF** — all controllers are wrapped in a higher-order function that catches async errors and forwards them to Express's error middleware, avoiding repetitive try/catch in every handler.

---

## Setup

```bash
# Clone and install
git clone https://github.com/01-coder07/backend-project.git
cd backend-project
npm install

# Create .env file
cp .env.example .env
# Fill in your values (see below)

# Start dev server
npm run dev
```

### Environment Variables

```env
PORT=8000
MONGODB_URL=mongodb+srv://<user>:<pass>@cluster.mongodb.net
CORS_ORIGIN=http://localhost:3000

ACCESS_TOKEN_SECRET=your_access_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_secret
REFRESH_TOKEN_EXPIRY=10d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## Author

**Harshit Pant** — [GitHub](https://github.com/01-coder07)
