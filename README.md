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
```

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/node-starter-project.git
   ```

2. Navigate to the project directory:

   ```bash
   cd node-starter-project
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

## Environment Variables

The project requires several environment variables to be set. You can use the `.env.example` file as a reference to create your own `.env` file.

```plaintext
PORT=5000
IP=0.0.0.0
NODE_ENVIRONMENT=development
JWT_SECRET=your_jwt_secret
JWT_ISSUER=your_jwt_issuer
DB_URI=your_mongo_db_uri
SENDGRID_API_KEY=your_sendgrid_api_key
FRONTEND_URL=your_frontend_url
```

## Scripts

- **Start the application**:

  ```bash
  npm start
  ```

- **Start the application in development mode**:

  ```bash
  npm run dev
  ```

- **Run tests**:

  ```bash
  npm test
  ```

## Usage

### Starting the Server

Run the following command to start the server:

```bash
npm start
```

### API Endpoints

#### Authentication

- **POST /api/auth/login**: Authenticate a user and return a JWT token.

#### Users

- **GET /api/users**: Retrieve a list of users.
- **POST /api/users**: Create a new user.
- **GET /api/users/:id**: Retrieve a user by ID.
- **PUT /api/users/:id**: Update a user by ID.
- **DELETE /api/users/:id**: Soft delete a user by ID.

#### Contacts

- **GET /api/contacts**: Retrieve a list of contacts.
- **POST /api/contacts**: Create a new contact message.
- **GET /api/contacts/:id**: Retrieve a contact message by ID.
- **DELETE /api/contacts/:id**: Soft delete a contact message by ID.

> Note: The actual endpoints may vary depending on the implementation details.

## Contributing

Contributions are welcome! Please read the [contributing guidelines](CONTRIBUTING.md) first.

1. Fork the repository.
2. Create your feature branch: `git checkout -b my-new-feature`.
3. Commit your changes: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin my-new-feature`.
5. Submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
