ex3 is in branch: Exercise-3
# MailSnap – Gmail-like Mail Application
MailSnap is a full-featured email web application inspired by Gmail. It offers a modern, responsive UI, custom labels, spam detection, dark mode, and secure authentication – all built using a full-stack architecture and microservices.

![MailSnap Inbox](screenshots/inbox.png)
![MailSnap Mail View](screenshots/mailview.png)

---

## Features

- User registration with image upload  
- JWT-based authentication  
- Compose, send, receive, and draft emails
- Mark emails as read (read emails shown with a light gray background)
- Search through emails by subject or content
- Star/unstar emails  
- Custom labels (create, assign, remove)  
- Report or unreport emails as spam - detection via C++ Bloom Filter server  
- Trash and restore functionality  
- Dark/Light mode toggle  
- Responsive UI using React

---


## Authentication Flow

Users can sign up and log in securely using JWTs. Registration includes uploading a profile image, and only verified users can access the inbox and email features.

### Sign Up Form Requirements:
- All fields are required, except for the image upload, which is optional.

- Users must be at least 13 years old to register (based on their birth date).

- The form includes validation for:

     * First name & last name

     * Birth date (min. year 1905, max. age under 13 not allowed)

     * Gender

     * Email must be in valid format (e.g., user@gmail.com)

     * Password & password confirmation

### Login flow

#### **Screenshots:**

| Login – Step 1 (Email Input)               | Login – Step 2 (Password Input)            |
|--------------------------------------------|--------------------------------------------|
| ![Login Step 1](screenshots/login-email.png) | ![Login Step 2](screenshots/login-password.png) |

| Sign Up                                    |
|--------------------------------------------|
| ![Register](screenshots/register.png)      |

---


## Technologies

| Layer        | Stack                      |
|--------------|----------------------------|
| Frontend     | React + Bootstrap          |
| Backend      | Node.js + Express          |
| Spam Filter  | C++ server                 |
| Communication| REST API + TCP             |
| Auth         | JSON Web Tokens (JWT)      |
| DevOps       | Docker + Docker Compose    |

---


## Run with Docker

# Step 1: Clone the repo

# Step 2: Start all services
```bash
docker-compose up --build
```

# (Optional) If you encounter issues with leftover containers, run:
```bash
docker-compose down --remove-orphans
```

# React client:     http://localhost:3001
# Node.js server:   http://localhost:3000
# C++ spam server:  TCP on port 3800

Sample Users
Email: demo1@example.com / Password: 123456
Email: demo2@example.com / Password: 123456









