# 🏠 ShelterIT – Rental Platform

ShelterIT is a full-stack rental platform built using the **MERN stack** that allows users to discover, view, and manage rental properties through a modern web interface.

The platform provides a seamless experience for users to explore available properties, view detailed property information, and manage rental listings.

---

## 🚀 Features

### 👤 User Features

* User registration and login
* Secure authentication
* Browse available rental properties
* Search and explore properties
* View detailed property information
* View property images and details
* Manage user profile
* Create and manage property listings

### 🏡 Property Features

* Add new rental properties
* Edit existing property listings
* Delete property listings
* Property details page
* Property images
* Location and pricing information
* Property availability information

### 🔐 Authentication

* User authentication
* Password encryption using `bcrypt`
* JWT-based authentication
* Protected routes
* Cookie-based authentication

---

## 🛠️ Tech Stack

### Frontend

* React.js
* JavaScript
* HTML5
* CSS3
* Bootstrap

### Backend

* Node.js
* Express.js
* RESTful APIs
* JWT
* bcrypt
* cookie-parser

### Database

* MongoDB
* MongoDB Atlas

### Tools

* Git
* GitHub
* VS Code
* Postman

---

## 🏗️ Project Architecture

```text
ShelterIT
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   │
│   └── package.json
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── utils/
│   ├── app.js
│   └── package.json
│
├── public/
├── .gitignore
└── README.md
```

> The exact folder structure may differ depending on your current implementation.

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/ShelterIT.git
```

### 2. Navigate to the project

```bash
cd ShelterIT
```

### 3. Install frontend dependencies

```bash
cd frontend
npm install
```

### 4. Install backend dependencies

```bash
cd ../backend
npm install
```

---

## 🔑 Environment Variables

Create a `.env` file inside the backend directory.

```env
PORT=8080
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### Example

```env
PORT=8080
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/shelterit
JWT_SECRET=your_secret_key
```

> Never upload your `.env` file or database credentials to GitHub.

---

## ▶️ Running the Project

### Start the Backend

```bash
cd backend
npm start
```

or, if using nodemon:

```bash
npm run dev
```

The backend will run on:

```text
http://localhost:8080
```

### Start the Frontend

Open another terminal:

```bash
cd frontend
npm start
```

The frontend will run on the URL shown by your React development server.

---

## 🔄 Application Flow

```text
User
  │
  ▼
React Frontend
  │
  ▼
REST API
  │
  ▼
Express.js Backend
  │
  ▼
Authentication / Business Logic
  │
  ▼
MongoDB
```

---

## 🔐 Authentication Flow

ShelterIT uses JWT-based authentication to secure user accounts and protected resources.

```text
User Login
    │
    ▼
Frontend sends credentials
    │
    ▼
Express.js API
    │
    ▼
Validate user
    │
    ▼
Verify password using bcrypt
    │
    ▼
Generate JWT
    │
    ▼
Store authentication information
    │
    ▼
Access protected resources
```

---

## 📸 Screenshots

Add screenshots of your application here.

### Home Page

```text
Add your screenshot here
```

### Property Listing

```text
Add your screenshot here
```

### Property Details

```text
Add your screenshot here
```

### Login / Signup

```text
Add your screenshot here
```

---

## 🌟 Key Highlights

* Full-stack MERN application
* RESTful backend architecture
* MongoDB database integration
* Secure user authentication
* JWT authorization
* Password hashing using bcrypt
* Protected routes
* CRUD operations for rental properties
* Responsive user interface

---

## 🧪 API Testing

The backend APIs can be tested using **Postman**.

Example API structure:

```text
Authentication
├── POST /api/auth/register
├── POST /api/auth/login
└── POST /api/auth/logout

Properties
├── GET    /api/properties
├── GET    /api/properties/:id
├── POST   /api/properties
├── PUT    /api/properties/:id
└── DELETE /api/properties/:id
```

> Update these endpoints according to the actual routes in your project.

---

## 🔮 Future Improvements

* Advanced property search
* Filters based on price and location
* Property reviews and ratings
* Online booking system
* Payment gateway integration
* Google Maps integration
* Email notifications
* Admin dashboard
* Property owner dashboard
* Cloud image storage
* Deployment with CI/CD

---

## 📚 What I Learned

While developing ShelterIT, I gained practical experience in:

* Full-stack web application development
* React component-based architecture
* REST API development
* Express.js backend development
* MongoDB database management
* Authentication and authorization
* JWT implementation
* Password security using bcrypt
* CRUD operations
* API testing using Postman
* Git and GitHub workflow

---

## 👨‍💻 Author

**Aditya Tawhare**

Computer Engineering Student | Full Stack Developer

* GitHub: [AdityaTawhare](https://github.com/AdityaTawhare)
* Instagram: [@aditya_tawhare_21](https://instagram.com/aditya_tawhare_21)
* X: [@AdityaTawhare21](https://x.com/AdityaTawhare21)
* Email: [adityatawhare21@gmail.com](mailto:adityatawhare21@gmail.com)

---

## 📄 License

This project is created for educational and portfolio purposes.

---

⭐ If you found this project interesting, consider giving the repository a star!
