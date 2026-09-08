# CAT FleetBrain AI - Enterprise Microservices Platform

[![Architecture](https://img.shields.io/badge/Architecture-Enterprise_Microservices-FFCD11?style=for-the-badge&logo=caterpillar&logoColor=black)](https://github.com)
[![Docker](https://img.shields.io/badge/Orchestration-Docker_Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://github.com)
[![Database](https://img.shields.io/badge/Database-Database--per--Service_MySQL_8-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://github.com)

**CAT FleetBrain AI** is an enterprise-grade Fleet Rental Management & AI Telemetry Platform refactored into a scalable **Database-per-Service Microservices Architecture**.

---

## 🏗️ Repository Project Structure

```
cat-fleetbrain-platform/
├── services/
│   ├── api-gateway/         # Central Router (Port 5000) - JWT, Helmet, CORS, Rate Limiting
│   ├── auth-service/        # Auth, User Accounts, Password Reset, RBAC (Port 5001 -> auth_db)
│   ├── crm-service/         # Customers, Dealers, Branches (Port 5002 -> crm_db)
│   ├── fleet-service/       # Machines, Telemetry, Health, GPS, Maintenance, Alerts (Port 5003 -> fleet_db)
│   ├── rental-service/      # Rental Contracts, Rate Calculations (Port 5004 -> rental_db)
│   ├── analytics-service/   # Control Tower Analytics, Utilization, Revenue (Port 5005 -> analytics_db)
│   └── ai-service/          # Demand Forecast, Anomaly Detection, Predictive Maint (Port 5006 -> ai_db)
├── shared/                  # Common Middleware, Error Handler, Logger, JWT & HTTP Client
├── docker/                  # Dockerfiles, MySQL 8 Initialization Scripts
│   ├── init-databases.sql
│   └── Dockerfile.service
├── docs/                    # Architectural Diagrams, API Specs & Migration Guide
│   ├── ARCHITECTURE.md
│   ├── API_DOCUMENTATION.md
│   └── MIGRATION_GUIDE.md
├── client/                  # Untouched React (Vite) Industrial Frontend (Port 3000)
└── docker-compose.yml       # Full Stack Docker Compose Orchestration
```

---

## 🚀 Running with Docker Compose (Recommended)

To start the entire microservices stack with MySQL 8:

```bash
docker-compose up --build
```

This launches:
- **MySQL 8.0 Container**: Initializes `auth_db`, `crm_db`, `fleet_db`, `rental_db`, `analytics_db`, `ai_db`.
- **API Gateway**: Exposed at `http://localhost:5000`
- **6 Microservices**: Running on ports `5001` through `5006`

---

## 💻 Local Development (Zero-Config SQLite Mode)

Each microservice can also run locally out-of-the-box using built-in SQLite database fallback:

### 1. Launch API Gateway
```bash
cd services/api-gateway
npm install
npm run dev
```

### 2. Launch Individual Services
```bash
cd services/auth-service && npm install && npm run dev
cd services/crm-service && npm install && npm run dev
cd services/fleet-service && npm install && npm run dev
cd services/rental-service && npm install && npm run dev
cd services/analytics-service && npm install && npm run dev
cd services/ai-service && npm install && npm run dev
```

### 3. Launch React Frontend
```bash
cd client
npm install
npm run dev  # Opens industrial dashboard at http://localhost:3000
```

---

## 📚 Documentation Links
- 📖 [Microservices Architecture Specs](docs/ARCHITECTURE.md)
- 🔌 [OpenAPI & REST API Documentation](docs/API_DOCUMENTATION.md)
- 🔄 [Monolith to Microservices Migration Guide](docs/MIGRATION_GUIDE.md)
