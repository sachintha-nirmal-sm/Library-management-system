# Library Management System Backend

This is the backend server for the Library Management System, built with Node.js, Express, and MongoDB.

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a .env file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/library_management
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

- `server.js` - Entry point of the application
- `/routes` - API route definitions
- `/controllers` - Route controllers
- `/models` - MongoDB models
- `/middleware` - Custom middleware functions
- `/config` - Configuration files

## API Endpoints

Will be documented as they are implemented.

## Available Scripts

- `npm start` - Runs the server in production mode
- `npm run dev` - Runs the server in development mode with nodemon 