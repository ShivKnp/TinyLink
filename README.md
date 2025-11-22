# TinyLink — URL Shortener

A full-featured URL shortener built with Node.js, Express, and MongoDB, similar to bit.ly.

## Tech Stack
- **Node.js** + **Express**
- **MongoDB** + **Mongoose**
- **Tailwind CSS** (via CDN)
- **Vanilla JavaScript**

## Features

- ✅ Create short links with optional custom codes (6-8 alphanumeric characters)
- ✅ URL validation before saving
- ✅ HTTP 302 redirects with click tracking
- ✅ Dashboard with search/filter functionality
- ✅ Individual stats page for each link
- ✅ Delete links (returns 404 after deletion)
- ✅ Copy-to-clipboard functionality
- ✅ Responsive design
- ✅ Health check endpoint

## Setup

### Prerequisites
- Node.js 18+ installed
- MongoDB database (local or MongoDB Atlas)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd Aganitha-main
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
MONGODB_URI=mongodb://localhost:27017/tinylink
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tinylink?retryWrites=true&w=majority

PORT=3000
```

4. Run the development server:
```bash
npm run dev
```

Or for production:
```bash
npm start
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Setup

The application uses MongoDB with Mongoose. The Link schema includes:
- `code` (String, UNIQUE) - The short code (6-8 alphanumeric)
- `url` (String) - The target URL
- `clicks` (Number) - Click counter
- `lastClicked` (Date) - Last click timestamp
- `createdAt` (Date) - Creation timestamp
- `updatedAt` (Date) - Last update timestamp

The database connection is established automatically when the server starts.

## API Endpoints

### Health Check
- `GET /healthz` - Returns `{ ok: true, version: "1.0" }`

### Links API
- `POST /api/links` - Create a new link
  - Body: `{ url: string, code?: string }`
  - Returns 409 if code already exists
  - Returns 400 if URL or code is invalid
  
- `GET /api/links` - List all links
  
- `GET /api/links/:code` - Get stats for a specific code
  
- `DELETE /api/links/:code` - Delete a link

## Pages

- `/` - Dashboard (list, add, delete links)
- `/code/:code` - Stats page for a specific link
- `/:code` - Redirect to original URL (302)
- `/healthz` - Health check

## Code Validation

- Custom codes must be 6-8 alphanumeric characters: `[A-Za-z0-9]{6,8}`
- Codes are globally unique across all users
- If no custom code is provided, a random 6-character code is generated

## Deployment

### Render

1. Push your code to GitHub
2. Create a new Web Service in Render
3. Connect your GitHub repository
4. Add environment variables:
   - `MONGODB_URI` - Your MongoDB connection string
   - `PORT` - Will be set automatically by Render
5. Deploy!

### Railway

1. Push your code to GitHub
2. Create a new project in Railway
3. Connect your GitHub repository
4. Add environment variables:
   - `MONGODB_URI` - Your MongoDB connection string
5. Deploy!

### Other Platforms

The app can be deployed to any Node.js hosting platform:
- **Heroku**
- **DigitalOcean App Platform**
- **AWS Elastic Beanstalk**
- Any platform that supports Node.js

## Testing

The application follows specific conventions for automated testing:
- All routes match the specification exactly
- Health endpoint returns status 200
- Redirects return HTTP 302
- Deleted links return 404
- Duplicate codes return 409

## Project Structure

```
├── server.js              # Express server entry point
├── lib/
│   └── db.js             # MongoDB connection
├── models/
│   └── Link.js           # Link Mongoose model
├── routes/
│   ├── api/
│   │   └── links.js     # API endpoints
│   ├── redirect.js      # Redirect route
│   └── healthz.js       # Health check
├── public/
│   ├── index.html       # Dashboard page
│   ├── stats.html       # Stats page
│   └── js/
│       ├── dashboard.js # Dashboard JavaScript
│       └── stats.js     # Stats page JavaScript
└── package.json
```

## Environment Variables

- `MONGODB_URI` - MongoDB connection string (required)
- `DATABASE_URL` - Alternative name for MongoDB URI (optional)
- `PORT` - Server port (default: 3000)

## License

ISC
