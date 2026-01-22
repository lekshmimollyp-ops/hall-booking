# VenueHub Pro - Technology Stack

This document outlines the technical architecture and libraries used in the Hall Booking System.

## 1. Frontend (Web Portal)
Built for speed and simplicity, enabling hall managers to control bookings effortlessly.

*   **Framework**: [React.js](https://react.dev/) (v19)
*   **Build Tool**: [Vite](https://vitejs.dev/) (Fast hot module replacement)
*   **Styling**: Vanilla CSS with CSS Variables (Custom Design System)
*   **Routing**: React Router DOM (v7)
*   **HTTP Client**: Axios
*   **Icons**: React Icons (Fa6)

## 2. Backend (API)
A robust, secure REST API handling all business logic and data persistence.

*   **Framework**: [Laravel](https://laravel.com/) (v11)
*   **Language**: PHP 8.2
*   **Database ORM**: Eloquent
*   **Authentication**: ICT (Custom Token Implementation)
*   **API Structure**: RESTful
*   **Middleware**: Role-based access control (Admin/Staff/Hall-based)

## 3. Database
*   **System**: PostgreSQL
*   **Hosting**: AWS RDS (or local PostgreSQL on EC2)
*   **Features Used**:
    *   Foreign Key Constraints
    *   Pivot Tables (Many-to-Many relationships for Hall Assignments)
    *   JSON columns (for flexible data where needed)

## 4. Mobile Application
A cross-platform app for staff to manage bookings on the go.

*   **Framework**: [React Native](https://reactnative.dev/)
*   **Platform**: [Expo](https://expo.dev/) (Managed Workflow)
*   **Build Service**: EAS (Expo Application Services)
*   **Navigation**: Expo Router
*   **HTTP Client**: Axios
*   **Environment Management**: Dynamic Config (`app.config.js`) for multi-client builds

## 5. Infrastructure & Deployment
*   **Server**: AWS EC2 (Ubuntu 22.04 LTS)
*   **Web Server**: Nginx (Reverse Proxy)
*   **SSL**: Let's Encrypt (Certbot)
*   **Process Manager**: PHP-FPM
*   **Version Control**: Git (GitHub)

## 6. Development Tools
*   **IDE**: VS Code
*   **API Testing**: Postman / Thunder Client
*   **Database GUI**: PGAdmin / DBeaver
