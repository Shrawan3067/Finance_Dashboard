# Finance Data Processing and Access Control System

A comprehensive finance dashboard system with role-based access control, transaction management, and data analytics.

## 🚀 Features

### Core Features
- **User Authentication & Authorization** with JWT
- **Role-Based Access Control** (Admin, Analyst, Viewer)
- **Financial Transaction Management** (CRUD operations)
- **Dashboard Analytics** with charts and summaries
- **User Management** for administrators
- **Data Filtering & Pagination**

### Role Permissions

| Action | Viewer | Analyst | Admin |
|--------|--------|---------|-------|
| View Dashboard | ✅ | ✅ | ✅ |
| View Transactions | ✅ | ✅ | ✅ |
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
- **JWT** for authentication
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
   # Edit .env with your MongoDB URI and JWT secret

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

### JWT Authentication
- Secure token-based authentication
- Role-based access control middleware
- Protected routes with authorization checks
- Password hashing with bcrypt
- Token expiration management

### Security Features
- CORS enabled for cross-origin requests
- Input validation and sanitization
- Error handling and rate limiting ready
- Environment variable configuration
- Secure password policies

## 📊 API Endpoints

### Authentication Routes
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile

### Dashboard Routes
- `GET /api/dashboard/summary` - Dashboard analytics (Viewer+, Analyst+, Admin+)

### Transaction Routes
- `GET /api/transactions` - List transactions (Analyst+, Admin+)
- `GET /api/transactions/:id` - Get single transaction (Analyst+, Admin+)
- `POST /api/transactions` - Create transaction (Analyst+, Admin+)
- `PUT /api/transactions/:id` - Update transaction (Analyst+, Admin+)
- `DELETE /api/transactions/:id` - Delete transaction (Analyst+, Admin+)

### User Management Routes
- `GET /api/users` - List users (Admin only)
- `GET /api/users/:id` - Get user (Admin only)
- `PUT /api/users/:id` - Update user (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)

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
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
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