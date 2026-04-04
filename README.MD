# Finance Data Processing and Access Control System

A comprehensive finance dashboard system with role-based access control, transaction management, and data analytics.

## 🚀 Features

### Core Features
- **Role-Based Access Control** (Admin, Analyst, Viewer)
- **Financial Transaction Management** (CRUD operations)
- **Dashboard Analytics** with charts and summaries
- **User Management** for administrators
- **Data Filtering & Pagination**

### Role Permissions

| Action | Viewer | Analyst | Admin |
|--------|--------|---------|-------|
| View Dashboard | ✅ | ✅ | ✅ |
| View Transactions | ❌ | ✅ | ✅ |
| Create Transactions | ❌ | ✅ | ✅ |
| Update Transactions | ❌ | ✅ | ✅ |
| Delete Transactions | ❌ | ✅ | ✅ |
| Manage Users | ❌ | ❌ | ✅ |

## 🛠 Tech Stack

### Frontend
- **React 18** with modern hooks
- **React Router** for navigation
- **Axios** for API communication
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Lucide React** for icons
- **React Hot Toast** for notifications
- **Context API** for state management

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Express Validator** for input validation
- **CORS** for cross-origin requests
- **Role-based middleware** for access control

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB instance (local or cloud)
- Git for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd finance-dashboard
   ```

2. **Install dependencies**
   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd ../frontend
   npm install
   ```

3. **Environment Configuration**
   ```bash
   # Backend
   cd backend
   cp .env.example .env
   # Edit .env with your MongoDB URI

   # Frontend
   cd ../frontend
   # No additional config needed
   ```

4. **Database Setup**
   ```bash
   # Ensure MongoDB is running
   # For local development:
   mongod

   # Or connect to MongoDB Atlas
   # Update MONGODB_URI in .env accordingly
   ```

5. **Run the application**
   ```bash
   # Terminal 1: Backend Server
   cd backend
   npm run dev

   # Terminal 2: Frontend Development Server
   cd ../frontend
   npm run dev
   ```

## 📁 Project Structure

```
finance-dashboard/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── dashboardController.js
│   │   ├── transactionController.js
│   │   └── userController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Transaction.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── dashboard.js
│   │   ├── transactions.js
│   │   └── users.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   └── Layout.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Transactions.jsx
│   │   │   └── Users.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🔐 Authentication & Security

### Role-Based Access Control
- Role-based authorization middleware
- Protected routes with authorization checks
- Password hashing with bcrypt
- Role-based query parameter authentication

### Security Features
- CORS enabled for cross-origin requests
- Input validation and sanitization
- Error handling and rate limiting ready
- Environment variable configuration
- Secure password policies

## 📊 API Documentation

### Base URL
```
http://localhost:8001
```

### Authentication Method
All endpoints use role-based authentication through query parameters:
```
?role={viewer|analyst|admin}
```

**Important**: The `role` parameter must be included in all protected requests to specify the user's role for authorization checks.

### Available Roles
- **viewer**: Can only access dashboard summary
- **analyst**: Can access dashboard and all transaction operations  
- **admin**: Full access including user management

### Authentication Routes
| Method | Endpoint | Description | Required Role |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | None |
| POST | `/api/auth/login` | User login | None |
| GET | `/api/auth/me` | Get current user info | Any role |

#### Register Request Body
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "viewer" // optional, defaults to "viewer"
}
```

#### Register Response
```json
{
  "success": true,
  "user": {
    "id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "viewer",
    "status": "active"
  }
}
```

#### Login Request Body
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login Response
```json
{
  "success": true,
  "user": {
    "id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "viewer",
    "status": "active"
  }
}
```

### Dashboard Routes
| Method | Endpoint | Description | Required Role |
|--------|----------|-------------|---------------|
| GET | `/api/dashboard/summary` | Get dashboard analytics | viewer, analyst, admin |

#### Example Request
```
GET /api/dashboard/summary?role=viewer
```

#### Dashboard Response
```json
{
  "success": true,
  "data": {
    "totalIncome": 15000.00,
    "totalExpenses": 8500.00,
    "netBalance": 6500.00,
    "transactionCount": 25,
    "recentTransactions": [],
    "monthlyData": [
      { "month": "Jan", "income": 5000, "expenses": 3000 },
      { "month": "Feb", "income": 4000, "expenses": 2500 }
    ]
  }
}
```

### Transaction Routes
| Method | Endpoint | Description | Required Role |
|--------|----------|-------------|---------------|
| GET | `/api/transactions` | List all transactions | analyst, admin |
| GET | `/api/transactions/:id` | Get transaction by ID | analyst, admin |
| POST | `/api/transactions` | Create new transaction | analyst, admin |
| PUT | `/api/transactions/:id` | Update transaction | analyst, admin |
| DELETE | `/api/transactions/:id` | Delete transaction | analyst, admin |

#### Create Transaction Request Body
```json
{
  "amount": 1000.50,
  "type": "income", // "income" or "expense"
  "category": "Salary",
  "description": "Monthly salary",
  "date": "2024-01-15" // optional, defaults to current date
}
```

#### Create Transaction Response
```json
{
  "success": true,
  "data": {
    "id": "64f1a2b3c4d5e6f7g8h9i0j2",
    "amount": 1000.50,
    "type": "income",
    "category": "Salary",
    "description": "Monthly salary",
    "date": "2024-01-15T00:00:00.000Z",
    "user": "64f1a2b3c4d5e6f7g8h9i0j1",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Get Transactions Response
```json
{
  "success": true,
  "data": [
    {
      "id": "64f1a2b3c4d5e6f7g8h9i0j2",
      "amount": 1000.50,
      "type": "income",
      "category": "Salary",
      "description": "Monthly salary",
      "date": "2024-01-15T00:00:00.000Z",
      "user": "64f1a2b3c4d5e6f7g8h9i0j1",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

#### Example Requests
```
GET /api/transactions?role=analyst
POST /api/transactions?role=admin
PUT /api/transactions/123?role=analyst
```

### User Management Routes
| Method | Endpoint | Description | Required Role |
|--------|----------|-------------|---------------|
| GET | `/api/users` | List all users | admin |
| PUT | `/api/users/:id` | Update user | admin |
| DELETE | `/api/users/:id` | Delete user | admin |

#### Update User Request Body
```json
{
  "name": "Updated Name",
  "email": "updated@example.com",
  "role": "analyst",
  "status": "active" // "active" or "inactive"
}
```

#### Get Users Response
```json
{
  "success": true,
  "data": [
    {
      "id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "viewer",
      "status": "active",
      "createdAt": "2024-01-10T08:00:00.000Z"
    },
    {
      "id": "64f1a2b3c4d5e6f7g8h9i0j3",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "role": "admin",
      "status": "active",
      "createdAt": "2024-01-12T09:30:00.000Z"
    }
  ]
}
```

#### Example Requests
```
GET /api/users?role=admin
PUT /api/users/123?role=admin
DELETE /api/users/123?role=admin
```

### Health Check
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API health check |

### Response Format
All API responses follow this format:
```json
{
  "success": true,
  "data": {}, // or "user": {}
  "message": "Operation completed successfully"
}
```

### Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // validation errors (if any)
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## 🎯 Role-Based Access Control

### Implementation Details
- **Middleware**: Custom authorization middleware checks user roles
- **Frontend**: Navigation items filtered by user role
- **Dashboard**: Recent transactions hidden for viewers
- **API**: Role-based route protection

### Access Matrix
- **Viewers**: Dashboard view only, no transaction management
- **Analysts**: Full dashboard access, transaction CRUD operations
- **Admins**: Complete system access including user management

## 🚀 Deployment

### Production Build
```bash
# Frontend Production Build
cd frontend
npm run build

# Output in dist/ folder
# Ready for deployment to any static hosting service
```

### Environment Variables
```bash
# Backend .env required
PORT=8001
MONGODB_URI=mongodb+srv://your-connection-string
NODE_ENV=production
```

### Deployment Options
- **Vercel/Netlify**: Frontend static hosting
- **Heroku/Railway**: Backend server hosting
- **AWS/Azure**: Full stack deployment
- **Docker**: Containerized deployment

## 🔧 Configuration

### Backend Configuration
- Express.js server with CORS enabled
- MongoDB connection with Mongoose
- Error handling middleware
- Request validation and sanitization

### Frontend Configuration
- Vite build system for fast development
- React Router for client-side routing
- Axios interceptors for API communication
- Responsive design with Tailwind CSS

## 📈 Monitoring & Logging

### Development
- Console logging for debugging
- Error tracking and reporting
- Performance monitoring ready

### Production
- Structured logging implementation
- Error tracking services integration ready
- Performance metrics collection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Support

For support and questions:
- Create an issue in the GitHub repository
- Check existing documentation and FAQs
- Review the code comments and inline documentation

---

**Built with ❤️ for modern financial data management**