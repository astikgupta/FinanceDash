# Finance Data Processing & Access Control API

A robust Node.js/Express backend for processing financial records with tiered Role-Based Access Control (RBAC). Built as a professional assignment submission.

## 🚀 Key Features

- **User Management**: Registration, Login, and Admin-only user management.
- **Role-Based Access Control (RBAC)**:
  - `Viewer`: Read records only.
  - `Analyst`: Read records + Analytics Dashboard.
  - `Admin`: Full CRUD + User Management.
- **Financial Records**: CRUD operations with filtering, search, pagination, and soft delete.
- **Dashboard Analytics**: Aggregation for Income/Expense trends, category-wise totals, and monthly stats.
- **Security**: JWT Authentication, Bcrypt password hashing, Rate Limiting, and Helmet security headers.
- **Validation**: Strict input validation using Joi.

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens)
- **Testing**: Jest & Supertest
- **Validation**: Joi

## 📋 Design Decisions & Assumptions

### Architecture
- **MVC + Service Layer**: I chose to separate business logic into a `Service` layer. This ensures that the code remains DRY (Don't Repeat Yourself) and makes unit testing significantly easier.
- **Global Error Handling**: A centralized `errorHandler` ensures all errors follow a consistent JSON format, improving the frontend developer experience.

### Access Control
- **RBAC Middleware**: Instead of checking roles inside every controller, I implemented a generic `authorize(...roles)` middleware. This makes the routes clean and the security policy explicit.

### Data Integrity (Soft Delete)
- **Soft Deletion**: I implemented an `isDeleted` flag for both Users and Records. This is a common requirement in finance apps to maintain audit trails while preventing data from showing in active views.

### Assumptions
1. **User Identity**: Financial records are private to the creator (Admin/Analyst). While an Admin can manage all records, the default view is for the logged-in user.
2. **Dynamic Categories**: The system allows any category string for flexibility, but the dashboard aggregates based on whatever strings are present.
3. **Monthly Trends**: The dashboard defaults to the current calendar year to show meaningful trends in the chart data.

## 🚥 Setup Instructions

1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Configure Environment Variables**:
   Update `.env` with your `MONGODB_URI` and `JWT_SECRET`.
3. **Seed the Database**:
   Populate the database with test users and sample records:
   ```bash
   npm run seed
   ```
4. **Run the application**:
   ```bash
   npm run dev
   ```

## 🧪 Testing

I have included integration tests to ensure the reliability of the core modules (Auth, Records, RBAC).
```bash
npm test
```

## 📍 API Endpoints (Brief)

| Method | Endpoint | Access |
| :--- | :--- | :--- |
| POST | `/api/v1/auth/register` | Public |
| POST | `/api/v1/auth/login` | Public |
| GET | `/api/v1/records` | Viewer/Analyst/Admin |
| POST | `/api/v1/records` | Analyst/Admin |
| GET | `/api/v1/dashboard` | Analyst/Admin |
| GET | `/api/v1/users` | Admin Only |

*(Full details in the project folder)*
