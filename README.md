ex3 is in branch: Exercise-3
# MailSnap – Gmail-like Mail Application
MailSnap is a full-featured email web application inspired by Gmail. It offers a modern, responsive UI, custom labels, spam detection, dark mode, and secure authentication – all built using a full-stack architecture and microservices.

<table>
  <tr>
    <td align="center"><strong>Inbox</strong></td>
    <td align="center"><strong>Mail View</strong></td>
    <td align="center"><strong>Compose</strong></td>
  </tr>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/633454d3-30c6-4a45-ba63-47a8ae54ff18" width="250"/></td>
    <td><img src="https://github.com/user-attachments/assets/870a2945-ea03-4a0d-b43a-cfab07594b19" width="250"/></td>
    <td><img src="https://github.com/user-attachments/assets/f68e8497-f788-40f9-a57f-32130bc31497" width="250"/></td>
  </tr>
</table>

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


| Sign Up                                    |
|--------------------------------------------|
| ![Register](https://github.com/user-attachments/assets/ac31b692-8b09-4cac-868e-a70c2dd76938)      |

| Login – Step 1 (Email Input)               | Login – Step 2 (Password Input)            |
|--------------------------------------------|--------------------------------------------|
| ![Login Step 1](https://github.com/user-attachments/assets/9c4b77b3-e0ef-48ad-b90e-b0e5c8dea39f) | ![Login Step 2](https://github.com/user-attachments/assets/377ec100-6e11-4bca-89aa-3545843c2bf4) |

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

Step 1: Clone the repo

Step 2: Start all services:
```bash
docker-compose up --build
```
Step 3: Open the app in your browser:
```bash
http://localhost:3001
```

Optional - If you encounter issues with leftover containers, run:
```bash
docker-compose down --remove-orphans
```

### Available Services & Endpoints

| Service           | Address                        |
|-------------------|--------------------------------|
| React Client      | http://localhost:3001          |
| Node.js Server    | http://localhost:3000          |
| C++ Spam Server   | TCP on port 3800               |


### Sample Users

| Email                  | Password  |
|------------------------|-----------|
| demo1@example.com      | 12345678  |
| demo2@example.com      | 12345678  |

> **Note:** In the screenshots, we used gmail.com addresses as examples,   
> but any valid email provider (e.g., Outlook, Yahoo, etc.) would work just as well.











