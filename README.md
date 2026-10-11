# NSTI Cakes

A full stack cake ordering platform built for Nairobi South Training Institute Bakery, with customer ordering, an admin dashboard, and M-Pesa payment integration.


---

## Features

- Customer signup/login (JWT authentication)
- Browse cakes by category (Wedding, Baby Shower, Graduation, Chocolate, Birthday)
- Cart and checkout flow
- M-Pesa STK Push payment (Safaricom Daraja API sandbox)
- Admin dashboard: revenue stats, top selling cakes, recent orders
- Admin management: orders, products, customers, payments, settings
- Notification preferences and password management

---

## Tech Stack

**Frontend**
- React (Vite)
- Tailwind CSS
- React Router
- Recharts (dashboard charts)
- Axios

**Backend**
- FastAPI
- SQLAlchemy + Alembic (migrations)
- SQLite (development database)
- JWT authentication (python-jose)
- Passlib/bcrypt (password hashing)
- Safaricom Daraja API (M-Pesa STK Push)


---

## Project Structure

```
nsti-cakes-fullstack/
├── client/
│   └── react-app/          # React frontend
│       └── src/
│           ├── pages/       # Customer + admin pages
│           ├── components/  # Shared UI components
│           ├── context/     # Auth and cart state
│           └── data/        # Static reference data
└── server/                  # FastAPI backend
    ├── main.py               # App entrypoint, router registration
    ├── models.py             # SQLAlchemy models
    ├── schemas.py             # Pydantic schemas
    ├── database.py           # DB connection/session setup
    ├── oauth2.py              # Current-user auth dependency
    ├── JWT_token.py           # Token creation/verification
    ├── mpesa.py                # Daraja API integration
    ├── alembic/               # Database migrations
    └── routers/
        ├── authentication.py
        ├── user.py
        ├── products.py
        ├── orders.py
        ├── payments.py
        ├── admin.py
        └── mpesa.py
```

---

## Local Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- npm

### Backend

```bash
cd server
python -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in `server/`:

```env
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

MPESA_CONSUMER_KEY=your-daraja-consumer-key
MPESA_CONSUMER_SECRET=your-daraja-consumer-secret
MPESA_SHORTCODE=174379
MPESA_PASSKEY=your-daraja-passkey
MPESA_CALLBACK_URL=https://your-ngrok-url.ngrok-free.app/mpesa/callback
```

Run migrations and start the server:

```bash
alembic upgrade head
uvicorn main:app --reload
```

Backend runs at `http://127.0.0.1:8000`. Interactive API docs at `http://127.0.0.1:8000/docs`.

### Frontend

```bash
cd client/react-app
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

### M-Pesa Sandbox Testing

STK Push callbacks require a publicly reachable URL. For local testing:

```bash
ngrok http 8000
```

Update `MPESA_CALLBACK_URL` in `.env` with the ngrok forwarding URL, then restart the backend. Note that free ngrok URLs change on every restart.

---

---
## Author

Isaac Tobiko
GitHub: [github.com/IsaacTobiko](https://github.com/IsaacTobiko)
