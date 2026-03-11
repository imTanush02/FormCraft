# 🚀 FormCraft — No-Code Form Builder

A professional-grade, full-stack form builder application built with the **MERN** stack (MongoDB, Express, React, Node.js). Create stunning forms with an intuitive drag-and-customize interface, collect responses, and analyze data — all without writing a single line of code.

---

## ✨ Features

- **No-Code Form Builder** — Add 9 field types (text, email, number, date, textarea, dropdown, checkboxes, radio, file upload)
- **Rich Customization** — Field labels, placeholders, help text, required toggles, width control (33/50/100%), text alignment
- **Conditional Logic** — Show/hide/require fields based on other field values with AND/OR chaining
- **Design Panel** — Background color, accent color, font family, border radius, spacing, max width
- **Form Settings** — Multiple submissions toggle, progress bar, custom submit button text, success message
- **Live Preview** — Real-time preview of your form as you build
- **Shareable Links** — Publish forms with a unique slug for public access
- **Response Viewer** — Searchable table of all submissions, submission timeline chart, field-level analytics
- **Export** — Download responses as CSV or JSON
- **Authentication** — JWT-based auth with secure password hashing
- **Animated UI** — Framer Motion animations throughout (stagger, spring, slide, fade)

---

## 🏗️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, Vite, Tailwind CSS, Framer Motion, React Router v6, Axios, Recharts, PapaParse |
| **Backend** | Node.js, Express.js, JWT, bcryptjs |
| **Database** | MongoDB with Mongoose ODM |
| **Icons** | Remix Icon |
| **Notifications** | React Hot Toast |

---

## 📁 Project Structure

```
FormCraft/
├── backend/
│   ├── models/          # Mongoose schemas (User, Form, Response)
│   ├── routes/          # Express routes (auth, forms, responses)
│   ├── middleware/       # JWT auth middleware
│   ├── server.js        # Express entry point
│   └── .env             # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/  # React components (Dashboard, FormBuilder, FormRenderer, Common)
│   │   ├── context/     # AuthContext, FormBuilderContext
│   │   ├── hooks/       # useAuth, useForm, useFormField, useConditionalLogic
│   │   ├── pages/       # Login, Register, Dashboard, FormBuilder, FormRenderer, ResponseViewer
│   │   └── utils/       # API client, validators, animation presets, field configs
│   └── index.html       # HTML entry
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+
- **MongoDB** (local or Atlas)

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd FormCraft
```

### 2. Backend Setup
```bash
cd backend
cp .env.example .env      # Update MONGO_URI and JWT_SECRET
npm install
npm run dev               # Starts on port 5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev               # Starts on port 5173
```

### 4. Open in Browser
Navigate to `http://localhost:5173` — register an account and start building forms!

---

## 🔐 Environment Variables

### Backend `.env`
```env
MONGO_URI=mongodb+srv://ts11145t_db_user:nci8xP8EGScX3auI@cluster0.rzapysd.mongodb.net/FormCraft
JWT_SECRET=your-secret-key-min-32-chars
PORT=5000
NODE_ENV=development
```

---

## 📡 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ✗ | Create account |
| POST | `/api/auth/login` | ✗ | Login |
| GET | `/api/auth/profile` | ✓ | Get current user |
| GET | `/api/forms` | ✓ | List user's forms |
| POST | `/api/forms` | ✓ | Create form |
| GET | `/api/forms/:id` | ✓ | Get form |
| PUT | `/api/forms/:id` | ✓ | Update form |
| DELETE | `/api/forms/:id` | ✓ | Delete form + responses |
| PATCH | `/api/forms/:id/publish` | ✓ | Toggle publish |
| POST | `/api/forms/:id/duplicate` | ✓ | Duplicate form |
| GET | `/api/forms/public/:slug` | ✗ | Get published form |
| POST | `/api/responses/:formId` | ✗ | Submit response |
| GET | `/api/responses/:formId` | ✓ | List responses |
| GET | `/api/responses/:formId/analytics` | ✓ | Get analytics |
| GET | `/api/responses/:formId/export` | ✓ | Export responses |

---

## 🎬 Workflow

1. **Register/Login** → Access dashboard
2. **Create Form** → Opens form builder
3. **Add Fields** → Text, email, dropdowns, etc.
4. **Customize Design** → Colors, fonts, spacing
5. **Set Conditions** → Show/hide fields logically
6. **Publish** → Share the public URL
7. **Collect Responses** → View in table or charts
8. **Export** → Download as CSV/JSON

---

## 📜 License

MIT License — free for educational and personal use.
