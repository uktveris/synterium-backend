# Backend for cloud storage project
This repository contains code for the backend service for cloud storage project. The frontend code i in [this repository](https://github.com/uktveris/synterium-frontend). This repository is only for educational purposes.

## Technology stack
This project uses the following technologies: 
- MongoDB
- Express
- React
- Node

This backend service manages sessions with JWT and implements generation, refreshing and termination of tokens. Users are managed in MongoDB through various Express.js endpoints and middleware.

Development server can be run with `npm run dev`. As for production, it can be run with `npm run start`.
