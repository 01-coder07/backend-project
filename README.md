# MyTube — YouTube-Inspired Backend API

A full-featured REST API backend for a video-sharing platform, built with Node.js, Express, and MongoDB. Inspired by YouTube's core functionality — video uploads, user authentication, comments, likes, and subscriptions.

## Features

- **Authentication**: JWT-based auth with access & refresh token rotation, secure httpOnly cookies
- **User Management**: Register, login, logout, password change, avatar & cover image uploads, watch history
- **Videos**: Upload (with Cloudinary storage), fetch, update, delete — with ownership-based authorization
- **Comments**: Full CRUD on video comments
- **Likes**: Toggle-based like/unlike on videos
- **Subscriptions**: Subscribe/unsubscribe to channels, view a channel's subscribers, view a user's subscribed channels
- **Aggregation Pipelines**: Channel profile stats (subscriber count, subscribed-to count) and populated watch history using MongoDB's `$lookup`

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB (Atlas) with Mongoose ODM |
| Auth | JWT (jsonwebtoken), bcrypt for password hashing |
| File Storage | Cloudinary (via Multer for local temp handling) |
| Dev Tools | Prettier |

## Project Structure

```
backend-project/
├── public/                 # Static/temp assets
├── src/
│   ├── controllers/         # Route logic (user, video, comment, like, subscription)
│   ├── db/                  # MongoDB connection setup
│   ├── middlewares/         # Auth (JWT verification), Multer file upload
│   ├── models/               # Mongoose schemas (User, Video, Comment, Like, Subscription)
│   ├── routes/                # Express route definitions
│   ├── utils/                 # ApiError, ApiResponse, asyncHandler, Cloudinary helper
│   ├── app.js                  # Express app config
│   ├── constants.js            # DB name and other constants
│   └── index.js                 # Entry point
├── .env                          # Environment variables (not committed)
├── .gitignore
├── .prettierrc / .prettierignore
├── package.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- A MongoDB Atlas account (free tier works)
- A Cloudinary account (free tier works)

### Installation

```bash
git clone https://github.com/01-coder07/backend-project.git
cd backend-project
npm install
```

### Environment Variables

Create a `.env` file in the root directory with the following:

```env
PORT=8000
MONGODB_URL=your_mongodb_atlas_connection_string
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

> **Note:** The app connects using `MONGODB_URL` and appends the database name (`mytube`, defined in `constants.js`) automatically — do not include the database name in your connection string.

### Run the Server

```bash
npm start
```

The server will run on `http://localhost:8000` (or whichever `PORT` you set).

## API Overview

All routes are prefixed with `/api/v1`.

### Auth & Users (`/users`)
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/register` | Register a new user (with avatar upload) | No |
| POST | `/login` | Login and receive access/refresh tokens | No |
| POST | `/logout` | Logout and clear tokens | Yes |
| POST | `/refresh-token` | Get a new access token | No (uses refresh token) |
| POST | `/change-password` | Change current password | Yes |
| GET | `/current-user` | Get logged-in user's details | Yes |
| PATCH | `/update-account` | Update fullName/email | Yes |
| PATCH | `/avatar` | Update avatar image | Yes |
| PATCH | `/cover-image` | Update cover image | Yes |
| GET | `/channel/:username` | Get channel profile with subscriber counts | Yes |
| GET | `/watch-history` | Get user's watch history | Yes |

### Videos (`/videos`)
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/upload` | Upload a new video (video file + thumbnail) | Yes |
| GET | `/:id` | Get a single video | No |
| PATCH | `/:videoId` | Update video details/thumbnail (owner only) | Yes |
| DELETE | `/:videoId` | Delete a video (owner only) | Yes |

### Comments, Likes & Subscriptions
Similar CRUD/toggle patterns exist for comments and likes on videos, plus:

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/:channelId/subscribe` | Toggle subscribe/unsubscribe to a channel | Yes |
| GET | `/subscriptions/:id/userSubscribers` | Get all subscribers of a channel | Yes |
| GET | `/subscriptions/:id/channels` | Get all channels a user is subscribed to | Yes |

## Authentication Flow

1. User registers → password hashed via bcrypt before saving
2. User logs in → server issues an **access token** (short-lived) and **refresh token** (long-lived), both set as httpOnly cookies
3. Protected routes use `verifyJWT` middleware to validate the access token
4. When the access token expires, `/refresh-token` issues a new one using the refresh token, which is validated against the one stored in the database

## Key Design Patterns

- **Ownership checks**: Update/delete operations on videos verify `req.user._id` matches the resource's `owner` before allowing mutation
- **Toggle logic**: Likes and subscriptions use a single endpoint that creates or removes a document depending on whether it already exists
- **Aggregation pipelines**: Used for computing subscriber/subscription counts and populating nested video/owner data in watch history
- **Centralized error/response handling**: `ApiError` and `ApiResponse` utility classes standardize API output; `asyncHandler` wraps controllers to catch async errors without repetitive try/catch blocks

## Live Demo

_Add your deployed URL here once hosted (e.g., Render)._

## Author

**Harshit Pant**
GitHub: [01-coder07](https://github.com/01-coder07)
LinkedIn: [harshit-pant](https://linkedin.com/in/harshit-pant-913690296)
