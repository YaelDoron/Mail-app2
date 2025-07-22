# MailSnap – Gmail-like Email Application 

MailSnap is a modern, full-stack email application inspired by Gmail. It offers a sleek and responsive UI, spam detection, custom labels, support for drafts and dark mode, and secure authentication – all implemented through a microservices architecture.

---

## Project Overview

MailSnap consists of three core components:

| Component       | Description                                                  |
|-----------------|--------------------------------------------------------------|
|  Web Client     | A React-based interface for composing, reading, and managing emails. |
|  Android Client | A native Android application built with MVVM architecture.  |
|  Backend Server | Node.js + Express server providing a REST API with MongoDB. |
|  Spam Filter    | A C++ server that uses a Bloom Filter over TCP to detect spam links. |

All services communicate through REST APIs and TCP, and are containerized using Docker.

---

## Main Features

- User registration with JWT and image upload
- Compose, send, and receive emails
- Drafts are saved automatically if Compose is closed before sending
- Move emails to Trash and restore them
- Spam detection using Bloom Filter (see below)
- Create/edit/delete custom labels and assign them to emails
- Search by subject or content
- Star/unstar emails
- Fully responsive UI for both web and Android
- Dark mode support (manual toggle on web, system-based on Android)

---

## Spam Detection – Bloom Filter C++ Server

MailSnap uses a dedicated **C++ spam filter server** over TCP. When a user reports an email as spam, all **URLs inside that email** are extracted and added to a Bloom Filter. Any future incoming email that contains those same URLs will be **automatically flagged as spam**.

Communication with the spam filter server is done via custom TCP commands (`POST`, `GET`, `DELETE`) between the Node.js backend and the C++ service.

---

## Documentation

To keep things modular, full documentation is separated into three detailed guides:

| Guide                     | Description |
|---------------------------|-------------|
| [Environment Setup](Wiki/environment-setup.md) | How to clone, run, and connect all services with Docker. Required for local deployment. |
| [Web Client Guide](Wiki/web-client-guide.md) | Full walkthrough of how to use the **React** interface: login, draft, spam, labels, dark mode. |
| [Android Client Guide](Wiki/android-client-guide.md) | Full usage guide of the **Android app** (built with MVVM + Room + Retrofit). |

---

## Technologies Used

| Layer        | Stack                        |
|--------------|------------------------------|
| Frontend     | React + Bootstrap            |
| Android      | Java                         |
| Backend      | Node.js + Express + MongoDB  |
| Spam Filter  | C++ Bloom Filter Server      |
| Communication| REST API + TCP               |
| Auth         | JSON Web Tokens (JWT)        |
| DevOps       | Docker + Docker Compose      |

---

