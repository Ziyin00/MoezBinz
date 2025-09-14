# MoezBinz - Complete Authentication System

A full-stack application with React frontend, Express.js backend, and PostgreSQL database featuring complete user authentication.

## 🚀 Features

- **User Authentication**: Complete signup, login, logout functionality
- **Password Security**: Bcrypt hashing with strength validation
- **JWT Tokens**: Secure token-based authentication
- **Protected Routes**: Route protection with authentication guards
- **User Management**: Profile updates and password changes
- **State Management**: Redux Toolkit + Zustand for flexible state management
- **State Persistence**: Automatic state persistence across browser sessions
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Security**: Rate limiting, CORS, Helmet security headers

## 🛠️ Tech Stack

### Frontend

- React 19 with TypeScript
- React Router DOM for routing
- Axios for API calls
- Tailwind CSS for styling
- Redux Toolkit for global state management
- Zustand for lightweight state management
- Redux Persist for state persistence

### Backend

- Express.js with TypeScript
- PostgreSQL with Sequelize ORM
- JWT for authentication
- Bcrypt for password hashing
- Rate limiting and security middleware

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd MoezBinz
```

### 2. Database Setup

```bash
# Create PostgreSQL database
createdb moezbinz

# Or using psql
psql -U postgres
CREATE DATABASE moezbinz;
\q
```

### 3. Backend Setup

```bash
cd server

# Install dependencies
npm install

# Copy environment file
cp env.example .env

# Edit .env file with your database credentials
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=moezbinz
# DB_USER=your_username
# DB_PASSWORD=your_password
# JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
# JWT_EXPIRES_IN=7d
# PORT=5000
# NODE_ENV=development
# CLIENT_URL=http://localhost:5173

# Start the server
npm run dev
```

### 4. Frontend Setup

```bash
cd client

# Install dependencies
npm install

# Copy environment file
cp env.example .env

# Edit .env file
# VITE_API_URL=http://localhost:5000/api

# Start the development server
npm run dev
```

## 🗄️ Database Schema

The application uses the following main table:

### Users Table

```sql
CREATE TABLE "Users" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "firstName" VARCHAR(50) NOT NULL,
  "lastName" VARCHAR(50) NOT NULL,
  "email" VARCHAR(255) UNIQUE NOT NULL,
  "password" VARCHAR(255) NOT NULL,
  "isEmailVerified" BOOLEAN DEFAULT false,
  "role" VARCHAR(10) DEFAULT 'user',
  "lastLogin" TIMESTAMP,
  "createdAt" TIMESTAMP NOT NULL,
  "updatedAt" TIMESTAMP NOT NULL
);
```

## 🔐 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint           | Description         | Access  |
| ------ | ------------------ | ------------------- | ------- |
| POST   | `/register`        | Register new user   | Public  |
| POST   | `/login`           | User login          | Public  |
| GET    | `/me`              | Get current user    | Private |
| PUT    | `/profile`         | Update user profile | Private |
| PUT    | `/change-password` | Change password     | Private |

### Example API Usage

#### Register User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

#### Login User

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

## 🎯 Usage

### 1. User Registration

- Navigate to `/signup`
- Fill in first name, last name, email, and password
- Password must meet security requirements:
  - At least 6 characters
  - Contains uppercase and lowercase letters
  - Contains at least one number

### 2. User Login

- Navigate to `/login`
- Enter email and password
- Successful login redirects to home page

### 3. Protected Routes

- Users must be authenticated to access certain features
- Authentication state is managed globally
- Automatic token refresh and validation

### 4. User Profile

- Authenticated users can update their profile
- Password change functionality available
- Logout clears all authentication data

## 🔒 Security Features

- **Password Hashing**: Bcrypt with salt rounds
- **JWT Tokens**: Secure token-based authentication
- **Rate Limiting**: Prevents brute force attacks
- **CORS**: Configured for secure cross-origin requests
- **Helmet**: Security headers for protection
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Protection**: Sequelize ORM prevents SQL injection

## 🧪 Testing the Authentication

### Manual Testing Steps

1. **Start both servers**:

   ```bash
   # Terminal 1 - Backend
   cd server && npm run dev

   # Terminal 2 - Frontend
   cd client && npm run dev
   ```

2. **Test Registration**:

   - Go to `http://localhost:5173/signup`
   - Create a new account
   - Verify successful registration and auto-login

3. **Test Login**:

   - Go to `http://localhost:5173/login`
   - Login with created credentials
   - Verify successful login and redirect

4. **Test Protected Features**:
   - Verify user name appears in navbar
   - Test logout functionality
   - Verify redirect to login when accessing protected routes

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Error**:

   - Verify PostgreSQL is running
   - Check database credentials in `.env`
   - Ensure database exists

2. **CORS Errors**:

   - Verify `CLIENT_URL` in server `.env`
   - Check that frontend is running on correct port

3. **JWT Errors**:

   - Verify `JWT_SECRET` is set in server `.env`
   - Check token expiration settings

4. **Build Errors**:
   - Clear node_modules and reinstall
   - Check Node.js version compatibility

## 📁 Project Structure

```
MoezBinz/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── store/          # Redux store configuration
│   │   │   ├── slices/     # Redux slices (auth, ui)
│   │   │   └── index.ts    # Store configuration
│   │   ├── stores/         # Zustand stores
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript types
│   │   └── pages/          # Page components
│   └── package.json
├── server/                 # Express.js backend
│   ├── config/            # Database configuration
│   ├── middleware/        # Express middleware
│   ├── models/            # Sequelize models
│   ├── routes/            # API routes
│   └── package.json
└── README.md
```

## 🔄 State Management

This application uses both **Redux Toolkit** and **Zustand** for state management:

### Redux Toolkit

- **Global State**: Authentication, user data, UI state
- **Features**: Time-travel debugging, predictable state updates, middleware support
- **Persistence**: Redux Persist for automatic state persistence
- **Usage**: `useAppSelector` and `useAppDispatch` hooks

### Zustand

- **Lightweight State**: Simple state management with minimal boilerplate
- **Features**: TypeScript support, persistence, devtools
- **Usage**: `useAuthStore` hook for authentication state

### When to Use Which?

- **Redux Toolkit**: Use for complex global state, when you need predictable updates, debugging tools
- **Zustand**: Use for simple state management, component-specific state, or when you want less boilerplate

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please open an issue in the repository or contact the development team.
