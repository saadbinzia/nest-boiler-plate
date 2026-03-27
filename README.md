<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# Residential Management System - API Backend

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

A comprehensive NestJS-based API for residential property management that provides building management, user authentication, file handling, and notification services.

## 🚀 Features

### Core Functionality
- **Property Management**: Buildings, floors, and spaces management
- **User Management**: Staff and tenant management with role-based access
- **Authentication**: JWT-based authentication with password reset
- **File Management**: AWS S3 integration for property images and documents
- **Email System**: Nodemailer with Handlebars templates for notifications
- **Caching**: Redis-based caching system for performance
- **Notifications**: Real-time notification system
- **Media Management**: Image processing and optimization
- **Dashboard Analytics**: Property statistics and insights

### Technical Features
- **Authentication**: JWT-based authentication with Passport
- **API Documentation**: Swagger/OpenAPI documentation
- **Database**: PostgreSQL with Sequelize ORM
- **Validation**: Class-validator with custom pipes
- **Error Handling**: Global exception filters
- **Role-based Access**: Custom guards and decorators
- **File Upload**: Multer integration with custom interceptors
- **Cron Jobs**: Scheduled task management
- **Logging**: Comprehensive logging system

## 🏗️ Architecture

The project follows a modular architecture with the following structure:

```
src/
├── core/           # Core utilities, decorators, guards, filters
├── database/       # Database configuration and migrations
├── entities/       # Sequelize models
├── modules/        # Feature modules
│   ├── admin/      # Admin panel functionality
│   │   ├── auth/   # Admin authentication
│   │   ├── properties/ # Property management
│   │   └── user/   # User management
│   ├── app/        # Main application modules
│   │   ├── auth/   # User authentication
│   │   └── user/   # User management
│   ├── cron/       # Scheduled tasks
│   ├── mail/       # Email services
│   ├── media/      # Media management
│   └── shared/     # Shared services and utilities
│       ├── auth/   # Shared authentication
│       ├── cache/  # Caching services
│       ├── notification/ # Notification system
│       ├── s3/     # AWS S3 integration
│       └── user/   # Shared user services
```

### Request Lifecycle

1. Client sends HTTP request with JWT (Authorization: Bearer)
2. Guard authenticates request (Passport + JWT strategy)
3. Controller receives request and validates DTOs (class-validator)
4. Service layer executes business logic
5. Repositories access database via Sequelize (transactions where needed)
6. Cache layer (Redis) used for read-heavy endpoints
7. File operations handled via S3 service for media/uploads
8. Response mapped to DTOs and returned as JSON

## 📋 Prerequisites

- **Node.js** (v18 or later)
- **npm** or **yarn**
- **PostgreSQL** (v12 or later)
- **Redis** (for caching and sessions)
- **AWS S3** (for file storage)
- **SMTP Server** (for email notifications)

## 🛠️ Installation

1. **Navigate to the API directory:**
   ```bash
   cd api
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   # Create .env file with the following variables:
   ```

## 🚀 Running the Application

### Development Mode
```bash
npm run start:dev
```

**Local Development Notes:**
- The application runs on port 3000 by default
- Swagger documentation is available at `/api`
- Database migrations run automatically on startup
- Redis connection is required for caching

### Debug Mode
```bash
npm run start:debug
```

### Production Mode
```bash
npm run build
npm run start:prod
```

### Docker (if available)
```bash
docker-compose up -d
```

## 📚 API Documentation

Once the application is running, access the API documentation:

- **Swagger UI**: http://localhost:3000/api
- **OpenAPI JSON**: http://localhost:3000/api-json

## 🧪 Testing

```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov

# Debug tests
npm run test:debug
```

## 📁 Key Modules

### Property Management (`/modules/admin/properties`)
- Buildings management (CRUD operations)
- Floors management within buildings
- Spaces/units management within floors
- Property dashboard with analytics
- Property image management

### Authentication (`/modules/app/auth` & `/modules/admin/auth`)
- JWT-based authentication
- Local strategy for email/password
- Password reset functionality
- Role-based access control
- User session management

### User Management (`/modules/app/user` & `/modules/admin/user`)
- Staff management (admin panel)
- Tenant management
- User registration and profile management
- Email verification
- User role assignment

### File Management (`/modules/shared/attachment`)
- AWS S3 file upload
- File validation and processing
- Image optimization
- File metadata management
- Property document storage

### Media Management (`/modules/media`)
- Image processing and optimization
- File upload handling
- Media metadata extraction
- Thumbnail generation

### Email System (`/modules/mail`)
- Email template management
- Automated notifications
- Password reset emails
- Property update notifications

### Caching (`/modules/shared/cache`)
- Redis-based caching
- Performance optimization
- Session management
- Data caching strategies

### Notifications (`/modules/shared/notification`)
- Real-time notifications
- Email notifications
- System alerts
- User notification preferences

## 🔧 Configuration

### Environment Variables

Key environment variables to configure:

```env
# =============================================================================
# DATABASE CONFIGURATION
# =============================================================================
DB_HOST=localhost
DB_PORT=5432
DB_NAME=residential_management
DB_USERNAME=username
DB_PASSWORD=password

# =============================================================================
# REDIS CONFIGURATION
# =============================================================================
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# =============================================================================
# JWT AUTHENTICATION
# =============================================================================
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# =============================================================================
# AWS S3 CONFIGURATION
# =============================================================================
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=your-s3-bucket-name

# =============================================================================
# EMAIL CONFIGURATION
# =============================================================================
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-app-password
MAIL_FROM=noreply@yourdomain.com

# =============================================================================
# APPLICATION CONFIGURATION
# =============================================================================
NODE_ENV=development
PORT=3000
CORS=http://localhost:3000
APP_URL=http://localhost:3000
API_URL=http://localhost:3000

# =============================================================================
# CACHE CONFIGURATION
# =============================================================================
FILE_CACHE_DIR=./cache
FILE_CACHE_MAX_BYTES=104857600

# =============================================================================
# CRON CONFIGURATION
# =============================================================================
CRON_KEY=your-cron-secret-key
ADMIN_CRON_SECRET=your-admin-cron-secret
```

## 📊 Database Migrations

```bash
# Run all migrations
npm run migrate

# Create new migration
npm run migrate:create migration-name

# Rollback last migration
npm run migrate:down

# Rollback all migrations
npm run migrate:down:all
```

## 🔍 Code Quality

```bash
# Linting
npm run lint
npm run lint:fix

# Formatting
npm run format:write
npm run format:check
```

## 🐳 Docker Support

The project includes Docker configuration for easy deployment:

```bash
# Build and run with Docker Compose
docker-compose up -d

# Run specific services
docker-compose up -d postgres redis
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation at `/api`
- Review the logs in the `public/logs.html` file

## 📱 API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/forgot-password` - Password reset request
- `POST /auth/reset-password` - Password reset

### Properties
- `GET /properties/dashboard` - Properties overview
- `GET /properties/buildings` - List buildings
- `POST /properties/buildings` - Create building
- `GET /properties/floors` - List floors
- `POST /properties/floors` - Create floor
- `GET /properties/spaces` - List spaces
- `POST /properties/spaces` - Create space

### Users
- `GET /users` - List users
- `POST /users` - Create user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Media
- `POST /media/upload` - Upload files
- `GET /media/:id` - Get media file
- `DELETE /media/:id` - Delete media file

## 🔗 Related Projects

- **Admin Dashboard** (`/admin`) - Vue.js frontend for property management
- **Mobile Application** (if available)
- **Tenant Portal** (if available)

---

**Built with ❤️ using [NestJS](https://nestjs.com/)**
