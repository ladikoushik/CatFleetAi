# CAT FleetBrain AI - Microservices API Documentation & OpenAPI Spec

All requests pass through the **API Gateway** running at `http://localhost:5000/api`.

---

## 1. Auth Service (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/login` | Authenticate user & issue JWT token | No |
| `POST` | `/api/auth/register` | Register new corporate customer/user account | No |
| `GET` | `/api/auth/profile` | Retrieve current user profile details | Yes |

---

## 2. CRM Service (`/api/customers`, `/api/dealers`, `/api/branches`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/customers` | Get corporate customer accounts & credit limits | Yes |
| `POST` | `/api/customers` | Create new customer account | Admin / Dealer Manager |
| `GET` | `/api/dealers` | List Caterpillar regional dealerships & branch hubs | Yes |
| `GET` | `/api/branches` | List dealership branch inventory locations | Yes |

---

## 3. Fleet Service (`/api/machines`, `/api/alerts`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/machines` | List heavy machinery with search, category, and status filters | No |
| `GET` | `/api/machines/:id` | Get machine diagnostics, fuel meter, engine hours & maintenance history | No |
| `POST` | `/api/machines` | Register new Caterpillar equipment | Admin / Dealer Manager |
| `PUT` | `/api/machines/:id` | Update machine telemetry, status, or location | Admin / Dealer Manager |
| `DELETE` | `/api/machines/:id` | Remove machine asset from fleet inventory | Admin |
| `GET` | `/api/alerts` | List real-time machine diagnostic alerts | Yes |
| `PUT` | `/api/alerts/:id` | Acknowledge / Resolve diagnostic alert | Yes |

---

## 4. Rental Service (`/api/rentals`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/rentals` | List all rental agreements & contract statuses | Yes |
| `POST` | `/api/rentals` | Generate new rental agreement (notifies Fleet Service) | Yes |
| `PUT` | `/api/rentals/:id` | Update contract status (`Draft`, `Active`, `Completed`, `Cancelled`) | Yes |

---

## 5. Analytics Service (`/api/dashboard`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/dashboard` | Aggregated Control Tower metrics (KPIs, utilization %, revenue, alerts) | No |

---

## 6. AI Predictive Service (`/api/ai`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/ai/forecast` | Regional fleet demand forecast | Yes |
| `POST` | `/api/ai/return-prediction` | Predicted equipment return date & delay risk | Yes |
| `GET` | `/api/ai/predictive-maintenance` | Machine failure probability & component risk evaluation | Yes |
| `GET` | `/api/ai/anomalies` | Live telemetry anomaly detection stream | Yes |
| `POST` | `/api/ai/recommendations` | Smart equipment recommendation engine | Yes |
