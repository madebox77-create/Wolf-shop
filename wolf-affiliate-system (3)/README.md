# 🐺 Wolf Affiliate System

A premium e-commerce and affiliate management ecosystem built for scale. This platform combines a sleek, dark-themed storefront with a powerful AI-driven admin dashboard for the modern affiliate marketer.

## ✨ Key Features

-   **🎯 Conversion-Focused Storefront**: A brutalist yet polished shopping experience designed to maximize click-through rates.
-   **🔐 Secure Multi-Role Auth**: Powered by **Firebase Auth**, providing seamless Google Login and identity protection.
-   **💻 AI-Powered Admin Panel**: Real-time sales analytics, inventory tracking, and commission management.
-   **💳 Dynamic Payment Gateway**: Integrated with **Razorpay** for frictionless local and international transactions.
-   **📱 Fully Responsive Design**: Built with **Tailwind CSS v4** and **Framer Motion** for a fluid mobile and desktop experience.
-   **⚡ Real-Time Sync**: Instant updates for order status, cart management, and dashboard data using **Firestore**.

## 🛠️ Tech Stack

-   **Frontend**: React 19, Vite, Tailwind CSS, Framer Motion, Lucide React
-   **Backend**: Firebase (Auth & Firestore), Node.js (Express)
-   **Deployment**: Vercel & AI Studio
-   **Payments**: Razorpay

## 🚀 Getting Started

### 1. Configure Firebase
Create a `firebase-applet-config.json` file in the root directory:
```json
{
  "apiKey": "YOUR_API_KEY",
  "authDomain": "YOUR_AUTH_DOMAIN",
  "projectId": "YOUR_PROJECT_ID",
  "appId": "YOUR_APP_ID",
  "firestoreDatabaseId": "(default)"
}
```

### 2. Set Environment Variables
Copy `.env.example` to `.env` and fill in your credentials.

### 3. Local Development
```bash
npm install
npm run dev
```

## 🔒 Security

All credit card processing and sensitive user data are handled via encrypted gateways. Admin access is strictly limited via email domain whitelisting and Firestore security rules.

## 📄 License

This project is licensed under the Apache-1.0 License.

---
*Built with speed, focus, and power. Join the Pack.*
