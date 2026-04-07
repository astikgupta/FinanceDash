# FinanceDash 💸

A premium, full-stack Finance Dashboard localized for the Indian market, featuring a modern **Glassmorphism** UI, role-based access control, and real-time financial tracking.

![FinanceDash Preview](https://github.com/astikgupta/FinanceDash/raw/main/preview.png)

## 🌟 Features

- **Premium Aesthetics**: Stunning Glassmorphism design with a breathable, modern layout.
- **🇮🇳 Indian Localization**: Fully localized for India with **Rupee (₹)** symbols and the **Indian Numbering System** (e.g., 10,00,000.00).
- **Mobile Responsive**: Optimized for all devices with a dedicated mobile filter toggle and retractable sidebar.
- **Role-Based Access Control (RBAC)**:
  - **Admin**: Full control over all system settings and records.
  - **Analyst**: Ability to create, edit, and delete any financial records for audit purposes.
- **Dynamic Data Visualization**: Beautiful charts and summaries powered by modern charting libraries.

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, Vanilla CSS (Premium Custom Styles).
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Atlas).
- **Security**: JWT Authentication, API Rate Limiting (1000 req/window).

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB Atlas Account
- Git

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/astikgupta/FinanceDash.git
   cd FinanceDash
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_secret_key
   ```
   Start the backend:
   ```bash
   npm run dev
   ```

3. **Frontend Setup**:
   ```bash
   cd ../frontend
   npm install
   ```
   Create a `.env` file in the `frontend` directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
   Start the frontend:
   ```bash
   npm run dev
   ```

## 📸 Screenshots

| Dashboard View | Mobile View (Filters) |
| :---: | :---: |
| ![Dashboard](https://github.com/astikgupta/FinanceDash/raw/main/screenshots/dashboard.png) | ![Mobile](https://github.com/astikgupta/FinanceDash/raw/main/screenshots/mobile.png) |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
