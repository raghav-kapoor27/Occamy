# 🌱 Occamy – Field Operations Tracking & Distribution Management System

A mobile-first internal operations platform designed to replace WhatsApp-based tracking for rural field operations with a **structured, auditable, and data-driven system**.

Built as a **working prototype** for the Haxplore hackathon challenge.

---

## 🚜 Problem Context

Occamy Bioscience operates across rural India through **field officers and distributors** who:

* Travel daily to villages
* Conduct farmer and group meetings
* Distribute product samples
* Capture sales and feedback

### ❌ Current Challenges (WhatsApp-based workflows)

* No verifiable travel data
* Fragmented activity tracking
* Unstructured photos and messages
* Poor historical visibility
* No centralized analytics

---

## ✅ Solution Overview

**Occamy Field Operations Tracker** is a role-based internal web platform that enables:

* Structured logging of field activities
* Verifiable tracking of travel, meetings, samples, and sales
* Centralized admin dashboard with insights and analytics
* A system designed for **low digital literacy** and **rural connectivity constraints**

> **Focus:** Operational clarity, accountability, and real-world deployability.

---

## 👥 User Roles (Mandatory)

### 🧑‍💼 Admin (Occamy Internal Team)

* Full access to dashboards and analytics
* Manage users and roles
* View activity across states, districts, and users
* Monitor:

  * Distance traveled
  * Meetings conducted
  * Samples distributed
  * B2C vs B2B sales
  * State-wise performance

### 🚚 Distributor / Field Officer

* Secure role-based login
* Log daily field activities
* Record meetings and visits
* Track sample distribution
* Capture sales data
* View personal performance dashboard

---

## 🧩 Core Features Implemented

### 1️⃣ Authentication & Authorization

* Secure login system
* Role-based access control (RBAC)
* Protected routes for Admin and Field roles
* Session-based access handling

---

### 2️⃣ Meeting & Interaction Logging

Supports:

* **One-on-One Meetings**

  * Person name
  * Category (Farmer / Seller / Influencer)
  * Location (auto-captured)
  * Business potential estimate
* **Group Meetings**

  * Village / location
  * Number of attendees
  * Meeting type

---

### 3️⃣ Sample Distribution Tracking

* Quantity distributed
* Date and recipient
* Purpose (trial / demo / follow-up)

---

### 4️⃣ Sales & Order Capture

Supports **B2C and B2B** flows:

* Product SKU
* Pack size
* Quantity sold
* Mode (direct / distributor)
* Repeat orders tracking

---

### 5️⃣ Centralized Admin Dashboard

Admin can visualize:

* Total distance traveled (per user / per day)
* Meetings conducted
* Farmers reached
* B2C vs B2B sales split
* State-wise and monthly performance
* Activity distribution via charts and maps

---

## 📊 Dashboards & Visualizations

* KPI summary cards
* Charts for trends and comparisons
* State-wise sales and activity breakdown
* Map-based visualization of meeting locations
* Mobile-first responsive layouts

---

## 🧠 Design Philosophy

Built specifically for **ground realities**:

* ✅ Mobile-first UI
* ✅ Large touch-friendly elements
* ✅ Clear visual hierarchy
* ✅ Works with dummy data (hackathon-ready)
* ✅ Offline-friendly UX patterns (design-ready)

> This is **not a consumer app** — it is an internal operations tool.

---

## 🛠️ Tech Stack

### Frontend

* **React + TypeScript**
* **Vite**
* **Tailwind CSS**
* Charting & visualization libraries
* Interactive canvas-based visual components

### Maps

* OpenStreetMap / Leaflet (for meeting locations)

### Deployment

* **Vercel** (CI/CD enabled)

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Layout.tsx
│   ├── nature/              # Interactive background & visuals
│   └── ui/
├── pages/
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── Signup.tsx
│   ├── admin/
│   ├── distributor/
│   └── field/
├── styles/
└── App.tsx
```

---

## 🚀 Getting Started Locally

```bash
# Clone the repo
git clone https://github.com/raghav-kapoor27/Occamy.git

# Go into project
cd field-operations-tracking-system-auth

# Install dependencies
npm install

# Run locally
npm run dev
```

---

## 🔑 Demo Credentials

| Role          | Email                                                 | Password    |
| ------------- | ----------------------------------------------------- | ----------- |
| Admin         | [admin@gmail.com](mailto:admin@gmail.com)             | password123 |
| Field Officer | [fieldofficer@gmail.com](mailto:fieldofficer@gmail.com)           | password123 |
| Distributor   | [distributor@gmail.com](mailto:distributor@gmail.com) | password123 |

---

## 🏆 Hackathon Alignment

| Requirement          | Status |
| -------------------- | ------ |
| Role-based system    | ✅      |
| Activity tracking    | ✅      |
| Sales & samples      | ✅      |
| Admin dashboard      | ✅      |
| Maps & visualization | ✅      |
| Deployable prototype | ✅      |

---

## 🔮 Future Enhancements (Post-Hackathon)

* Offline-first data sync
* GPS breadcrumb tracking
* Photo verification with metadata
* OTP-based login
* Audit logs for admin actions
* Multi-language support
* Farmer & Veterinarian roles (Bonus)

---

## 🎯 Key Insight

> **Build for the ground. Track the truth. Scale the impact.**

This project prioritizes **deployability tomorrow**, not just demo-day polish.

---

## 👥 Team – Caffeine++

Built with a focus on real-world constraints, clean architecture, and rapid execution within hackathon timelines by:

- **[Ayush Binjola](https://github.com/AyushBinjola1)**
- **[Raghav Kapoor](https://github.com/raghav-kapoor27)**
- **[Samarth Sharma](https://github.com/samtrue-tech)**

