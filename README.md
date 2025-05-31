# Mail App

## Overview
**Mail App** is a web-based email system. It enables users to register, send and receive emails, manage labels (tags), and automatically filter harmful links using a smart blacklist system powered by a C++ backend.

This project combines:
- A **RESTful Node.js/Express server** – responsible for user management, mail logic, labels, and blacklist handling.
- A low-level **C++ server** that efficiently stores and checks URLs using a Bloom Filter via a socket interface.

## Features

### Email Functionality
- Send mails to one or multiple recipients
- Receive mails (per user inbox)
- Edit mails (by the sender)
- Delete mails 
- Search through your mails by subject or content

### Label Management
- Create, update, delete, and view custom labels
- Labels are user-specific and used to categorize mails

### User System
- Register new users with profile info (name, gender, birthdate, profile picture(optional))
- Retrieve user profiles by ID  
- Login using email and password (returns user ID as token)
- All other operations require sending the user ID in a header
(*Note: full login/session support is planned but not required in this version*)

### Smart Blacklist Filtering
- When sending a mail, any embedded URL is automatically checked using the C++ server
- If a blacklisted link is detected – the mail is rejected
- URLs can be added or removed from the blacklist using the REST API endpoints

## Authentication (Tokens)

The app uses a basic token-based login system to simulate authentication.  
Once a user is registered, they can log in using their email and password to retrieve their user ID:

### Login endpoint:
```http
POST /api/tokens
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "123456"
}
```

### Response:
```json
{ "id": 1234 }
```

This ID must be included in all subsequent requests using the `user-id` header:

```http
user-id: 1234
```

This acts as a temporary token for identifying users until a real authentication system is implemented in a future assignment.


## How to Build and Run
First, build the Docker image by executing:

```bash
docker-compose build --no-cache
```

Then, use this command to run the C++ server:

```bash
docker-compose run server <port> <filterSize> <seed1> <seed2> ...
```
Arguments:
- port: Port number the server will listen on
- filterSize: Number of bits in the Bloom Filter
- seed1> <seed2> ... : One or more seed values for the hash functions

Use this command to Start the web server (in a second terminal):

```bash
docker-compose up client
```
> The REST API will be available at `http://localhost:3000`

## Running the program - Example API Usage

Here are some examples to help you test the REST API using `curl`.
> Remember to include the `user-id` header for all mail and label operations.
Run the commands in a third terminal.

### Register a user
```bash
curl -i -X POST http://localhost:3000/api/users -H "Content-Type: application/json" -d "{\"firstName\":\"Alice\",\"lastName\":\"Cohen\",\"birthDate\":\"2000-01-01\",\"gender\":\"female\",\"email\":\"user@example.com\",\"password\":\"123456\"}"
```

### Get user by ID
```bash
curl -i http://localhost:3000/api/users/0
```

### Log in and get user token (user ID)
```bash
curl -i -X POST http://localhost:3000/api/tokens -H "Content-Type: application/json" -d "{\"email\":\"user@example.com\",\"password\":\"123456\"}"
```

### Send mail - one recipient
```bash
curl -i -X POST http://localhost:3000/api/mails -H "Content-Type: application/json" -H "user-id: 1234" -d "{\"to\":[\"5678\"],\"subject\":\"Hello\",\"content\":\"This is a test email\"}"
```

### Send mail - many recipients
```bash
curl -i -X POST http://localhost:3000/api/mails -H "Content-Type: application/json" -H "user-id: 1234" -d "{\"to\":[\"5678\",\"9999\",\"1111\"],\"subject\":\"Team Update\",\"content\":\"Reminder: meeting at 10AM\"}"
```

### Get user's mails
```bash
curl -i http://localhost:3000/api/mails -H "user-id: 1234"
```

### Search mails
```bash
curl -i http://localhost:3000/api/mails/search/Hello -H "user-id: 1234"
```

### Get mail by ID
```bash
curl -i http://localhost:3000/api/mails/5 -H "user-id: 1234"
```

### Delete mail
```bash
curl -i -X DELETE http://localhost:3000/api/mails/3 -H "user-id: 1234"
```

### Edit mail
```bash
curl -i -X PATCH http://localhost:3000/api/mails/1 -H "Content-Type: application/json" -H "user-id: 1234" -d "{\"subject\":\"Hello everyone\",\"content\":\"Meeting at 12AM\"}"
```

### Create a label
```bash
curl -i -X POST http://localhost:3000/api/labels -H "Content-Type: application/json" -H "user-id: 1234" -d "{\"name\":\"Work\"}"
```

### Get all labels
```bash
curl -i http://localhost:3000/api/labels -H "user-id: 1234"
```

### Get label by ID
```bash
curl -i http://localhost:3000/api/labels/1 -H "user-id: 1234"
```

### Update label
```bash
curl -i -X PATCH http://localhost:3000/api/labels/1 -H "Content-Type: application/json" -H "user-id: 1234" -d "{\"name\":\"Updated Label\"}"
```

### Delete label
```bash
curl -i -X DELETE http://localhost:3000/api/labels/1 -H "user-id: 1234"
```

### Add a URL to the blacklist
```bash
curl -i -X POST http://localhost:3000/api/blacklist -H "Content-Type: application/json" -d "{\"url\":\"http://bad-website.org\"}"
```

### Remove a URL from the blacklist
```bash
curl -i -X DELETE "http://localhost:3000/api/blacklist/http:%2F%2Fbad-website.org"
```

## Examples
![curl example1](https://github.com/user-attachments/assets/9716df8f-29b8-4183-b482-87370a69a676)
![curl example2](https://github.com/user-attachments/assets/7fc0cd39-a523-4b6d-8e98-301ca37010ea)
![curl example3](https://github.com/user-attachments/assets/dac9cd7f-9bef-4e6a-89dc-4b9d3137df56)
![curl example4](https://github.com/user-attachments/assets/b7a09b76-817a-498f-8fb8-00d0b43d926f)
![curl example5](https://github.com/user-attachments/assets/40224132-9121-462a-999f-df96df6e3f90)
![curl example6](https://github.com/user-attachments/assets/8327104e-9847-46ac-8abf-afb338c3fc22)
![curl example7](https://github.com/user-attachments/assets/d1ed4069-08aa-4254-b344-6ef85677b34c)
![curl example8](https://github.com/user-attachments/assets/b49342e0-4d18-4f4b-ab44-eca836f1feb8)



## 🔗 Related Docs
[Team Meeting Documentation](https://docs.google.com/document/d/13VuUzQ-KDu7Q3zzVhvA42WCy0XEnrzZqYtl7023NFDo/edit?tab=t.0)
