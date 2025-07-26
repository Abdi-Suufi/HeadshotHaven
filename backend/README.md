# Headshot Haven Backend

Backend API for Headshot Haven - FPS gaming aim training platform built with Node.js, Express, and MongoDB.

## Features

- User authentication with JWT tokens
- Google OAuth integration
- Game score tracking and leaderboards
- Admin panel functionality
- RESTful API design

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + Passport.js
- **OAuth**: Google OAuth 2.0
- **Password Hashing**: bcryptjs

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Google OAuth credentials (for Google login)

## Installation

1. **Clone the repository and navigate to backend:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   Edit `.env` file with your configuration values.

4. **Start MongoDB:**
   Make sure MongoDB is running on your system or use a cloud instance.

5. **Run the development server:**
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/headshot-haven

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Session Configuration
SESSION_SECRET=your-super-secret-session-key-change-this-in-production

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/google/callback` - Google OAuth callback
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/check` - Check authentication status

### Games

- `POST /api/games/aim` - Submit aim training score
- `POST /api/games/cps` - Submit CPS score
- `POST /api/games/reaction` - Submit reaction speed score
- `GET /api/games/aim/leaderboard` - Get aim training leaderboard
- `GET /api/games/cps/leaderboard` - Get CPS leaderboard
- `GET /api/games/reaction/leaderboard` - Get reaction speed leaderboard
- `GET /api/games/history` - Get user's game history
- `DELETE /api/games/reset-scores` - Reset user's scores

### Users

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/change-password` - Change password
- `GET /api/users/stats` - Get user statistics
- `DELETE /api/users/account` - Delete user account

### Admin (Admin only)

- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/:userId` - Get user by ID
- `PUT /api/admin/users/:userId` - Update user (admin)
- `DELETE /api/admin/users/:userId` - Delete user (admin)
- `POST /api/admin/users/:userId/reset-scores` - Reset user scores
- `GET /api/admin/scores` - Get all game scores
- `DELETE /api/admin/scores/:scoreId` - Delete game score
- `GET /api/admin/dashboard` - Get admin dashboard stats

## Database Models

### User
- Basic user information (username, email, password)
- Google OAuth integration
- Game scores (aim, cps, reaction)
- Admin status
- Profile information

### GameScore
- Individual game attempts
- Score tracking
- Game-specific data
- Timestamps

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:5000/api/auth/google/callback` (development)
   - `https://yourdomain.com/api/auth/google/callback` (production)
6. Copy Client ID and Client Secret to your `.env` file

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

## Error Handling

The API includes comprehensive error handling with appropriate HTTP status codes and error messages.

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- CORS configuration
- Input validation
- Rate limiting (can be added)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License. 