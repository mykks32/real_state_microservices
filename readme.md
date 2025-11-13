# Real Estate Microservices Platform

A comprehensive real estate management platform built with microservices architecture. This system enables property listing, enquiry management, user authentication, and administrative functions through a modern, scalable backend infrastructure.

## Architecture Overview

The platform follows a microservices pattern with the following components:

### Core Services
- **API Gateway**: NestJS-based gateway handling routing, authentication, and request aggregation
- **Auth Service**: User authentication, authorization, and session management
- **Property Service**: Property listing management with approval workflows
- **Enquiry Service**: Property enquiry and lead management system

### Frontend
- **Landing Frontend**: Next.js-based user interface for buyers, sellers, and administrators

### Data Storage
- **PostgreSQL**: Primary database for Auth and Enquiry services
- **MySQL**: Property service database
- **Redis**: Session storage and caching layer

## Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for local development)
- Java 17+ (for Property service development)

### Environment Setup

#### 1. Clone the repository

```bash
git clone https://github.com/mykks32/real_state_microservices.git
cd real_state_microservices
```

#### 2. Create environment files

```bash
./scripts/create-env.sh
```

Then edit the generated files in the `env/` directory with your actual configuration values.

#### 3. Deployment

**Option 1: Using Scripts**

Build Docker images:
```bash
./scripts/docker-build.sh
```

Start the application:
```bash
./scripts/run-prod.sh
```

**Option 2: Using Docker Compose**

Build and start containers:
```bash
docker compose up --build -d
```

Stop and remove containers:
```bash
docker compose down
```
## Project Structure

```
real_state_microservices/
├── api-gateway/                  # NestJS API Gateway
│   ├── src/
│   │   ├── common/               # Middleware, DTOs, decorators, guards
│   │   ├── config/               # Configuration
│   │   └── modules/              # Feature modules: auth, enquiry, property
│   └── test/                     # E2E tests
│
├── auth-service/                 # NestJS Authentication Service
│   ├── src/
│   │   ├── common/               # DTOs, exceptions, filters, middleware
│   │   ├── config/               # Environment and module config
│   │   ├── database/             # Entities, migrations, seeds
│   │   └── module/               # Auth and User modules
│   └── test/                     # Unit & integration tests
│
├── property-service/             # Spring Boot Property Service
│   ├── src/main/java/com/realState/property_service/
│   │   ├── common/               # Exception handling, utils
│   │   ├── database/             # Entities, enums, repositories
│   │   └── module/               # Business modules: property, location
│   ├── src/main/resources/db/migration/ # Flyway migrations
│   └── src/test/                 # Unit & integration tests
│
├── enquiry-service/              # NestJS Enquiry Service
│   ├── src/
│   │   ├── common/               # Exceptions, filters, DTOs
│   │   ├── config/               # Service configuration
│   │   ├── database/             # Entities, migrations
│   │   └── enquiry/              # Enquiry module: DTOs, enums, interfaces
│   └── test/                     # Unit & integration tests
│
├── landing-frontend/             # Next.js Frontend
│   ├── app/                      # App router: auth, public routes, dashboard
│   ├── components/               # UI components: dashboard, property, common
│   ├── services/                 # API services
│   ├── hooks/                    # Custom React hooks
│   ├── stores/                   # Zustand state
│   ├── interfaces/               # TypeScript interfaces
│   └── schemas/                  # Form validation schemas
│
├── scripts/                      # Deployment & setup scripts
│   ├── create-env.sh             # Environment setup
│   ├── docker-build.sh           # Build Docker images
│   └── run-prod.sh               # Production deployment
└── docker-compose.yml            # Docker orchestration
```

## Service Details

#### API Gateway (`/api-gateway`)
- **Technology**: NestJS with TypeScript
- **Port**: 4000
- **Responsibilities**:
    - Request routing and load balancing across microservices
    - Authentication and authorization middleware
    - API rate limiting and request validation
    - Swagger documentation generation
    - Health monitoring and circuit breaker patterns
- **Key Features**:
    - JWT-based authentication guards
    - Role-based access control (RBAC)
    - Request/response transformation
    - Centralized error handling
    - CORS configuration

#### Authentication Service (`/auth-service`)
- **Technology**: NestJS with TypeScript, PostgreSQL, Redis
- **Port**: 3000
- **Responsibilities**:
    - User registration and account management
    - JWT token generation and validation
    - Session management with Redis caching
    - Password hashing and security
    - Role-based permission system
- **Database**: PostgreSQL with TypeORM
- **Key Features**:
    - Refresh token rotation
    - Email uniqueness validation
    - Admin user seeding
    - Comprehensive exception handling

#### Property Service (`/property-service`)
- **Technology**: Spring Boot with Java, MySQL
- **Port**: 8080
- **Responsibilities**:
    - Property listing CRUD operations
    - Property approval workflow management
    - Advanced filtering and search capabilities
    - Location data management
    - Property status tracking
- **Database**: MySQL with Flyway migrations
- **Key Features**:
    - Specification pattern for complex queries
    - Custom exception hierarchy
    - DTO mapping with validation
    - Geographic location support

#### Enquiry Service (`/enquiry-service`)
- **Technology**: NestJS with TypeScript, PostgreSQL
- **Port**: 3001
- **Responsibilities**:
    - Property enquiry management
    - Enquiry status tracking
    - Pagination and filtering
    - Customer communication tracking
- **Database**: PostgreSQL with TypeORM
- **Key Features**:
    - Status transition validation
    - Pagination support
    - Relationship management with properties

### Frontend Application

#### Landing Frontend (`/landing-frontend`)
- **Technology**: Next.js 14 with TypeScript, Tailwind CSS
- **Port**: 3002
- **Responsibilities**:
    - Responsive user interface for all user roles
    - Property browsing and search functionality
    - User authentication flows
    - Dashboard interfaces for sellers and administrators
- **Key Features**:
    - Role-based routing and access control
    - Server-side rendering (SSR) capabilities
    - Component library with shadcn/ui
    - State management with Zustand
    - Form handling with React Hook Form

### Infrastructure & Data Storage

#### Database Systems
- **PostgreSQL**: Primary database for Auth and Enquiry services
    - User management and authentication data
    - Enquiry and customer interaction records
    - TypeORM with migrations
- **MySQL**: Property service database
    - Property listings and location data
    - Approval workflow states
    - Spring Data JPA with Flyway migrations
- **Redis**: Session storage and caching layer
    - JWT token blacklisting
    - User session management
    - Cache for frequently accessed data

#### Containerization
- **Docker Compose**: Multi-container orchestration
- **Health Checks**: All services include health monitoring
- **Volume Management**: Persistent data storage
- **Network Isolation**: Custom bridge network for service communication

## Complete API Endpoints

### API Gateway (Port 4000)
**Base URL: `http://localhost:4000`**

#### Health & Utility Endpoints
- `GET /` - API gateway status
- `GET /health` - Health check
- `GET /hello` - Test endpoint
- `GET /docs` - Swagger API documentation

#### Authentication Endpoints (`/auth`)
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user profile

#### Property Endpoints (`/property`)

##### Public Property Endpoints (No authentication required)
- `GET /property/id/:propertyId` - Get property by ID
- `GET /property/approved` - Get all approved properties
- `GET /property/filter` - Filter properties with query parameters

##### Seller Property Endpoints (Seller role required)
- `POST /property` - Create new property listing
- `GET /property/owner` - Get properties owned by current user
- `PUT /property/:propertyId` - Update property details
- `PATCH /property/:propertyId/submit` - Submit property for approval

##### Admin Property Endpoints (Admin role required)
- `GET /property/all` - Get all properties (including pending/archived)
- `GET /property/pending` - Get pending approval properties
- `PATCH /property/:propertyId/approve` - Approve property listing
- `PATCH /property/:propertyId/reject` - Reject property listing
- `PATCH /property/:propertyId/archive` - Archive property
- `DELETE /property/delete/:propertyId` - Delete property permanently
- `POST /property/admin/create` - Admin create property (bypass approval)

#### Enquiry Endpoints (`/enquiry`)


## Frontend Routes (Port 3002)
**Base URL: `http://localhost:3002`**

### Public Routes
- `/` - Landing homepage
- `/about` - About page
- `/contact` - Contact page
- `/find` - Property search and browsing
- `/property/[propertyId]` - Property details page

### Authentication Routes
- `/login` - User login
- `/signup` - User registration

### Protected Routes (Requires Authentication)

#### Dashboard Routes (`/dashboard`)
- `/dashboard` - User dashboard (role-based)
    - **Buyer**: View enquiries, saved properties
    - **Seller**: Property management, enquiry responses
    - **Admin**: System administration, approval workflows

#### Seller-Specific Features
- Property creation and management
- Enquiry management and response
- Property status updates

#### Admin-Specific Features
- Property approval/rejection workflows
- User management
- System analytics and reporting


## Development

### Local Development Setup

1. **Install dependencies for each service**
   ```bash
   cd api-gateway && npm install
   cd ../auth-service && npm install  
   cd ../enquiry-service && npm install
   cd ../landing-frontend && npm install
   ```

2. **Run services individually**
   ```bash
   # Terminal 1 - Auth Service
   cd auth-service && npm run start:dev
   
   # Terminal 2 - Enquiry Service  
   cd enquiry-service && npm run start:dev
   
   # Terminal 3 - Property Service
   cd property-service && ./mvnw spring-boot:run
   
   # Terminal 4 - API Gateway
   cd api-gateway && npm run start:dev
   
   # Terminal 5 - Frontend
   cd landing-frontend && npm run dev
   ```

### Environment Variables

Create `.env` files in each service directory or use the centralized `env/` approach:

#### env/api-gateway.env
```env
PORT=4000
FRONTEND_URL=http://localhost:3002
AUTH_SERVICE_URL=http://auth-service:3000
ENQUIRY_SERVICE_URL=http://enquiry-service:3001
PROPERTY_SERVICE_URL=http://property-service:8080
```

#### env/auth-service.env
```
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@postgres-auth:5432/real_state_pg
REDIS_URL=redis://:redis@redis-auth:6379
JWT_SECRET=your-secret-key-here
JWT_EXPIRATION=3600
```

#### env/enquiry-service.env
```env
PORT=3000
DATABASE_URL=postgresql://user:pass@postgres-auth:5432/real_state_pg
REDIS_URL=redis://redis-auth:6379
```

#### env/property-service.env
```env
SERVER_PORT=8080
SPRING_DATASOURCE_URL=jdbc:mysql://mysql-property:3306/realState_property_mysql
SPRING_DATASOURCE_USERNAME=user
SPRING_DATASOURCE_PASSWORD=password
SPRING_DATASOURCE_DRIVER_CLASS_NAME=com.mysql.cj.jdbc.Driver
SPRING_FLYWAY_ENABLED=true
SPRING_FLYWAY_BASELINE_ON_MIGRATE=true
```

#### env/landing-frontend.env
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## Monitoring & Health Checks

All services include health check endpoints:
- API Gateway: `/health`
- Auth Service: `/health`
- Enquiry Service: `/health`
- Property Service: `/actuator/health`

## CI/CD

The project includes Docker configurations for containerized deployment. Each service can be built, tested, and deployed independently.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the GitHub repository
- Check the API documentation at `/docs` endpoint

## Contact

Project Maintainer: [mykks32](https://github.com/mykks32)