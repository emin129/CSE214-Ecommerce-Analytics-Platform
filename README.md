

📊 E-Commerce Analytics Platform (CSE214) 🚀

A high-performance Full-Stack E-Commerce solution that bridges modern management dashboards with state-of-the-art AI Agent orchestration. Designed for the complex needs of today's digital marketplaces, providing specialized analytical tools for both Admins and Sellers.

✨ Key Features

🤖 Multi-Agent AI Chatbot: * Powered by LangGraph & Gemini API.

Generates real-time Text-to-SQL queries to provide instant data-driven insights.

🔐 Secure Authentication (RBAC): * Fine-grained Role-Based Access Control for Admin, Seller, and Customer roles.

Implemented via Spring Security & JWT (JSON Web Tokens).

📈 Advanced Data Visualization: * Interactive sales dashboards, order tracking, and inventory heatmaps powered by Chart.js.

⚙️ Automated Business Metrics: * Backend architecture optimized for instant store performance reports and ROI calculations.

💳 Secure Checkout Simulation: * Integrated with Stripe infrastructure for reliable and safe transaction simulations.

🛠️ Tech Stack

Layer	Technologies

Backend	Java 17, Spring Boot, Spring Security, JPA / Hibernate, MySQL

AI Orchestration	Gemini Pro API, LangGraph, RAG (Retrieval-Augmented Generation)

Frontend	Angular 17+, TypeScript, Tailwind CSS, RxJS

DevOps & Tools	Git, GitHub, Maven, Azure Cloud

📂 Project Architecture

The project follows a modular monorepo structure for seamless integration:

Bash
├── 📂 backend/   # Spring Boot RESTful API & Gemini AI Logic
├── 📂 frontend/  # Angular Dashboard & Customer UI
└── README.md     # Project Documentation

🔧 Quick Start

1️⃣ Backend Setup

Navigate to backend/.

Update src/main/resources/application.properties with your MySQL credentials.

Add your GEMINI_API_KEY to your environment variables.

Run: ./mvnw spring-boot:run

2️⃣ Frontend Setup

Navigate to frontend/.

Install dependencies: npm install

Start the app: ng serve

Open: http://localhost:4200

👥 Contributors

Mehmet Emin Ejderha – Backend & AI Orchestration

Fatih Ateş – Frontend & UI/UX Design
