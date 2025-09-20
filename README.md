# Contact Book

A full-stack **Contact Book** web application to manage your contacts with a modern **React** frontend (Vite) and **Express/Node.js** backend using **MongoDB Atlas** as the database.

---

## Features

- Add, list, and delete contacts
- Email and phone number validation
- Responsive and clean user interface
- Data persisted to cloud MongoDB (Atlas)

---

## Tech Stack

- **Frontend:** React + Vite  
- **Backend:** Node.js + Express  
- **Database:** MongoDB Atlas (Cloud)

---

## Folder Structure

Contact Book/
├── contact-book-backend/
│ └── ... (Express + MongoDB code)
├── contact-book-frontend/
│ └── ... (React + Vite code)

yaml
Copy code

---

## Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/venkataraju0707/contacts-book.git
cd contact-book
2. Run Backend
bash
Copy code
cd contact-book-backend
npm install
node index.js
The backend server will start at http://localhost:5000.

3. Run Frontend
Open a new terminal and run:

bash
Copy code
cd contact-book-frontend
npm install
npm run dev
The frontend will start at http://localhost:5173.

Usage
Ensure the backend server is running at http://localhost:5000.

Open http://localhost:5173 in your browser.

Start adding, listing, and managing your contacts.
