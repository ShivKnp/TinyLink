# TinyLink — URL Shortener

A full-featured URL shortener built with Node.js, Express, and MongoDB, similar to bit.ly. Features a clean, minimal UI with real-time click tracking and comprehensive link management.

## 🚀 Features

- ✅ **Create Short Links** - Generate short URLs with optional custom codes (6-8 alphanumeric characters)
- ✅ **URL Validation** - Automatic validation before saving links
- ✅ **Click Tracking** - Track total clicks and last clicked timestamp for each link
- ✅ **HTTP 302 Redirects** - Proper redirect implementation with click tracking
- ✅ **Dashboard** - Beautiful dashboard with search/filter functionality
- ✅ **Link Statistics** - Individual stats page for each shortened link
- ✅ **Delete Links** - Remove links (returns 404 after deletion)
- ✅ **Copy to Clipboard** - One-click copy functionality for short URLs
- ✅ **Responsive Design** - Works seamlessly on desktop and mobile devices
- ✅ **Health Check** - Built-in health check endpoint for monitoring
- ✅ **Minimal Modern UI** - Clean, modern interface built with Tailwind CSS

## 🛠️ Tech Stack

- **Node.js** 18+ - Runtime environment
- **Express** 4.18+ - Web framework
- **MongoDB** - Database (works with local MongoDB or MongoDB Atlas)
- **Mongoose** 8.0+ - MongoDB object modeling
- **Tailwind CSS** - Utility-first CSS framework (via CDN)
- **JavaScript** - No framework dependencies for frontend

## 📋 Prerequisites

- Node.js 18 or higher
- MongoDB database:
  - Local MongoDB installation, OR
  - MongoDB Atlas account (free tier available)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd TinyLink
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```env

# OR for MongoDB Atlas (recommended for production):
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tinylink?retryWrites=true&w=majority

# Server Port (optional, defaults to 3000)
PORT=3000
```

**Note:** You can also use `DATABASE_URL` instead of `MONGODB_URI` - both are supported.

### 4. Run the Application

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

### 5. Open in Browser

Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
Aganitha-main/
├── server.js              # Express server entry point
├── lib/
│   └── db.js             # MongoDB connection handler
├── models/
│   └── Link.js           # Mongoose Link model
├── routes/
│   ├── api/
│   │   └── links.js      # API endpoints (GET, POST, DELETE)
│   ├── healthz.js        # Health check endpoint
│   └── redirect.js       # Redirect handler (legacy, now in server.js)
├── public/
│   ├── index.html        # Dashboard page
│   ├── stats.html        # Statistics page
│   └── js/
│       ├── dashboard.js  # Dashboard functionality
│       └── stats.js      # Stats page functionality
├── package.json          # Dependencies and scripts
├── .env.example          # Environment variables template
├── README.md             # This file
└── TROUBLESHOOTING.md    # Troubleshooting guide
```

## 📡 API Endpoints

### Health Check

**GET** `/healthz`

Returns server and database status.

**Response:**
```json
{
  "ok": true,
  "version": "1.0",
  "database": "connected"
}
```

### Links API

#### Create Link

**POST** `/api/links`

Create a new short link.

**Request Body:**
```json
{
  "url": "https://example.com/very/long/url",
  "code": "mycode"  // Optional: 6-8 alphanumeric characters
}
```

**Success Response (200):**
```json
{
  "_id": "...",
  "code": "mycode",
  "url": "https://example.com/very/long/url",
  "clicks": 0,
  "lastClicked": null,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**
- `400` - Invalid URL or code format
- `409` - Code already exists
- `500` - Server error

#### List All Links

**GET** `/api/links`

Get all shortened links, sorted by creation date (newest first).

**Response:**
```json
[
  {
    "_id": "...",
    "code": "abc123",
    "url": "https://example.com",
    "clicks": 42,
    "lastClicked": "2024-01-01T12:00:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
]
```

#### Get Link Stats

**GET** `/api/links/:code`

Get statistics for a specific short code.

**Response:**
```json
{
  "_id": "...",
  "code": "abc123",
  "url": "https://example.com",
  "clicks": 42,
  "lastClicked": "2024-01-01T12:00:00.000Z",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T12:00:00.000Z"
}
```

**Error Responses:**
- `404` - Link not found
- `500` - Server error

#### Delete Link

**DELETE** `/api/links/:code`

Delete a shortened link. After deletion, accessing `/:code` will return 404.

**Success Response (200):**
```json
{
  "ok": true
}
```

**Error Responses:**
- `404` - Link not found
- `500` - Server error

## 🌐 Pages & Routes

| Route | Description | Auth |
|-------|-------------|------|
| `/` | Dashboard - List, create, and delete links | Public |
| `/code/:code` | Statistics page for a specific link | Public |
| `/:code` | Redirect to original URL (HTTP 302) | Public |
| `/healthz` | Health check endpoint | Public |

## 🔐 Code Validation Rules

- **Format:** Custom codes must be 6-8 alphanumeric characters: `[A-Za-z0-9]{6,8}`
- **Uniqueness:** Codes are globally unique across all users
- **Auto-generation:** If no custom code is provided, a random 6-character code is automatically generated
- **Validation:** Invalid codes return 400 error

## 🗄️ Database Schema

The `Link` model uses the following schema:

```javascript
{
  code: String (required, unique, 6-8 alphanumeric),
  url: String (required, valid HTTP/HTTPS URL),
  clicks: Number (default: 0),
  lastClicked: Date (default: null),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

## 📝 Development

### Scripts

- `npm run dev` - Start development server with auto-reload
- `npm start` - Start production server

### Code Style

- ES6+ JavaScript (ES Modules)
- Express.js best practices
- RESTful API design
- Clean, minimal UI

---

**Built with ❤️ using Node.js, Express, and MongoDB**
