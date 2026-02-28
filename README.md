# Momentum - A Progress Tracker for Developers

## Problem Statement

As an aspiring software engineer preparing for interviews, I struggle with managing time and maintaining consistency across different areas such as DSA practice, development work, and job applications.

There is no single system where I can log my effort and visually track progress over time.

This project aims to solve that by providing a unified system to log and track structured work sessions.

---

## Target User

Students and developers preparing for technical interviews who want visible proof of effort and structured progress tracking.

---

## Core Concept

### Atomic Unit: WorkSession

The `WorkSession` is the core atomic unit of the system.

Each WorkSession represents one focused effort and unifies different types of preparation under a single model:

- DSA practice
- Development work
- Job applications
- Future trackable tasks

### WorkSession Fields (v1)

- `type` (DSA | Dev | Application | etc.)
- `duration`
- `status`
- `link` (optional reference)
- `createdAt` (auto-generated)

This abstraction keeps the system simple and extensible.

---

## Core Loop

1. User opens the app and sees a list of logged WorkSessions.
2. User clicks "Add Session".
3. User fills in session details.
4. Session is stored and displayed as a row in the table.
5. Over time, sessions accumulate and provide visible proof of effort.

Log → Store → Display → Repeat
