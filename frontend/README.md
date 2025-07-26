# Headshot Haven Frontend

React frontend for Headshot Haven - FPS gaming aim training platform.

## Features

- Modern React application with Material-UI
- User authentication with JWT tokens
- Google OAuth integration
- Responsive design for all devices
- Game interfaces for aim training, CPS, and reaction speed
- Leaderboards and user profiles
- Admin panel for administrators

## Tech Stack

- **Framework**: React 19
- **UI Library**: Material-UI (MUI)
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Authentication**: JWT + Google OAuth

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running (see backend README)

## Installation

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the frontend directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. **Start the development server:**
   ```bash
   npm start
   ```

The application will open at `http://localhost:3000`.

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── Navbar.js       # Navigation bar
│   ├── PrivateRoute.js # Route protection for authenticated users
│   └── AdminRoute.js   # Route protection for admins
├── contexts/           # React Context providers
│   ├── AuthContext.js  # Authentication state management
│   └── GameContext.js  # Game state management
├── pages/              # Page components
│   ├── Home.js         # Landing page
│   ├── Login.js        # Login page
│   ├── Register.js     # Registration page
│   ├── AimTraining.js  # Aim training game
│   ├── CPSGame.js      # CPS game
│   ├── ReactionGame.js # Reaction speed game
│   ├── WeaponSpecs.js  # Weapon specifications
│   ├── Roulette.js     # Roulette game
│   ├── Leaderboards.js # Leaderboards
│   ├── Profile.js      # User profile
│   └── AdminPanel.js   # Admin panel
├── services/           # API service functions
│   ├── api.js          # Base API configuration
│   ├── authService.js  # Authentication API calls
│   └── gameService.js  # Game-related API calls
└── utils/              # Utility functions
```

## Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

## Environment Variables

- `REACT_APP_API_URL` - Backend API URL (default: http://localhost:5000/api)

## Features Overview

### Authentication
- User registration and login
- Google OAuth integration
- JWT token management
- Protected routes

### Games
- **Aim Training**: Precision targeting game
- **CPS Test**: Clicks per second testing
- **Reaction Speed**: Quick response training
- **Roulette**: Random game selection

### User Features
- Personal profiles
- Score tracking
- Game history
- Leaderboards

### Admin Features
- User management
- Score management
- Dashboard statistics

## Development

### Adding New Pages
1. Create a new component in `src/pages/`
2. Add the route to `src/App.js`
3. Add navigation link to `src/components/Navbar.js`

### Adding New Components
1. Create component in `src/components/`
2. Import and use in relevant pages

### API Integration
1. Add new service functions in `src/services/`
2. Use in components via context or direct import

## Styling

The application uses Material-UI with a custom dark theme. The theme is configured in `src/App.js` and includes:

- Dark color scheme
- Custom primary and secondary colors
- Responsive design
- Consistent typography

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.
