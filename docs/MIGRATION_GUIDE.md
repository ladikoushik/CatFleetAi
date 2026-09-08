# Monolith to Microservices Migration Guide

This guide outlines how the **CAT FleetBrain AI** backend was refactored from a single Express monolith into an Enterprise Microservices Architecture.

---

## 🔄 Refactoring Steps Executed

1. **Decoupled Relational Models into Database-per-Service**:
   - Monolithic database was split into 6 dedicated schemas (`auth_db`, `crm_db`, `fleet_db`, `rental_db`, `analytics_db`, `ai_db`).
   - Foreign key constraints crossing service boundaries were removed and replaced with UUID reference attributes.

2. **Implemented Central API Gateway**:
   - Built Express API Gateway on Port `5000` using `http-proxy-middleware`.
   - All client traffic targets `http://localhost:5000/api/*`, preserving full compatibility with the existing React frontend.

3. **Established Shared Core Library (`shared/`)**:
   - Extracted JWT authentication middleware, error handlers, and inter-service HTTP REST utilities into a reusable module.

4. **Added Service-to-Service REST Communication**:
   - When a rental contract is created or completed in `rental-service`, an asynchronous REST request updates the target machine's status in `fleet-service`.
   - `analytics-service` performs parallel REST calls to `fleet-service`, `rental-service`, and `crm-service` to build the unified dashboard payload.

5. **Containerized with Docker & Docker Compose**:
   - Created `docker-compose.yml` orchestrating MySQL 8 (`init-databases.sql`) alongside all 7 microservices.
