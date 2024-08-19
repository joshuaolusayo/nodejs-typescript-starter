# Node Starter Project

This is a Node.js starter project that provides a scalable architecture for building modern web applications. It includes a set of reusable utilities, middleware, and services that are designed to streamline development processes and ensure best practices. The project is built using TypeScript and follows a modular approach to organize code effectively.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Modular Structure**: Clean and scalable architecture with a focus on modularity.
- **TypeScript**: Type-safe code with TypeScript.
- **Authentication**: JWT-based authentication.
- **Database**: MongoDB connection and model management.
- **Event Handling**: Centralized event handling with `EventEmitter`.
- **Utility Services**: Reusable services for sending emails, SMS, and managing cloud storage.
- **Validation**: Centralized request validation using `Joi`.
- **Middleware**: Robust middleware for authentication, error handling, and request processing.

## Project Structure

The project follows a modular structure, making it easy to scale and maintain.

```plaintext
├── build
├── node_modules
├── src
│   ├── config                # Configuration files
│   │   ├── database.ts       # MongoDB connection setup
│   │   ├── env.ts            # Environment variables management
│   │   ├── file.ts           # File-related configurations
│   │   └── throwIfUndefined.ts # Helper to ensure environment variables are defined
│   ├── constants             # Application-wide constants
│   │   ├── enums.ts          # Enums used throughout the application
│   │   └── index.ts          # Export file for constants
│   ├── controllers           # Controller classes for handling business logic
│   │   ├── _super.ts         # Super controller with shared logic
│   │   └── index.ts          # Export file for controllers
│   ├── events                # Event handling system
│   │   ├── _index.ts         # Event emitter instance
│   │   ├── allEvents.ts      # List of all events
│   │   ├── handler.ts        # Event handlers
│   │   └── listeners.ts      # Event listeners
│   ├── logs                  # Log files
│   ├── middlewares           # Express middlewares
│   │   ├── auth.ts           # Authentication middleware
│   │   └── handler.ts        # Error handling and response middleware
│   ├── models                # Mongoose models
│   │   ├── _config.ts        # Model configurations
│   │   └── *.ts              # Individual model files
│   ├── routes                # Express routes
│   │   ├── _index.ts         # Route index file
│   │   └── *.ts              # Individual route files
│   ├── services              # Business logic and services
│   │   ├── _root.ts          # Base service class
│   │   └── *.ts              # Individual service files
│   ├── types                 # TypeScript type definitions
│   │   ├── express           # Express-related types
│   │   ├── general.ts        # General types
│   │   └── schema.ts         # Mongoose schema types
│   ├── utilities             # Utility functions and helpers
│   │   ├── sendMessage       # Utilities for sending emails and SMS
│   │   ├── storage           # Cloud storage utilities
│   │   └── azure             # Azure-related utilities
│   ├── validations           # Request validation schemas
│   └── *.ts                  # Main application files (app.ts, express-config.ts, etc.)
├── .env                      # Environment variable file
├── .env.example              # Example environment variable file
├── .gitignore                # Git ignore file
├── .prettierignore           # Prettier ignore file
├── .prettierrc               # Prettier configuration file
├── package.json              # Project dependencies and scripts
└── README.md                 # This file
