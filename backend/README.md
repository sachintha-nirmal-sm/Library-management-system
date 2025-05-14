# Library Management System Backend

This is the backend server for the Library Management System, built with Node.js, Express, and MongoDB.

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/library_management

   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # JWT Configuration (if needed)
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=24h
   ```

   Note: Replace the placeholder values with your actual configuration:
   - For MongoDB: Use your MongoDB connection string
   - For Cloudinary: Get these values from your Cloudinary dashboard
   - For JWT: Generate a secure random string for JWT_SECRET

3. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

The following environment variables are required:

- `PORT`: The port number for the server (default: 5000)
- `NODE_ENV`: The environment (development/production)
- `MONGODB_URI`: MongoDB connection string
- `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Your Cloudinary API key
- `CLOUDINARY_API_SECRET`: Your Cloudinary API secret
- `JWT_SECRET`: Secret key for JWT token generation
- `JWT_EXPIRES_IN`: JWT token expiration time

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