
# **University Booking System - Secure Room Reservation Platform**

A secure, full-stack booking system designed for managing room reservations. Built using **Node.js**, **Express**, **MongoDB**, and vanilla **HTML**, **CSS**, and **JavaScript**. This project was developed as a learning exercise to implement **secure development practices** and explore compliance with industry standards.

Key features include:
- **Role-Based Access Control (RBAC)**
- **JWT-based Authentication**
- **Input Validation and Output Encoding**
- **Compliance with OWASP Top 10 Guidelines**
- **Security Documentation and Testing**: Includes tools like **OWASP ZAP** and **BDD-Security**, and adherence to **ISO/IEC 27001** compliance.
- Comprehensive security testing and policies, along with risk assessment and mitigation strategies.

---

## **Table of Contents**
1. [Features](#features)
2. [Architecture](#architecture)
3. [Security Practices](#security-practices)
4. [Installation](#installation)
5. [Usage](#usage)
6. [Documentation](#documentation)
7. [Testing and Validation](#testing-and-validation)
8. [Future Enhancements](#future-enhancements)
9. [Contributing](#contributing)
10. [License](#license)

---

## **Features**
- **Secure Authentication and Authorization**:
  - Passwords stored as salted hashes using `bcrypt`.
  - Role-based access control for users and admins.
  - JWT tokens for session management.
- **Robust Input Validation**:
  - Backend input validation to prevent injection attacks.
  - Adherence to OWASP best practices for user input sanitization.
- **Comprehensive Documentation**:
  - Threat Model Document (STRIDE-based threat identification and mitigation).
  - Risk Assessment and Mitigation Plan.
  - Application Security for OSI Layers.
  - Incident Response Plan.
- **Automated Security Testing**:
  - Integrated with tools like **OWASP ZAP** and **BDD-Security** for testing vulnerabilities.
- **Responsive Frontend**:
  - Built with vanilla HTML, CSS, and JavaScript.
  - Mobile-friendly and user-friendly interfaces.

---

## **Architecture**
The system follows a **client-server architecture** with the following components:
- **Frontend**: User interface developed with HTML, CSS, and JavaScript.
- **Backend**: Node.js and Express handle API requests and business logic.
- **Database**: MongoDB for storing user accounts, room details, and booking information.
- **Security Layer**: Integrated with JWT, role-based access control, and secure coding practices.

Refer to the **[System Overview and Architecture](docs/System_Overview_Architecture.pdf)** document for detailed diagrams and explanations.

---

## **Security Practices**
This project focuses on **secure development** and includes:
1. **Authentication and Authorization**:
   - Password hashing using `bcrypt`.
   - JWT for stateless authentication.
   - Role-based access control.
2. **Input Validation and Output Encoding**:
   - Validation of all user inputs to prevent common attacks (e.g., SQL Injection, XSS).
3. **Secure Data Transmission**:
   - Use of HTTPS (recommended for deployment) and CORS policies.
4. **Error Handling and Logging**:
   - Proper error messages to avoid information disclosure.
   - Logging mechanisms for audit and troubleshooting.
5. **Compliance Considerations**:
   - Adherence to **OWASP Top 10** and ISO/IEC 27001 Annex A controls.

---

## **Installation**
### **Requirements**
- Node.js and npm
- MongoDB instance (local or cloud-based)
- Git

### **Steps**
1. Clone the repository:
   ```bash
   git clone git@github.com:AdithyaaSivamal/UOW-Booking-System.git
   ```
2. Navigate to the project directory:
   ```bash
   cd UOW-Booking-System
   ```
3. Set up the backend:
   ```bash
   cd backend
   npm install
   cp .env.example .env  # Configure environment variables
   npm start
   ```
4. Set up the frontend:
   ```bash
   cd ../frontend
   npm install
   npm start
   ```

---

## **Usage**
1. **Admin Dashboard**:
   - Login as an admin to manage rooms and bookings.
2. **User Features**:
   - Register, login, and book available rooms.
   - View and cancel existing bookings.


---

## **Documentation**
The project includes comprehensive documentation:
1. **[System Overview and Architecture](docs/System_Overview_Architecture.pdf)**
2. **[Threat Model Document](docs/Threat_Model_and_Risk_Assessment.pdf)**
3. **[Risk Assessment and Mitigation Plan](docs/Risk_Assessment_and_Mitigation_Plan.pdf)**
4. **[Security Policies](docs/Security_Policies_and_Guidelines.pdf)**
5. **[Application Security Testing and Validation](docs/Security_Testing_Report_and_Validation.pdf)** 

---

## **Testing and Validation**
### **Tools Used**:
- **OWASP ZAP**: Automated security testing for APIs and web pages.
- **BDD-Security**: Behavior-driven security testing.
- **npm audit**: Dependency vulnerability checks.

Refer to the **[Security Testing and Validation Document](docs/Security_Testing.pdf)** for more details.

---

