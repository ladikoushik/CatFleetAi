# CAT FleetBrain AI - Enterprise Microservices Architecture

This document describes the refactored **Enterprise Microservices Architecture** for Caterpillar Fleet Rental Management Platform.

---

## 🏛️ System Architecture Diagram

```mermaid
flowchart TD
    Client["React (Vite) Industrial Frontend\n(Port 3000)"] -->|REST / HTTP| Gateway["API Gateway / Router\n(Port 5000)"]

    subgraph Security & Routing
        Gateway -->|/api/auth| AuthService["Auth Service\n(Port 5001)"]
        Gateway -->|/api/customers, /api/dealers| CRMService["CRM Service\n(Port 5002)"]
        Gateway -->|/api/machines, /api/alerts| FleetService["Fleet Service\n(Port 5003)"]
        Gateway -->|/api/rentals| RentalService["Rental Service\n(Port 5004)"]
        Gateway -->|/api/dashboard| AnalyticsService["Analytics Service\n(Port 5005)"]
        Gateway -->|/api/ai| AIService["AI Predictive Service\n(Port 5006)"]
    end

    subgraph Inter-Service Communication
        RentalService -.->|REST Update Machine Status| FleetService
        AnalyticsService -.->|REST Aggregate Data| FleetService
        AnalyticsService -.->|REST Aggregate Data| RentalService
        AnalyticsService -.->|REST Aggregate Data| CRMService
    end

    subgraph Database-per-Service (MySQL 8)
        AuthService ---> DB1[(auth_db)]
        CRMService ---> DB2[(crm_db)]
        FleetService ---> DB3[(fleet_db)]
        RentalService ---> DB4[(rental_db)]
        AnalyticsService ---> DB5[(analytics_db)]
        AIService ---> DB6[(ai_db)]
    end
```

---

## 📊 Service Registry & Port Mapping

| Service Name | Port | Database Schema | Primary Responsibilities |
| :--- | :---: | :---: | :--- |
| **API Gateway** | `5000` | N/A | Central routing, JWT verification, Helmet, Rate Limiting, CORS |
| **Auth Service** | `5001` | `auth_db` | Login, Register, Forgot Password, JWT tokens, RBAC roles |
| **CRM Service** | `5002` | `crm_db` | Customer accounts, Caterpillar dealers & regional branch hubs |
| **Fleet Service** | `5003` | `fleet_db` | Heavy equipment inventory, telemetry gauges, maintenance logs, diagnostic alerts |
| **Rental Service** | `5004` | `rental_db` | Contract booking requests, rate billing structures, machine status progression |
| **Analytics Service** | `5005` | `analytics_db` | Control Tower KPIs, fleet utilization %, revenue forecasting reports |
| **AI Service** | `5006` | `ai_db` | Demand forecast, return date prediction, telemetry anomaly detection |

---

## 🔒 Security Standards
1. **Database-per-Service**: Microservices own their databases. Cross-database queries are strictly prohibited; inter-service data exchange occurs exclusively over internal REST APIs.
2. **Centralized JWT Guard**: The API Gateway verifies bearer tokens and forwards authorized user identity (`X-User-Id`, `X-User-Role`) headers downstream.
3. **Helmet & Rate Limiting**: Embedded on the Gateway to prevent DDoS and header sniffing attacks.
