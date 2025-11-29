# 🚨 CrisisConnect

> A disaster relief management platform for real-time crisis response, zone monitoring, and citizen SOS requests.

![CrisisConnect Banner](./screenshots/photo-collage.png.png)

---

## 📖 Overview

CrisisConnect is a full-stack disaster management system built to connect citizens, NGOs, and government authorities during emergencies.
It enables **real-time SOS reporting**, **zone-based monitoring**, and **safety tips management**, with admin capabilities for managing disaster zones and resources.

---

## ⚙️ Tech Stack

- **Frontend:** React.js, Redux, TailwindCSS, Leaflet.js (for maps)
- **Backend:** Spring Boot, Spring Security, PostgreSQL
- **Auth Features:** JWT, OTP verification, Two-Factor Authentication, Reset Password
- **Other Tools:** Docker (for containerized deployment)

---

## ✨ Features

### 👥 Users

- Register/Login with secure authentication
- Enable 2FA and OTP verification
- Submit SOS requests with geolocation + disaster type
- View safety tips for disaster awareness
- Personal profile with editable details (name, phone, address)
- Track personal SOS history

### 🛠️ Admins

- Create, edit, and delete disaster zones
- Manage SOS requests (update statuses)
- Add and delete safety tips for different disaster types
- Monitor real-time SOS requests on the map

---

## 📸 Screenshots

### Dashboard & Analytics

![Dashboard Analytics and quick actions](screenshots/dashboardAnalytics.png)
![Dashboard map](screenshots/dashboardMap.png)

### Disaster Zones Management

![Disaster Zone page](screenshots/disasterZone.png)
![Add/Edit disaster Zone](screenshots/addEditZone.png)

### Detailed Disaster Zone

![Safety Tips of specific zone](screenshots/safetyTips.png)

### SOS Requests

![Sos page](screenshots/sosPage.png)
![All sos requests (or by filtering)](screenshots/sosRequests.png)
![SOS Analytics](screenshots/sosAnalytics.png)
![Sos By disaster types](screenshots/sosDisasterType.png)
![Create Sos](screenshots/createSos.png)

### Profile Page

![Profile page](screenshots/profilePage.png)
![Update personal details](screenshots/editProfile.png)

## 🚀 Local Setup

### Prerequisites

- Node.js (v18+)
- Java 17+
- PostgreSQL (running locally or via Docker)

### Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

### Backend Setup

```bash
cd Backend
./mvnw spring-boot:run
```

### Database

Create a PostgreSQL database and update your `application.yml` with credentials:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/crisisconnect
    username: postgres
    password: password
```

## Also set your email and its google password for the two-factor authentication endpoints.

## 🔐 Authentication Features

- JWT authentication
- Reset password flow
- OTP verification for sensitive actions
- Two-factor authentication support

---

## 📌 Roadmap

- Push notifications for new SOS requests
- Offline-first PWA support
- Role-based dashboards (Citizen vs NGO vs Admin)

---

## 🤝 Contribution

Contributions are welcome! Please open an issue or PR for improvements.

---

