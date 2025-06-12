# Order Management System

## Features

- **User Management**: Role-based authentication and authorization
- **Order Processing**: Complete order lifecycle management
- **Product Catalog**: Category-based item organization
- **Email Verification**: Secure user registration with email confirmation
- **Password Reset**: Secure password recovery system
- **Database Relations**: Well-structured relational database design
- **Health Monitoring**: Application health check endpoints

## Tech Stack

- **Backend**: Node.js, TypeScript, Express.js
- **Database**: PostgreSQL with Sequelize-TypeScript ORM

## Database Schema

![Database Schema](./DatabaseSchema/databaseSchema.svg)

### Core Models

- **Role**: User role management with permissions
- **User**: User accounts with authentication
- **EmailVerificationToken**: Email verification tokens
- **PasswordResetToken**: Password reset tokens
- **Category**: Product/service categories
- **Item**: Individual products/services
- **Order**: Customer orders
- **OrderItem**: Order line items (many-to-many relation)

### Key Relationships

- User belongsTo Role (many-to-one)
- User hasMany Orders (one-to-many)
- Order belongsTo User (many-to-one)
- Item belongsTo Category (many-to-one)
- Order belongsToMany Items through OrderItem (many-to-many)

## Installation

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/eslamalii/Order-Management
   cd order-management
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**

   Create a `.env` file in the root directory and copy the the values from `.env.example`

4. **Database Setup**

   Create the PostgreSQL database:

   ```sql
   CREATE DATABASE order_management_db;
   CREATE USER your_db_user WITH PASSWORD 'your_db_password';
   GRANT ALL PRIVILEGES ON DATABASE order_management_db TO your_db_user;
   ```

5. **Run the application**
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server

## Development Progress

### Assessment Requirements

#### 1. Item/Inventory Management

- [x] **CRUD Operations for Items**
  - [x] Super Admin/Managers: Full CRUD on items (name, description, price, category, expiry date, stock quantity)
  - [x] Waiters: View-only access to non-expired items
- [x] **Filtering & Sorting System**
  - [x] Filter by category (others, food, beverages)
  - [x] Sort by name, price, expiry date, total stock value (price × quantity)
  - [x] Support ascending/descending order for numeric and date fields
- [x] **Inventory Rules & Notifications**
  - [x] Prevent expired/unavailable items from being added to orders
  - [x] Email notifications to admins/managers 5 days before expiry
  - [x] Email notifications on expiry date with quantity/details

#### 2. Order Management

- [x] **Cashier Order Operations**
  - [x] Add/remove non-expired items to orders
  - [x] Set item quantities
  - [x] Mark orders as complete
  - [x] Assign orders to specific waiters
- [x] **Admin/Manager Order Oversight**
  - [x] View and manage all orders
  - [x] Access order details and status
- [x] **Order Processing Features**
  - [x] Calculate total cost for multiple items with quantities
  - [x] Auto-expire orders after 4 hours if still pending

#### 3. User Authentication & Authorization

- [x] **Role-Based Access Control**
  - [x] Super Admin: Full system access
  - [x] Managers: Full functional access
  - [x] Cashiers: Order management + limited access
  - [x] Waiters: View-only + personal data access
- [x] **Authentication Features**
  - [x] JWT-based authentication
  - [x] Email verification for new user registrations
  - [x] Password reset functionality
  - [x] Admin/Manager user management (add cashiers/waiters)

#### 4. Waiter Commission Report API

- [x] **Report Endpoint Features**
  - [x] Accept date range parameters (startDate, endDate)
  - [x] Optional waiter name filtering (partial match)
  - [x] JSON response by default
  - [x] CSV export option (export=true, format=csv)
- [x] **Access Control**
  - [x] Super Admins/Managers/Cashiers: View all data
  - [x] Waiters: View only their own data
- [x] **Raw SQL Aggregation**
  - [x] Total items sold per waiter
  - [x] Items per category breakdown
  - [x] Revenue calculations
  - [x] Commission calculations (Others: 0.25%, Food: 1%, Beverages: 0.5%)

#### 5. CSV Import/Export for Items

- [x] **CSV Operations**
  - [x] Import item data with all details and stock levels
  - [x] Export complete item inventory
  - [x] Support creating new items via import
  - [x] Update existing items based on unique identifier
- [x] **Admin/Manager Access Only**

### Completed Features

- [x] Project setup and configuration
- [x] TypeScript configuration and build setup
- [x] Database connection with PostgreSQL
- [x] Environment variables configuration
- [x] Sequelize-TypeScript ORM setup
- [x] Core data models implementation:
  - [x] User and Role models
  - [x] Authentication token models (Email verification, Password reset)
  - [x] Product catalog models (Category, Item)
  - [x] Order management models (Order, OrderItem)
- [x] Model relationships and associations
- [x] Database synchronization
- [x] Development server setup with nodemon
- [x] Health check endpoints
- [x] Utility functions (API responses, error handling)
- [x] Project structure organization
- [x] Logging system setup with winston
- [x] User Auth controller
- [x] User Service
- [x] Constants enum values to be shared across the project
- [x] Implemented DI using inversify
- [x] Centralize Validation with Zod package

### Bonus Features

#### Priority 1: AI Integration

- [ ] **Gen AI API Integration**
  - [ ] Generate 3 promo messages (SMS/social media)
  - [ ] Triggered emails for newly added 'Food' items (min. price 200)
  - [ ] Triggered emails for 500+ sales in 10 days

#### Priority 2: Smart Pricing

- [ ] **Automatic Discount System**
  - [ ] 25% discount for items expiring within 20 days
  - [ ] Show both original and discounted prices
  - [ ] Admin/Manager notifications and exclusion controls

#### Priority 3: Google Drive Integration

- [ ] **Automated Sales Report Export**
  - [ ] OAuth2 Google Drive integration
  - [ ] Daily/weekly sales reports export (CSV/PDF)
  - [ ] Automatic upload to specified Drive folder

#### Priority 4: Google Calendar Integration

- [ ] **Expiring Inventory Reminders**
  - [ ] OAuth2 Google Calendar integration
  - [ ] Automatic calendar events for items nearing expiry
  - [ ] Shared calendar for team visibility

#### Priority 5: Documentation & Deployment

- [ ] **Swagger/OpenAPI Documentation**
- [ ] **API Deployment** with public URL
- [ ] **Interactive API Documentation** (Postman with environment variables)
