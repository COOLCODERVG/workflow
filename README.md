
# ⚙️ Workflow – Internal Productivity Dashboard for Teams

---

⚠️ This is a team project and here are my contributions to **Workflow**:

- 🔧 **Backend Development & API Integration**  
  I developed core Django backend logic including models, serializers, and API views for tasks, users, departments, and progress reporting.

- 🎨 **Frontend UI & Styling**  
  I built several pages in React and styled them using TailwindCSS—including the login page, dashboard, and task views.

- 🐞 **Debugging & Testing**  
  I debugged issues related to CORS, authentication, and state syncing between the frontend and backend.

- 📄 **README Documentation**  
  I authored this README to ensure setup clarity, proper file structure documentation, and local + production setup guidance.

- 🚀 **Deployment Setup**  
  I contributed to Vercel and Railway deployment, configured the project for smooth frontend-backend integration, and verified everything was working live.

---

**Workflow** is a full-stack team productivity dashboard for managing internal tasks, team progress, and departmental collaboration. It includes:

- ✅ **Task Assignment System**  
- 📈 **Progress Reports Linked to Tasks**  
- 🧑‍💼 **Departmental Admin Controls**  
- 🔐 **Authentication with Custom User Model**  
- 🎨 **Clean, Responsive Interface (React + Tailwind)**

---

## 🚀 Features

| Feature               | Description                                                                      |
|-----------------------|----------------------------------------------------------------------------------|
| ✅ Task Management     | Create, assign, and update tasks across teams and users                         |
| 📈 Progress Reporting  | Users can submit progress updates with notes and timestamps                     |
| 🔐 User Auth & Roles   | Signup/login and department/group-based permissions                             |
| 👥 Department Views    | Filter views by department or user                                              |
| 🎨 Responsive Frontend | Built with modular React components and styled with TailwindCSS                 |
| ⚙️ REST API Backend     | Secure Django REST Framework backend with serializers and viewsets             |

---

## 🛠️ Tech Stack

- **Frontend:** React, TailwindCSS, Axios, Vite  
- **Backend:** Django, Django REST Framework, SQLite  
- **Auth:** Django Allauth + DRF Token Authentication  
- **Hosting:** Vercel (frontend), Railway (backend)  
- **Database:** SQLite (local) or PostgreSQL (production-ready)

---

## 🧩 Project Structure

```
workflow/
├── backend/                # Django project
│   ├── backend/           # Django settings and URL config
│   │   ├── settings.py
│   │   └── urls.py
│   ├── api/               # Task, Department, and Report logic (models, views, serializers)
│   ├── users/             # Custom user model, groups, permissions
│   ├── manage.py
│   └── requirements.txt
├── frontend/              # React frontend
│   ├── public/
│   └── src/
│       ├── components/    # UI components
│       ├── pages/         # Login, Dashboard, Report, etc.
│       ├── App.jsx
│       └── main.jsx
├── README.md
└── .gitignore
```

---

## 📦 Getting Started

```bash
git clone https://github.com/COOLCODERVG/workflow.git
cd workflow
```

---

## 🔐 Environment Variables

### Frontend (`/frontend/`)

```
VITE_API_URL=http://127.0.0.1:8000
```

> Be sure to restart `npm run dev` after editing your `.env` file.

---

## ⚙️ Setup Guide

### 1. Backend (Django)

```bash
cd backend
python3 -m venv env
source env/bin/activate        # Windows: env\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Backend runs at: `http://127.0.0.1:8000`

> Ensure `CORS_ALLOWED_ORIGINS` in `settings.py` includes `http://localhost:5173`

---

### 2. Frontend (React)

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 🧪 How to Test the Platform

| What to Test           | How to Test                                                                 |
|------------------------|------------------------------------------------------------------------------|
| 🔐 Login/Register       | Test email/username signup, login, logout                                   |
| 📋 Task Management      | Create/update tasks and assign them to different users                      |
| 📈 Progress Submission  | Users can submit reports for their tasks                                    |
| 🧑‍💼 Admin View          | View team-wide reports and department activity                              |

---

## 🌐 Live Deployment

- **Frontend**: [https://workflow-coolcodervg.vercel.app](https://workflow-coolcodervg.vercel.app)  
- **Backend API**: [https://workflow-backend.up.railway.app](https://workflow-backend.up.railway.app)

---

## 📦 Sample `.gitignore`

```gitignore
.env
*.pyc
__pycache__/
env/
frontend/node_modules/
frontend/.env
```

---

## 🧠 Future Features

- 📅 Calendar-based task scheduling  
- 🔔 Email/notification alerts on assignment  
- 📊 Analytics dashboard  
- 🧠 AI report summarization  
- 🧑‍🏫 Group-level admin roles

---

## 🙋 FAQ

**Q: Why is my frontend not connecting to the backend?**  
A: Confirm CORS is set in Django to allow `http://localhost:5173`.

---

**Q: Can I deploy this for free?**  
A: Yes. Use Vercel for frontend and Railway or Render for backend.

---

## 👨‍💻 Made by Varshith Gude (COOLCODERVG)

📧 [varshithgude.cs@gmail.com](mailto:varshithgude.cs@gmail.com)  
🌐 [GitHub Profile](https://github.com/COOLCODERVG)
