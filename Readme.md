# AlgoWatch

A full-stack web application for tracking Codeforces activity, sending inactivity reminders, and managing student programming profiles with a modern React frontend and Node.js/Express backend.
- **Demo Video:** [Click](https://youtu.be/I0Hzwp26ERc)


## Project Overview

AlgoWatch enables educators and mentors to monitor student progress on Codeforces by:

- Periodically syncing Codeforces data for all students via a scheduled cron job
- Detecting inactivity (no accepted submissions in 7 days) and sending automatic reminder emails
- Allowing admins to view, add, edit, and delete student profiles
- Providing a dashboard and individual profile pages with all relevant Codeforces statistics, reminders sent, and controls for reminder emails

## Setup Instructions

### 1. Backend

**Requirements:** Node.js, npm, MongoDB

**Steps:**

1. Clone the repository:
```bash
git clone https://github.com/KaranOps/AlgoWatch
cd AlgoWatch/server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `server` directory with the following:
```env
MONGO_URI=your_mongodb_connection_string
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your16charapppassword
CRON_SCHEDULE=0 2 * * * # (optional, default: 2AM daily)
```

   - For Gmail, use an [App Password](https://support.google.com/accounts/answer/185833?hl=en)

4. Start the backend server:
```bash
npm start
```

The server will run on `http://localhost:5000` by default.

### 2. Frontend

**Requirements:** Node.js, npm

**Steps:**

1. In a new terminal, navigate to the frontend directory:
```bash
cd ../client
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `client` directory:
```env
VITE_API_URL=http://localhost:5000
```

4. Start the frontend development server:
```bash
npm run dev
```

The app will run on `http://localhost:5173` by default.

### 3. Environment Variables

| Variable        | Purpose                               | Example Value                        |
|-----------------|---------------------------------------|--------------------------------------|
| MONGO_URI       | MongoDB connection string             | mongodb+srv://user:pass@cluster/...  |
| EMAIL_USER      | Email address for sending reminders   | your_email@gmail.com                 |
| EMAIL_PASS      | 16-char Gmail App Password (no spaces)| abcdefghijklmnop                     |
| CRON_SCHEDULE   | Cron expression for sync job          | 0 2 * * *                            |
| VITE_API_URL    | Backend API URL (frontend only)       | http://localhost:5000                |
| CODEFORCES_API  | Codeforces API URl                    | https://codeforces.com/api/user      |

## Features

### 1. Student Management

- **Add/Edit/Delete Students:** Use the dashboard to manage student records. Each student must have a Codeforces handle, email, and name
- **Profile View:** Click on a student to view their profile, which displays all stored Codeforces data, reminder count, and email toggle

### 2. Cron Job (Codeforces Data Sync)

- The cron job runs automatically at the schedule set in `CRON_SCHEDULE` (default: 2AM daily)
- To change the schedule, use the "Change Cron Schedule" panel in the dashboard: enter a new cron string (e.g., `* * * * *` for every minute during testing) and submit

### 3. Inactivity Detection & Reminder Emails

- After each data sync, the system checks for students with no accepted submissions in the last 7 days
- If `autoEmailEnabled` is true, a reminder email is sent and the `reminderCount` is incremented
- Email sending requires correct Gmail App Password setup

### 4. Reminder Count and Email Toggle

- **Profile Page:** Shows the total number of reminders sent (`reminderCount`)
- **Enable/Disable Automatic Emails:** Use the toggle on the profile page to enable or disable reminders for a student. Changes are saved instantly

## API Reference

| Endpoint                              | Method | Description                                      |
|---------------------------------------|--------|--------------------------------------------------|
| `/api/students`                       | GET    | List all students (basic info)                   |
| `/api/students/:id`                   | GET    | Get full student profile (with Codeforces data)  |
| `/api/students`                       | POST   | Add a new student                                |
| `/api/students/:id`                   | PUT    | Edit student info                                |
| `/api/students/:id`                   | DELETE | Delete student                                   |
| `/api/students/:id/email-toggle`      | PATCH  | Enable/disable reminder emails for a student     |
| `/api/cron/update-cron`               | POST   | Change cron schedule                             |

All endpoints require JSON bodies and return JSON responses.

## User Interface

- **Dashboard:** Lists all students with basic info, links to profiles, and a panel to change cron schedule
![Dashboard](./client/public/dashboard.png)
- **Student Profile:** Shows detailed Codeforces stats, reminder count, and toggle for automatic emails
![Student Profile](./client/public/profile1.png)
![Student Profile](./client/public/profile2.png)
![Student Profile](./client/public/profile3.png)
![Student Profile](./client/public/profile4.png)
- **Form:** For adding/editing students and updating cron schedule
![Form](./client/public/form.png)
- **Responsive Design:** Works on desktop and mobile screens

---

Made with ❤️ .




