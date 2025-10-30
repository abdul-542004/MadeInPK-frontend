# Authentication Testing Guide

## Setup

### 1. Environment Configuration

Copy the example environment file:
```bash
cp .env.example .env
```

Edit `.env` and set your backend URL (default is already set):
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

### 2. Start Backend Server

Make sure your Django backend is running:
```bash
# In your backend directory
python manage.py runserver
```

The backend should be accessible at `http://localhost:8000`

### 3. Start Frontend Development Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173` (or another port if 5173 is busy)

## Testing Authentication

### Test User Login

Use these pre-existing test accounts (password: `password123` for all):

**Buyer Account:**
- Email: `buyer1@example.com`
- Password: `password123`
- Role: Buyer

**Seller Account:**
- Email: `seller1@example.com`
- Password: `password123`
- Role: Seller (Hassan Textiles - Verified)

**Both (Buyer & Seller):**
- Email: `seller4@example.com`
- Password: `password123`
- Role: Both

### Test Steps:

#### 1. Login Test
1. Click "Login" button in the header
2. Enter email: `buyer1@example.com`
3. Enter password: `password123`
4. Click "Login"
5. ✅ Should see success toast message
6. ✅ Dialog should close
7. ✅ User info should appear in header

#### 2. Login Error Handling
1. Try logging in with wrong password
2. ✅ Should see error message: "Invalid email or password"
3. Try logging in with non-existent email
4. ✅ Should see error message

#### 3. Token Persistence
1. Login successfully
2. Refresh the page (F5)
3. ✅ Should still be logged in
4. ✅ User info should persist

#### 4. Logout Test
1. While logged in, click user menu
2. Click "Logout"
3. ✅ Should be logged out
4. ✅ Should redirect to home page

#### 5. Registration Test
1. Click "Sign Up" tab in auth dialog
2. Fill in the form:
   - Username: `testuser123` (must be unique)
   - First Name: `Test`
   - Last Name: `User`
   - Email: `testuser123@example.com` (must be unique)
   - Phone: `+923001234567` (optional)
   - Password: `testpass123` (min 8 characters)
   - Confirm Password: `testpass123`
   - Account Type: Select "Buyer"
3. Check "I agree to Terms" checkbox
4. Click "Create Account"
5. ✅ Should see success message
6. ✅ Should be automatically logged in
7. ✅ Dialog should close

#### 6. Registration Validation
Test these validation scenarios:

**Passwords Don't Match:**
- Enter different passwords in password fields
- ✅ Should show error: "Passwords do not match"

**Email Already Exists:**
- Try registering with `buyer1@example.com`
- ✅ Should show error: "User with this email already exists"

**Username Already Exists:**
- Try registering with username `buyer1`
- ✅ Should show error: "A user with that username already exists"

**Password Too Short:**
- Try password with less than 8 characters
- ✅ Should show error about password length

#### 7. Role-Based Access
1. Login as buyer (`buyer1@example.com`)
2. ✅ Should NOT see "Seller Dashboard" in menu
3. Logout and login as seller (`seller1@example.com`)
4. ✅ Should see "Seller Dashboard" in menu
5. Logout and login as both (`seller4@example.com`)
6. ✅ Should see both buyer and seller features

#### 8. Token Expiration Handling
1. Login successfully
2. Open browser DevTools > Application > Local Storage
3. Delete the `authToken` key
4. Try to access a protected page or make an API call
5. ✅ Should be redirected to home page
6. ✅ Should be logged out

## API Endpoints Being Used

### Login
- **Endpoint:** `POST /api/auth/login/`
- **Request:**
  ```json
  {
    "email": "buyer1@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "user": { /* user object */ },
    "token": "9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b"
  }
  ```

### Register
- **Endpoint:** `POST /api/auth/register/`
- **Request:**
  ```json
  {
    "username": "newuser",
    "email": "newuser@example.com",
    "password": "securepass123",
    "password_confirm": "securepass123",
    "first_name": "Ali",
    "last_name": "Raza",
    "phone_number": "+923001234567",
    "role": "buyer"
  }
  ```

### Logout
- **Endpoint:** `POST /api/auth/logout/`
- **Headers:** `Authorization: Token <token>`

### Get Profile
- **Endpoint:** `GET /api/auth/profile/`
- **Headers:** `Authorization: Token <token>`

## Troubleshooting

### Backend Not Responding
- Check if Django server is running on port 8000
- Check console for CORS errors
- Verify `VITE_API_BASE_URL` in `.env` file

### Token Not Persisting
- Check browser's Local Storage
- Look for `authToken` and `user` keys
- Clear Local Storage and try again

### Login Always Fails
- Verify backend is accessible at `http://localhost:8000`
- Check backend logs for errors
- Try the test users with exact credentials

### CORS Errors
- Make sure Django CORS settings allow `http://localhost:5173`
- Check `CORS_ALLOWED_ORIGINS` in Django settings

## Network Inspection

Use browser DevTools (F12) > Network tab to inspect:

1. **Request Headers:**
   - Should include `Authorization: Token <token>` for authenticated requests
   - Content-Type should be `application/json`

2. **Response Status:**
   - 200 OK - Success
   - 201 Created - Registration success
   - 400 Bad Request - Validation errors
   - 401 Unauthorized - Invalid credentials or token
   - 403 Forbidden - Account blocked

3. **Response Body:**
   - Check for error messages
   - Verify user data structure

## Success Criteria

✅ All test scenarios pass
✅ No console errors
✅ Proper error messages displayed
✅ Loading states work correctly
✅ Token persists across page refreshes
✅ Role-based features work correctly
✅ Logout clears all auth data
