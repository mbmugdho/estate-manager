## Adding a Real Admin User (On Client Delivery)

### Step 1 — Create the client's account
1. Go to Supabase Dashboard → **Authentication → Users**
2. Click **Add User → Create New User**
3. Enter the client's real email and a strong password
4. Click **Create User**

### Step 2 — Delete the demo account
1. Find `demo@estatemanager.com` in the users list
2. Click ⋯ → **Delete User**

### Step 3 — Remove demo box from login page
In `src/app/admin/login/page.tsx`:
- Delete the `fillDemo()` function
- Delete the dark navy demo credentials box JSX block
- Remove `KeyRound` from the lucide-react import

### If client forgets password later
1. Supabase Dashboard → **Authentication → Users**
2. Find their email → click ⋯ → **Send Password Recovery Email**