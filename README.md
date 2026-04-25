📊 E-Commerce Analytics Platform (CSE214) 🚀


A comprehensive Full-Stack E-Commerce solution that merges modern management dashboards with advanced AI Agents. This platform provides specialized analytical tools for both Admins and Sellers, powered by the Gemini AI orchestration.

✨ Key Features

🤖 Multi-Agent AI Chatbot: Built with LangGraph and Gemini API to generate real-time SQL queries and provide data-driven insights.

🔐 Secure Authentication: Role-Based Access Control (RBAC) for Admin, Seller, and Customer roles using Spring Security & JWT.

📈 Data Visualization: Interactive sales, order tracking, and inventory charts powered by Chart.js.

⚙️ Automated Analytics: Backend architecture designed to generate instant store performance reports and business metrics.

💳 Payment Integration: Secure checkout simulation integrated with the Stripe infrastructure.

🛠️ Tech Stack

Layer	Technologies

Backend	Java 17, Spring Boot, Spring Security, JPA / Hibernate, MySQL

AI Orchestration	Gemini Pro API, LangGraph, Retrieval-Augmented Generation (RAG)

Frontend	Angular 17+, TypeScript, Tailwind CSS, RxJS

Tools & DevOps	Git, GitHub, Maven, Azure Cloud

📂 Project Structure

The project is organized into two main modules:

📂 backend/ → Spring Boot RESTful API and AI logic services.

📂 frontend/ → Angular-based user interface and management panels.

🔧 Installation & Setup

1️⃣ Backend Setup

Configure your database settings in ecommerce-backend/src/main/resources/application.properties.

Add your Gemini API Key to the environment variables or properties file.

Run the application: ./mvnw spring-boot:run

2️⃣ Frontend Setup

Navigate to the ecommerce-frontend/ directory.

Install dependencies: npm install

Launch the development server: ng serve (Access via http://localhost:4200)

👤 Developer

Mehmet Emin Ejderha

Fatih Ateş
