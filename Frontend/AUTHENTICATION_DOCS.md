# Authentication Pages & Theme System Documentation

## 📋 Overview

A complete authentication system with **Login**, **Register**, and **Home** pages with a centralized CSS theming system supporting both light and dark modes with a mobile-first responsive design.

---

## 🎨 Theme System

### Theme Variables File: `src/styles/theme.css`

**Centralized CSS Variables** including:
- **Primary Colors**: `--primary-color`, `--primary-light`, `--primary-dark`, `--primary-gradient`
- **Secondary Colors**: `--secondary-color`, `--secondary-light`, `--secondary-dark`
- **Neutral Colors**: `--text-primary`, `--text-secondary`, `--bg-primary`, `--bg-secondary`, `--border-color`
- **State Colors**: `--success`, `--warning`, `--error`, `--info`
- **Shadows**: `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-xl`
- **Spacing**: `--spacing-xs` through `--spacing-3xl`
- **Border Radius**: `--radius-sm` through `--radius-full`
- **Typography**: Font sizes and weights with `--font-*` variables
- **Transitions**: `--transition-fast`, `--transition-base`, `--transition-slow`

**Dark Mode Support**: Variables automatically switch when `data-theme="dark"` is set on root element

---

## 📄 Pages Created

### 1. **Login Page** (`src/pages/Login.jsx`)

**Fields:**
- Email Address (with email icon)
- Password (with toggle visibility button)

**Features:**
- Form validation
- Error message display
- Loading state with spinner
- Password visibility toggle
- Responsive design
- Link to register page
- Forgot password link

---

### 2. **Register Page** (`src/pages/Register.jsx`)

**Fields:**
- First Name
- Last Name
- Email Address
- Password
- Confirm Password

**Features:**
- Form validation with custom error messages
- Password strength indicators
- Password match validation
- Confirm password visibility toggle
- Loading state with spinner
- Icon indicators for each field
- Two-column layout on larger screens
- Responsive form grid

---

### 3. **Home Page** (`src/pages/Home.jsx`)

**Components:**
- Header with logout button
- Sidebar with recent chats list
- Chat area with welcome section
- New chat button
- Chat list management

**Features:**
- Protected route (requires token)
- Fetches user chats from API
- Loading and error states
- Chat selection and navigation
- Welcome message

---

## 🎯 CSS Files

### `src/styles/theme.css`
Centralized CSS variable definitions for consistent theming

### `src/styles/globals.css`
Global styles including:
- HTML5 element resets
- Custom scrollbars
- Selection styles
- Default heading and text styles
- Utility classes (margin, padding, text alignment)
- Responsive design foundation

### `src/styles/Auth.css`
Responsive authentication page styles with:
- Mobile-first approach
- Card layout with shadows
- Form groups and inputs with icons
- Button states
- Alert messages
- Password toggle functionality
- Decorative gradient elements for desktop

### `src/styles/Home.css`
Dashboard styles with:
- Header with navigation
- Sidebar chat list
- Chat area content
- Responsive layout changes
- Mobile collapsible sidebar

---

## 📱 Responsive Design

### Mobile-First Approach:
1. **Mobile (< 768px)**
   - Full-width cards
   - Stacked form layout
   - Vertical sidebar
   - Simplified spacing

2. **Tablet (768px - 1024px)**
   - Optimized card widths
   - Two-column form grids
   - Side-by-side sidebar/content
   - Medium spacing

3. **Desktop (> 1024px)**
   - Maximum width containers
   - Decorative elements
   - Enhanced typography
   - Full featured layout

---

## 🌓 Dark/Light Theme

To enable dark mode, add to your root element:
```html
<div data-theme="dark">
  <!-- Your app content -->
</div>
```

Or add class to body:
```html
<body class="dark-mode">
  <!-- Your app content -->
</body>
```

---

## 🔗 Routes Configuration

Routes are automatically configured in `AppRoutes.jsx`:
- `/` - Home page (protected)
- `/login` - Login page
- `/register` - Register page

---

## 🛠️ Implementation Details

### Form Handling:
- Controlled components with React state
- Real-time error clearing on input change
- Form validation before submission
- Loading states during API calls

### API Integration:
- Placeholder endpoints ready for backend connection:
  - `POST /api/auth/login`
  - `POST /api/auth/register`
  - `GET /api/chats`

### Icons:
- Emoji icons integrated (email, lock, user)
- No external icon library needed
- Easy to customize

### Storage:
- JWT tokens stored in localStorage
- Automatic route protection
- Token sent in Authorization header

---

## 🎨 Color Palette

**Default Light Mode:**
- Primary: `#6366f1` (Indigo)
- Success: `#10b981` (Green)
- Warning: `#f59e0b` (Amber)
- Error: `#ef4444` (Red)
- Text Primary: `#1f2937` (Dark Gray)
- Background: `#ffffff` (White)

**CSS variables automatically adapt** when dark mode is enabled

---

## 📦 Dependencies

The following are already installed:
- React
- React Router DOM
- Vite (bundler)

No additional libraries needed for authentication pages.

---

## ⚡ Quick Start

1. **Server already running** on `http://localhost:5174/`

2. **Navigate to pages:**
   - Register: `http://localhost:5174/register`
   - Login: `http://localhost:5174/login`
   - Home: `http://localhost:5174/`

3. **Update API endpoints** in Login.jsx, Register.jsx, and Home.jsx to connect to your backend

4. **Customize theme** by modifying CSS variables in `src/styles/theme.css`

---

## 🔄 Next Steps

1. Connect to your backend API endpoints
2. Implement JWT token validation
3. Add forgot password functionality
4. Enhance form validation
5. Add loading skeletons
6. Implement profile page
7. Add chat interface

---

## 📝 Notes

- All forms use proper HTML5 validation attributes
- Accessibility features included (aria-labels)
- Smooth transitions and micro-interactions
- Mobile-friendly with touch-optimized hit areas
- CSS variables allow easy theming without code changes
