# weVote Election Backend

## Overview
The weVote Election Backend is a Node.js application that provides functionality for creating and managing elections. It uses MongoDB as the database to store election data.

## Features
- Create new elections
- Retrieve a list of elections
- Get details of a specific election by ID

## Technologies Used
- Node.js
- Express
- MongoDB
- Mongoose
- TypeScript

## Project Structure
```
weVote-election-backend
├── src
│   ├── app.ts                  # Entry point of the application
│   ├── controllers
│   │   └── electionController.ts # Handles election-related requests
│   ├── models
│   │   └── election.ts          # Mongoose model for elections
│   ├── routes
│   │   └── electionRoutes.ts     # Defines election-related routes
│   ├── services
│   │   └── electionService.ts     # Business logic for elections
│   └── types
│       └── index.ts              # Type definitions for elections
├── package.json                 # NPM dependencies and scripts
├── tsconfig.json                # TypeScript configuration
└── README.md                    # Project documentation
```

## Setup Instructions
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd weVote-election-backend
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Set up your MongoDB database and update the connection string in `src/app.ts`.
5. Start the application:
   ```
   npm start
   ```

## Usage
- To create a new election, send a POST request to `/elections` with the election details.
- To retrieve all elections, send a GET request to `/elections`.
- To get a specific election by ID, send a GET request to `/elections/:id`.

## License
This project is licensed under the MIT License.