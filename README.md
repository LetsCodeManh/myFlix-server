# myFlix-server

Backend server for myFlix-client-side project, a Netflix-like application.

## Technologies

- Node.js
- Express
- MongoDB
- Mongoose
- Cors
- Bycrypt
- Jsonwebtoken
- Password/Token
- Morgan
- Heroku
- Other dependencies

## Usage

The myFlix-server provides the following APIs:

- GET /movies: Retrieve all movie data.
- GET /movies/:title: Retrieve movie with the same title.
- GET /movies/genre/:genreName: Retrieve all genres from the - movie.
- GET /movies/directors/:directorName: Retrieve director from the movie.
- GET /users: Retrieve all user data.
- GET /users/:username: Retrieve the user data with the specified username.
- POST /users: Create a new user.
- POST /users/:username/movies/:\_id: Add a favorite movie for the specified user ID.
- PUT /users/:username: Update the user data with the specified username.
- DELETE /users/:username: Delete the user data with the specified username.
- DELETE /users/:username/movies/:\_id: Remove a favorite movie for the specified user ID.

## Configuration

The myFlix-server requires the following environment variables:

MONGO_URI: The URI of the MongoDB database.
JWT_SECRET: The secret used to sign JSON Web Tokens.

## Note

This project is for learning purposes only and should not be used in a production environment.