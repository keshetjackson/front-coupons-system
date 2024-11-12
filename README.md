# Coupon System

A frontend application for managing a coupon system, built as per assignment requirements.

## Core Features

- Anonymous coupon application system with support for multiple coupons
- Admin panel for coupon management and reporting
- Secure authentication system for admin users
-  coupon validation including stacking rules and usage limits

## Technical Highlights

### Architecture & Performance
- Used React Query for efficient server state management, eliminating need for global contexts
- Implemented optimistic updates for better UX in coupon management
- Applied proper TypeScript typings throughout for type safety

### Security & Validation
- Implemented complete auth flow with protected routes
- Added comprehensive coupon validation logic:
  - Usage limits tracking
  - Expiration dates
  - Stacking rules
  - Multi-coupon validation

### UI/UX Considerations
- Clean, responsive design using Tailwind CSS and shadcn/ui
- Immediate feedback on coupon validity
- Proper loading and error states
- Intuitive coupon management interface

## Technologies
- React 18
- TypeScript
- TanStack Query for server state
- Tailwind CSS & shadcn/ui for styling
- React Router for navigation

### Authentication
- Used React Query for auth state management instead of Context API
- Implemented protected routes with auth checks
- Added user management for admins

### Coupon Management
- Complete CRUD operations for coupons
- Real-time validation
- Support for multiple discount types (percentage/fixed)
- Flexible stacking rules

### Data Handling
- Efficient caching with React Query
- Type-safe API interactions
- Proper error handling and loading states



### Test Credentials
```
Username: admin
Password: admin123
```
