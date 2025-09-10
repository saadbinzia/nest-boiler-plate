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

# YouTube Automation API

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

A comprehensive NestJS-based API for YouTube automation platform that provides user management, video processing, streaming capabilities, and subscription management.

## 🚀 Features

### Core Functionality
- **User Management**: Registration, authentication, social login, password reset
- **Video Processing**: Upload, processing with FFmpeg, thumbnail generation
- **Live Streaming**: Kubernetes-based stream management with Semper integration
- **Channel Management**: YouTube channel integration and video migration
- **Playlist Management**: Create and manage video playlists
- **Subscription System**: Plan management with Stripe integration
- **File Management**: S3 integration for file storage
- **Email System**: Nodemailer with Handlebars templates
- **Caching**: Redis-based caching system
- **Notifications**: Real-time notification system

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
│   ├── app/        # Main application modules
│   ├── cron/       # Scheduled tasks
│   ├── shared/     # Shared services and utilities
│   ├── stream/     # Live streaming functionality
│   └── video/      # Video processing
└── workers/        # Background workers
```

## 📋 Prerequisites

- **Node.js** (v16 or later)
- **npm** or **yarn**
- **PostgreSQL** (v12 or later)
- **Redis** (for caching and sessions)
- **FFmpeg** (for video processing)
- **Kubernetes** (for stream management)
- **AWS S3** (for file storage)
- **Stripe** (for payments)

## 🛠️ Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd youtube-automation/api
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   # Create .env file from the template below
   cp .env.example .env
   # Edit .env with your configuration
   
   # Or create .env manually with the following variables:
   ```

4. **Database setup:**
   ```bash
   # Run migrations
   npm run migrate
   
   # Or create a new migration
   npm run migrate:create migration-name
   ```

5. **Install FFmpeg (if not already installed):**
   ```bash
   # macOS
   brew install ffmpeg
   
   # Ubuntu/Debian
   sudo apt update && sudo apt install ffmpeg
   
   # Windows
   # Download from https://ffmpeg.org/download.html
   ```

## 🚀 Running the Application

### Development Mode
```bash
npm run start:dev
```

**Local Development Notes:**
- By default, the application uses the **Original Stream** implementation in development mode
- **Semper Stream** integration requires Kubernetes and is disabled by default locally
- To test Semper Stream locally, set `USE_SEMPER_STREAM=true` in your `.env` file
- Kubernetes operations will be mocked in development mode with appropriate warnings

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

### Authentication (`/modules/app/auth`)
- JWT-based authentication
- Local strategy for email/password
- Social login integration
- Password reset functionality

### Video Processing (`/modules/video`)
- Video upload and processing
- FFmpeg integration
- Thumbnail generation
- Video metadata extraction

### Streaming (`/modules/stream`)
- Kubernetes-based stream management
- Semper integration
- Stream lifecycle management
- Error handling and monitoring

### User Management (`/modules/app/user`)
- User registration and profile management
- Email verification
- Social login integration
- User sessions

### Subscription (`/modules/subscription`)
- Plan management
- Stripe integration
- Subscription lifecycle
- Payment processing

### File Management (`/modules/shared/attachment`)
- S3 file upload
- File validation
- Image processing
- File metadata management

## 🔧 Configuration

### Environment Variables

Key environment variables to configure:

```env
# =============================================================================
# DATABASE CONFIGURATION
# =============================================================================
DB_HOST=localhost
DB_PORT=5432
DB_NAME=youtube_automation
DB_USERNAME=username
DB_PASSWORD=password

# =============================================================================
# REDIS CONFIGURATION
# =============================================================================
REDIS_URL=redis://localhost:6379
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
# STRIPE PAYMENT CONFIGURATION
# =============================================================================
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key

# =============================================================================
# EMAIL CONFIGURATION
# =============================================================================
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@yourdomain.com

# =============================================================================
# SEMPER STREAM CONFIGURATION
# =============================================================================
# Enable/disable Semper Stream integration
# In development mode, defaults to false unless explicitly set to true
USE_SEMPER_STREAM=false

# Kubernetes Configuration for Semper Stream
SEMPER_STREAM_NAMESPACE=streams
SEMPER_STREAM_GROUP=media.yourco.io
SEMPER_STREAM_VERSION=v1
SEMPER_STREAM_PLURAL=streams

# =============================================================================
# KUBERNETES CONFIGURATION
# =============================================================================
KUBERNETES_NAMESPACE=default
DEFAULT_SECRET_KEY_FIELD=key

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

# =============================================================================
# SUBSCRIPTION CONFIGURATION
# =============================================================================
TRIAL_PERIOD=7d
MAIL_SUPPORT=support@yourdomain.com
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

## 🔗 Related Projects

- Frontend application (if available)
- Mobile application (if available)
- Admin dashboard (if available)

---

Built with ❤️ using [NestJS](https://nestjs.com/)
