# Momentum — A Progress Tracker for Developers

Momentum is a structured progress tracking system designed for aspiring software engineers preparing for technical interviews.

It provides a unified way to log effort across DSA practice, development work, and job applications — turning daily work into visible, trackable proof of consistency.

---

## Problem Statement

As an aspiring software engineer preparing for interviews, managing time and maintaining consistency across multiple preparation areas is difficult.

There is no single system where effort can be logged and progress visually tracked over time.

Momentum solves this by providing a structured system to log focused work sessions and accumulate measurable progress.

---

## Target User

- Students preparing for technical interviews
    
- Self-taught developers building consistency
    
- Job seekers tracking applications and preparation
    
- Anyone who wants visible proof of structured effort
    

---

# Core Architecture

## Atomic Unit: WorkSession

The system is built around one core abstraction:

### `WorkSession`

A `WorkSession` represents one focused block of effort.

It unifies different preparation activities under a single, extensible model:

- DSA practice
    
- Development work
    
- Job applications
    
- Future trackable tasks
    

This abstraction keeps the system simple while remaining flexible for future expansion.

---

## WorkSession Schema (v1)

Each WorkSession contains:

- `type` → dropdown (DSA | Dev | Application | etc.)
    
- `status` → dropdown
    
- `task` → text
    
- `duration` → number (stored in minutes)
    
- `notes` → optional text
    
- `link` → optional reference URL
    
- `timestamp` → automatically generated
    

### Design Decision

- Duration is stored in **minutes** in the database.
    
- Conversion to hours (if needed) happens only in the UI.
    

This keeps the backend consistent and calculation-friendly.

---

# MVP Specification

## MVP Goals

The first version of Momentum will allow users to:

- Register and login
    
- Add sessions
    
- View sessions in a structured table
    

The goal of the MVP is to validate the core interaction loop before adding advanced features.

No analytics.  
No charts.  
No gamification.  
Just structured logging.

---

# Core Screens

The initial version includes four primary screens:

1. Signup / Register
    
2. Login
    
3. Add Session (Modal)
    
4. Dashboard (Session Table View)
    

Each screen directly supports the WorkSession lifecycle.

---

# Routing Structure

```
/login
/register
/dashboard
```

The dashboard acts as the main application hub and contains:

- A table displaying all WorkSessions
    
- An "Add Session" interaction
    

---

# Core Interaction Loop (System Flow)

1. User registers or logs in.
    
2. User lands on the dashboard.
    
3. The dashboard displays logged WorkSessions.
    
4. User clicks "Add Session".
    
5. A form appears for session details.
    
6. On submission, the session is stored.
    
7. The new session appears in the table.
    
8. Over time, sessions accumulate and provide visible proof of effort.
    

Core loop summary:

**Log → Store → Display → Repeat**

This loop reinforces behavioral consistency through visibility.

---

# Tech Stack

## Frontend

- React (Vite)
    
- React Router
    

## Backend

- Node.js
    
- Express
    

## Database

- MongoDB
    

This stack was chosen for:

- Simplicity
    
- Modern development workflow
    
- Scalability for future features

----

## System Architecture

Frontend (React) communicates with the backend (Node + Express) via REST APIs.

The backend handles authentication and WorkSession storage in MongoDB.

React Router manages client-side navigation between authentication and dashboard views.

---

# Design Philosophy

Momentum is intentionally minimal.

The focus is not feature density — it is behavioral reinforcement.

The system is designed to:

- Encourage daily consistency
    
- Reduce friction in logging effort
    
- Provide visible proof of work
    
- Remain extensible for future iterations
    
Momentum is not just a tracker.

It is a system for turning effort into visible progress.
