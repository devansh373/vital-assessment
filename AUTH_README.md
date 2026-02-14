# VitalSense Diagnostics - Authentication Guide

## Overview

The application now includes a complete authentication system using **localStorage** for data persistence. No backend database is required.

## Features

### 🔐 Authentication System

- **Login Page**: Existing users can sign in with email and password
- **Signup Page**: New users can create an account with validation
- **Session Persistence**: Users remain logged in across browser sessions
- **Logout**: Users can log out, which clears their session

### 💾 Data Storage

All user data is stored in the browser's localStorage:

- `vitalSenseUsers`: Array of all registered users
- `vitalSenseCurrentUser`: Current logged-in user session

### ✨ User Experience

- Welcome message showing user's name in navbar
- Logout button always visible when authenticated
- Smooth transitions between login/signup views
- Form validation with helpful error messages
- Clinical/medical aesthetic matching the main app

## How to Use

### For New Users (Signup)

1. Open the application
2. Click "Sign up" link at the bottom of the login form
3. Fill in:
   - Full Name (minimum 2 characters)
   - Email Address (valid email format)
   - Password (minimum 6 characters)
   - Confirm Password (must match)
4. Click "Create Account"
5. You'll be automatically logged in

### For Existing Users (Login)

1. Open the application
2. Enter your email and password
3. Click "Sign In"
4. You'll be redirected to the main assessment page

### Testing the System

You can create a test account with these steps:

1. Go to signup page
2. Use any email (e.g., `test@example.com`)
3. Create a password (e.g., `test123`)
4. Login with those credentials

## Form Validation

### Signup Validation

- ✅ Name must be at least 2 characters
- ✅ Email must be in valid format
- ✅ Password must be at least 6 characters
- ✅ Passwords must match
- ✅ Email must be unique (no duplicate accounts)

### Login Validation

- ✅ Email and password must match an existing user
- ✅ Clear error messages for invalid credentials

## Data Structure

### User Object

```javascript
{
  id: "1234567890",           // Timestamp-based unique ID
  name: "John Doe",           // User's full name
  email: "john@example.com",  // User's email (unique)
  password: "password123",    // Plain text (for demo only)
  createdAt: "2026-02-14T..."// ISO timestamp
}
```

### Current Session

```javascript
{
  email: "john@example.com",
  name: "John Doe",
  loginTime: "2026-02-14T..."
}
```

## Security Notes

⚠️ **Important**: This implementation is for **development/demo purposes only**

### Current Limitations

- Passwords are stored in **plain text** in localStorage
- No password hashing or encryption
- Data is visible in browser DevTools
- No server-side validation
- No rate limiting or brute force protection

### For Production Use

You should implement:

1. **Backend API** with proper authentication
2. **Password hashing** (bcrypt, argon2, etc.)
3. **JWT tokens** for session management
4. **HTTPS** for secure transmission
5. **Input sanitization** to prevent XSS
6. **Rate limiting** to prevent brute force attacks
7. **Email verification** for new accounts
8. **Password reset** functionality

## File Structure

```
src/
├── components/
│   ├── Login.jsx          # Login component
│   ├── Signup.jsx         # Signup component
│   └── Auth.css           # Authentication styles
├── App.jsx                # Main app with auth integration
└── App.css                # Main app styles
```

## Clearing Data

To reset all users and sessions:

```javascript
// Open browser console and run:
localStorage.removeItem("vitalSenseUsers");
localStorage.removeItem("vitalSenseCurrentUser");
// Then refresh the page
```

## Browser Compatibility

localStorage is supported in all modern browsers:

- ✅ Chrome 4+
- ✅ Firefox 3.5+
- ✅ Safari 4+
- ✅ Edge (all versions)
- ✅ Opera 10.5+

## Troubleshooting

### "An account with this email already exists"

- You're trying to sign up with an email that's already registered
- Try logging in instead, or use a different email

### Session not persisting

- Check if localStorage is enabled in your browser
- Some browsers disable localStorage in private/incognito mode

### Can't see my data

- Open DevTools → Application → Local Storage → your domain
- Look for `vitalSenseUsers` and `vitalSenseCurrentUser` keys
