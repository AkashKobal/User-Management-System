# 🧑‍💼 User Management System

[![React](https://img.shields.io/badge/Frontend-React.js-blue?logo=react)](https://reactjs.org/)
[![Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot-green?logo=spring)](https://spring.io/projects/spring-boot)
[![MySQL](https://img.shields.io/badge/Database-MySQL-blue?logo=mysql)](https://www.mysql.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> A full-featured **User Management System** built using **Spring Boot**, **React**, **MySQL**, and **JavaMailSender**. The system supports **user registration with email OTP verification**, **login**, **password reset**, **role-based access (Admin/User)**, and advanced features like **exporting user data to Excel**, **sorting**, and **filtering**.

---

## 🚀 Tech Stack

- **Frontend**: React.js (with Axios, Bootstrap)
- **Backend**: Spring Boot (Spring Security, JWT)
- **Database**: MySQL
- **Email Service**: JavaMailSender (SMTP)
- **Export**: Apache POI for Excel export
- **Token Management**: JWT (JSON Web Token)

---

## 🔐 Features

- ✅ Register with OTP email verification  
- ✅ Login with secure JWT token  
- 🔁 Forgot Password with email OTP  
- 📤 Export user data to Excel  
- 🔍 Filter, sort, and search users  
- 🔑 Admin/User role segregation  
- 👤 User Profile management  
- 📊 Dashboard with charts  

---

## 📸 Screenshots

| Name | Screenshot |
|------|------------|
| 🏠 Home | ![Home](https://github.com/AkashKobal/User-Management-System/blob/main/screenshot/home.png) |
| 🔐 Login | ![Login](https://github.com/AkashKobal/User-Management-System/blob/main/screenshot/login.png) |
| 📝 Register (Create User) | ![Create User](https://github.com/AkashKobal/User-Management-System/blob/main/screenshot/create_user.png) |
| 🔑 Forgot Password | ![Forgot Password](https://github.com/AkashKobal/User-Management-System/blob/main/screenshot/forgot_password.png) |
| 📧 Enter OTP | ![Enter OTP](https://github.com/AkashKobal/User-Management-System/blob/main/screenshot/enter_otp.png) |
| 🔄 Verify OTP | ![Verify OTP](https://github.com/AkashKobal/User-Management-System/blob/main/screenshot/verify_otp.png) |
| 📥 Export User | ![Export User](https://github.com/AkashKobal/User-Management-System/blob/main/screenshot/export_user.png) |
| 🧑‍💼 Manage Users | ![Manage User](https://github.com/AkashKobal/User-Management-System/blob/main/screenshot/manage_user.png) |
| 🆙 Update User | ![Update User](https://github.com/AkashKobal/User-Management-System/blob/main/screenshot/update_user.png) |
| 🔃 Sort User | ![Sort User](https://github.com/AkashKobal/User-Management-System/blob/main/screenshot/sort_user.png) |
| 📄 Profile | ![Profile](https://github.com/AkashKobal/User-Management-System/blob/main/screenshot/profile.png) |
| 🔁 Logout | ![Logout](https://github.com/AkashKobal/User-Management-System/blob/main/screenshot/logout.png) |
| 📊 Dashboard | ![Dashboard](https://github.com/AkashKobal/User-Management-System/blob/main/screenshot/dashboard.png) |

---

## 🛠️ Getting Started

### Prerequisites
- Node.js & npm
- Java 17+
- MySQL
- Maven

### 1️⃣ Backend Setup

```bash
cd Backend
mvn clean install
```

Update `application.properties` with your DB credentials and SMTP details.

Run the Spring Boot App:

```bash
mvn spring-boot:run
```

### 2️⃣ Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

## 📦 API Highlights

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/verify-email`
- `POST /api/auth/forgot-password`
- `GET /admin/get-all-users`
- `GET /admin/export-excel`

---

## 🙌 Acknowledgements

- Spring Boot & Spring Security
- React & Axios
- Apache POI (Excel Export)
- JWT Authentication
- JavaMailSender for SMTP

---

## 📄 License

This project is open-source and free to use under the [MIT License](LICENSE).
