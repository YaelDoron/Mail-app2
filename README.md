# MailSnap – Gmail-like Mail Application         ex3 is in branch: Exercise-3
MailSnap is a full-featured email web application inspired by Gmail. It offers a modern, responsive UI, custom labels, spam detection, dark mode, and secure authentication – all built using a full-stack architecture and microservices.

![MailSnap Inbox](screenshots/inbox.png)
![MailSnap Mail View](screenshots/mailview.png)

---

## Features

- User registration with image upload  
- JWT-based authentication  
- Compose, send, receive, and draft emails  
- Custom labels (create, assign, remove)  
- Spam detection via C++ Bloom Filter server  
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

First name & last name

Birth date (min. year 1905, max. age under 13 not allowed)

Gender

Email (valid format)

Password & password confirmation



- **Sign Up Screen:**  
  ![Register](screenshots/register.png)

- **Login Screen:**  
  ![Login](screenshots/login.png)

---


## Technologies

| Layer        | Stack                      |
|--------------|----------------------------|
| Frontend     | React + Bootstrap          |
| Backend      | Node.js + Express + MongoDB |
| Spam Filter  | C++ server with Bloom Filter |
| Communication | REST API + TCP             |
| Auth         | JSON Web Tokens (JWT)      |
| DevOps       | Docker + Docker Compose    |

---


## Run with Docker

```bash
# Step 1: Clone the repo
git clone https://github.com/yourusername/MailSnap.git
cd MailSnap

# Step 2: Start all services
docker-compose up --build

# React client:     http://localhost:3001
# Node.js server:   http://localhost:3000
# C++ spam server:  TCP on port 3800

Sample Users
Email: demo1@example.com / Password: 123456
Email: demo2@example.com / Password: 123456









