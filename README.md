# Headshot Haven - MERN Stack

A modern FPS gaming aim training platform built with the MERN stack (MongoDB, Express.js, React, Node.js) with Google OAuth integration.

## 🎯 Overview

Headshot Haven is a comprehensive gaming platform designed to help FPS players improve their aim, reaction speed, and clicking accuracy. The platform features multiple training games, leaderboards, user profiles, and an admin panel for managing users and scores.

## ✨ Features

### Core Features
- **Aim Training Game**: Precision targeting practice
- **CPS (Clicks Per Second) Test**: Clicking speed measurement
- **Reaction Speed Game**: Quick response training
- **Weapon Specifications**: Game weapon information
- **Roulette Game**: Random game selection
- **Leaderboards**: Global and game-specific rankings

### User Features
- User registration and authentication
- Google OAuth integration
- Personal profiles and statistics
- Game history tracking
- Score submission and tracking

### Admin Features
- User management dashboard
- Score management and reset capabilities
- System statistics and analytics
- Admin-only access controls

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + Passport.js
- **OAuth**: Google OAuth 2.0
- **Password Hashing**: bcryptjs

### Frontend
- **Framework**: React 19
- **UI Library**: Material-UI (MUI)
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **State Management**: React Context API

## 📁 Project Structure

```
HeadshotHaven/
├── backend/                 # Express.js API server
│   ├── config/             # Configuration files
│   ├── middleware/         # Custom middleware
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API routes
│   ├── server.js           # Main server file
│   └── package.json        # Backend dependencies
├── frontend/               # React application
│   ├── public/             # Static files
│   ├── src/                # React source code
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── utils/          # Utility functions
│   ├── assets/             # Images and static assets
│   └── package.json        # Frontend dependencies
└── README.md               # Project documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Google OAuth credentials (for Google login)

### Backend Setup

1. **Navigate to backend directory:**
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
   Edit `.env` with your configuration values.

4. **Start the server:**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create `.env` file:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. **Start the development server:**
   ```bash
   npm start
   ```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/headshot-haven
JWT_SECRET=your-super-secret-jwt-key
SESSION_SECRET=your-super-secret-session-key
FRONTEND_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:5000/api/auth/google/callback` (development)
   - `https://yourdomain.com/api/auth/google/callback` (production)
6. Copy Client ID and Client Secret to your backend `.env` file

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Game Endpoints
- `POST /api/games/aim` - Submit aim training score
- `POST /api/games/cps` - Submit CPS score
- `POST /api/games/reaction` - Submit reaction speed score
- `GET /api/games/{type}/leaderboard` - Get leaderboards
- `GET /api/games/history` - Get user's game history

### User Endpoints
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/change-password` - Change password

### Admin Endpoints
- `GET /api/admin/users` - Get all users
- `GET /api/admin/dashboard` - Get admin dashboard stats
- `PUT /api/admin/users/:id` - Update user (admin)
- `DELETE /api/admin/users/:id` - Delete user (admin)

## 🎮 Game Features

### Aim Training
- Precision targeting practice
- Multiple difficulty levels
- Accuracy tracking
- Time-based challenges

### CPS Test
- Clicks per second measurement
- Multiple time durations
- Average CPS calculation
- Personal best tracking

### Reaction Speed
- Quick response training
- Random timing intervals
- Reaction time measurement
- Multiple difficulty modes

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- CORS configuration
- Input validation
- Protected routes
- Admin role verification

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB database (local or cloud)
2. Configure environment variables
3. Deploy to your preferred hosting service (Heroku, Vercel, etc.)
4. Set up Google OAuth redirect URLs

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy the `build` folder to your hosting service
3. Configure environment variables
4. Update API URL for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes and commit: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Create a pull request

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Abdi Rahman Suufi**
- Email: abdisuufi123@gmail.com
- GitHub: [Abdi-Suufi](https://github.com/Abdi-Suufi)

## 🙏 Acknowledgments

- Original PHP version: [Headshot Haven](https://github.com/Abdi-Suufi/Headshot-Haven)
- Material-UI for the beautiful component library
- MongoDB for the flexible database solution
- Google OAuth for secure authentication
