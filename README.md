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
    <td><img src="https://github.com/user-attachments/assets/5c2e7fe6-9cbb-4814-b3eb-62fcaea45ab2" width="250"/></td>
    <td><img src="https://github.com/user-attachments/assets/a5125a47-9f2e-4057-880a-5473a80316cf" width="250"/></td>
    <td><img src="https://github.com/user-attachments/assets/931b261f-c226-4907-9885-9cf96e608c89" width="250"/></td>
  </tr>
</table>

---

## Features

- User registration with image upload  
- JWT-based authentication  
- Compose, send, receive, and draft emails
- Drafts: if a user closes the compose window, the email is saved as a draft and can be edited/sent later
- Mark emails as read (read emails shown with a light gray background)
- Search through emails by subject or content
- Star/unstar emails  
- Custom labels (create, assign, remove)  
- Spam detection via C++ Bloom Filter server:
  - When an email is marked as spam, all future emails containing the same links (URLs) will also be flagged automatically  
- Trash and restore functionality  
  - Emails moved to Trash will be automatically deleted after 30 days  
- Dark/Light mode toggle  
- Responsive UI using React

---


## Authentication Flow

Users can sign up and log in securely using JWTs. Registration includes uploading a profile image, and only verified users can access the inbox and email features.

### Sign Up Form Requirements:
- All fields are required, except for the image upload, which is optional.

- Users must be at least 13 years old to register.

- The form includes validation for:

     * First name & last name

     * Birth date

     * Gender

     * Email must be in the format: username@mailspam.com

     * Password & password confirmation

> **Note:** Only users with an email ending in @mailspam.com can be created, send, or receive emails in the system.

### Login flow


| Sign Up                                    |
|--------------------------------------------|
| ![Register](https://github.com/user-attachments/assets/84a2c4dc-6dfc-44d1-8950-302c60d5a3c1)      |

| Login – Step 1 (Email Input)               | Login – Step 2 (Password Input)            |
|--------------------------------------------|--------------------------------------------|
| ![Login Step 1](https://github.com/user-attachments/assets/6725c1f8-b681-430d-90bd-95bdd1da440a) | ![Login Step 2](https://github.com/user-attachments/assets/8c3528ad-2ace-4fc2-ab37-963a5027348d) |

---


### Dark Mode Support

MailSnap includes a Dark/Light mode toggle, conveniently located at the top right corner. Switch between themes instantly for comfortable viewing.

|   Light Mode |   Dark Mode |
|--------------|-------------|
| ![Light Mode](https://github.com/user-attachments/assets/f67b7147-d078-4acc-8b81-0438aede0e57) | ![Dark Mode](https://github.com/user-attachments/assets/3421d931-24dd-48d8-9fd7-0392e4e13c8e) |

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

| Email                   | Password  |
|------------------------ |-----------|
| demo1@mailspam.com      | 12345678  |
| demo2@mailspam.com      | 12345678  |


### Working with Multiple Users

To test the app with two users at the same time, open it in a regular browser window for one user, and in an Incognito (private) window for the second user.

### Meeting Documentation

You can find the full meeting documentation here:  
[MailSnap – Team Meeting Notes](https://docs.google.com/document/d/1BDuAVKaDWLGJCRLLpi7os2Mg3411-seBCfxYCQfKHOo/edit?usp=sharing)











