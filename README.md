# Typeform Clone

A full-stack Typeform-inspired form builder and response collection application built with **Next.js, TypeScript, Tailwind CSS, FastAPI, SQLAlchemy, and SQLite**.

The application allows users to create forms, add and manage questions, publish forms through shareable links, collect responses, and view submitted responses.

---

## 🔗 Links

### Live Application
https://typefrom-clone-frontend-nine.vercel.app

### Backend API
https://typefrom-clone-backend-p3hh.onrender.com

### GitHub Repository
https://github.com/kripa2201/Typefrom_Clone

---

## ✨ Features

### Form Builder

- Create new forms
- Edit form title and description
- Add questions
- Edit questions
- Delete questions
- Reorder questions
- Mark questions as required
- Add question descriptions/help text
- Live form preview
- Support for multiple question types

### Supported Question Types

- Short Text
- Long Text
- Email
- Phone
- Number
- Multiple Choice
- Dropdown
- Yes / No
- Rating
- Checkbox
- Date
- Website
- NPS
- Opinion Scale
- Ranking
- Matrix
- Legal
- Picture Choice

### Form Management

- View created forms
- Create forms
- Rename/edit forms
- Duplicate forms
- Delete forms
- Publish forms
- Unpublish forms
- Generate public form links
- Track response counts

### Respondent Experience

- Public forms without authentication
- One-question-at-a-time form experience
- Required field validation
- Email validation
- Number validation
- Progress through questions
- Response submission
- Thank-you experience after submission

### Results

- View submitted responses
- View individual responses
- Store responses in the database
- Associate answers with individual questions and forms

### Authentication

- Clerk authentication
- Protected dashboard
- Public respondent forms

### AI Form Generation

The application includes an AI form-generation endpoint that converts a natural-language prompt into a structured form containing:

- Form title
- Form description
- Questions
- Question types
- Required status
- Question settings

---

## 🛠️ Tech Stack

### Frontend

- Next.js
- TypeScript
- Tailwind CSS
- React
- Clerk

### Backend

- Python
- FastAPI
- SQLAlchemy
- SQLite
- Pydantic

### AI

- Google Gemini API
- `google-genai`

### Deployment

- Vercel - Frontend
- Render - Backend

### Version Control

- Git
- GitHub

---

## 📁 Project Structure

```text
Typefrom_Clone/
│
├── frontend/
│   ├── app/
│   │   ├── builder/
│   │   │   └── [formId]/
│   │   ├── dashboard/
│   │   ├── forms/
│   │   │   └── [slug]/
│   │   └── ...
│   │
│   ├── components/
│   ├── lib/
│   │   └── api.ts
│   ├── public/
│   ├── proxy.ts
│   └── package.json
│
├── backend/
│   ├── ai/
│   │   └── generator.py
│   ├── crud.py
│   ├── database.py
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   ├── requirements.txt
│   └── ...
│
└── README.md