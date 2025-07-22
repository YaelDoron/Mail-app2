# Web Client Guide – MailSnap React App

> **Important:** Before using the Web client, make sure you have followed the instructions in [environment-setup.md](environment-setup.md) and started all backend services with Docker Compose.

MailSnap is a full-featured Gmail-like email client built in React. It includes a modern UI, secure authentication, labels, spam filtering, and more.

---

## User Interface Overview

| Inbox                             | Mail View                          | Compose                             |
|----------------------------------|------------------------------------|-------------------------------------|
| ![Inbox](https://github.com/user-attachments/assets/5c2e7fe6-9cbb-4814-b3eb-62fcaea45ab2) | ![Mail View](https://github.com/user-attachments/assets/a5125a47-9f2e-4057-880a-5473a80316cf) | ![Compose](https://github.com/user-attachments/assets/931b261f-c226-4907-9885-9cf96e608c89) |

---

## Authentication Flow

MailSnap uses JWT-based authentication to ensure secure access.

### Sign-Up Form

- Required fields:
  - First name & Last name
  - Birth date
  - Gender
  - Email (must be `@mailsnap.com`)
  - Password + Confirmation
- Optional: profile image upload

Example:
![Register](https://github.com/user-attachments/assets/84a2c4dc-6dfc-44d1-8950-302c60d5a3c1)

---

### Login Flow

| Step 1: Enter Email                        | Step 2: Enter Password                    |
|-------------------------------------------|-------------------------------------------|
| ![Login Step 1](https://github.com/user-attachments/assets/6725c1f8-b681-430d-90bd-95bdd1da440a) | ![Login Step 2](https://github.com/user-attachments/assets/8c3528ad-2ace-4fc2-ab37-963a5027348d) |

Once logged in, you will be redirected to your inbox and can begin using all email features.

### Logout

To log out of the system:

1. Click on your profile image at the top-right corner.
2. In the dropdown menu, click **"Sign out"**.

> This action removes the JWT from localStorage and redirects you to the login screen.

<p align="center">
  <img src="assets/logout-web-small.png" width="400" alt="Logout menu screenshot"/>
</p>

---

## Email Actions – Compose / Edit / Delete

### Compose and Send

1. Click **"Compose"**
2. Fill in:
   - Recipient (must be another MailSnap user)
   - Subject
   - Email content
3. Click **Send**

If you close the window instead of sending → the email is saved as a **draft**.

---

### Edit a Draft

1. Go to the **Drafts** section
2. Click on the draft you want to continue
3. Modify the content and send it when ready

---

### Delete Email

1. Select one or more emails (using checkboxes)
2. Click the **Trash icon** in the action bar
3. The email moves to the **Trash** folder  
   - It can be **restored** later  
   - It will be **permanently deleted after 30 days**

---

## Labels Managemant

- You can **create**, **assign**, **edit**, and **remove labels** to organize your emails.
- To assign a label:
  1. Select emails
  2. Click the **Label icon**
  3. Choose or create a new label

  You can edit an existing label by clicking the three-dot menu next to it and selecting "Edit".

| Before Editing                            | Edit Dialog                              | After Editing                            |
|-------------------------------------------|-------------------------------------------|-------------------------------------------|
| ![Before](assets/label-after-web.png)     | ![Edit Dialog](assets/label-editing-web.png) | ![After](assets/label-before-web.png)       |

> Once saved, the label will update immediately in the sidebar and all associated emails will reflect the new label name.

---

## Dark Mode

Switch between light/dark mode using the toggle in the top-right corner.

| Light Mode                                 | Dark Mode                                 |
|--------------------------------------------|--------------------------------------------|
| ![Light](https://github.com/user-attachments/assets/f67b7147-d078-4acc-8b81-0438aede0e57) | ![Dark](https://github.com/user-attachments/assets/3421d931-24dd-48d8-9fd7-0392e4e13c8e) |

---

## Search Mails

- Use the search bar to filter emails by:
  - Subject
  - Content

---

## Additional Features

- Star / Unstar emails
- Mark as read / unread
- Restore from trash
- Spam detection via C++ Bloom Filter server:
  - When an email is marked as spam, all future emails containing the same links (URLs) will also be flagged automatically

---

### Sample Users

| Email                   | Password  |
|------------------------ |-----------|
| demo1@mailsnap.com      | 12345678  |
| demo2@mailsnap.com      | ms37d19A  |


### Working with Multiple Users

To test the app with two users at the same time, open it in a regular browser window for one user, and in an Incognito (private) window for the second user.