# 📊 CSE214: Full-Stack E-Commerce Analytics & AI-Powered Business Intelligence

<p align="center">
  <img src="https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen?style=for-the-badge&logo=springboot" />
  <img src="https://img.shields.io/badge/Angular-17+-red?style=for-the-badge&logo=angular" />
  <img src="https://img.shields.io/badge/AI-Gemini%20Flash-blue?style=for-the-badge&logo=google-gemini" />
  <img src="https://img.shields.io/badge/Database-MySQL-blue?style=for-the-badge&logo=mysql" />
</p>

## 📖 Project Overview
This is a high-performance **Full-Stack E-Commerce Analytics Platform**. It provides a dual-interface experience: a "Premium" customer storefront and an AI-driven administrator dashboard. The platform's unique selling point is its **AI-Powered Text-to-SQL Engine**, which allows store managers to perform complex data analysis using natural language.

---

## ✨ Key System Modules

### 🤖 AI Insights Engine (Text-to-SQL)
Using **Google Gemini Flash**, we’ve implemented a natural language bridge to our MySQL database.
* **Functionality:** Admins ask: *"What was our best-selling category last month?"*
* **Process:** The backend sends the prompt + schema metadata to the Gemini API, receives an optimized SQL query, and executes it securely.
* **Benefit:** No SQL knowledge is required for data-driven decision-making.

### 📱 Premium Frontend (Angular)
* **Responsive Design:** A unified codebase for Web and Mobile environments.
* **Modern UI/UX:** High-quality aesthetics featuring Glassmorphism, neon accents, and interactive data visualizations.
* **State Management:** Reactive data flows using **RxJS** for real-time UI updates.

### 💳 Financial Operations
* **Stripe Integration:** Fully functional payment gateway for secure customer transactions.
* **Order Management:** Real-time tracking of sales, stocks, and transaction statuses.

---

## 🛠 Technical Architecture

### 🧱 Backend (Spring Boot)
* **Port:** Running on `8081` for optimal local development.
* **Security:** Role-based access control with **JWT** and **Spring Security**.
* **Documentation:** Interactive API explorer via **Swagger UI** (`/swagger-ui.html`).

### 🎨 Frontend (Angular)
* **Port:** Running on `4200`.
* **Charts:** Dynamic visualization of database metrics via modern charting libraries.

---

## 🚀 Installation & Setup

### 1. Clone the Project
```bash
git clone [https://github.com/emin129/CSE214-Ecommerce-Analytics-Platform.git](https://github.com/emin129/CSE214-Ecommerce-Analytics-Platform.git)