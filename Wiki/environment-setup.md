# Environment Setup – Running MailSnap

This guide explains how to run the entire MailSnap system, including:

- Backend server (Node.js)
- Web client (React)
- Spam filter (C++ TCP server)
- Android mobile app

> The system is fully dockerized. All services are orchestrated via Docker Compose.

---

## 1. Running the Backend

### Prerequisites
- Ports `3000`, `3001`, and `3800` must be available

### Start all services:
In the root project folder, run:

```bash
docker-compose up --build
```
## 2. Running the React App
This will launch the React app at http://localhost:3001

### Available Services & Endpoints

| Service           | Address                        |
|-------------------|--------------------------------|
| React Client      | http://localhost:3001          |
| Node.js Server    | http://localhost:3000          |
| C++ Spam Server   | TCP on port 3800               |

## 3. Running the Android App

## Step 1: Open Android Studio (and make sure the server is running as described above).
- Open the android_app folder in Android Studio
- Let Gradle sync finish

## Step 2: Launch an emulator 
- Use AVD Manager to start an emulator

## Step 3: Run the app
- Click the green Run button

The MailSnap app will launch on the emulator or device, and connect to the backend and spam filter.


