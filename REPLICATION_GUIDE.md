# Hall Booking System - Client Replication Guide
**Purpose:** This document outlines the steps to deploy the "Hall Booking Data Entry System" for a new client (e.g., a different Hall or Auditorium).

## 1. Preparation
Before starting, ensure you have:
*   **A Cloud Server**: AWS EC2 (Ubuntu 22.04 recommended) or DigitalOcean Droplet.
*   **Domain Name**: (e.g., `new-hall.com` or `app.new-hall.com`).
*   **SSL Certificate**: (Free via Let's Encrypt / Certbot).


## 2. Infrastructure Setup (Ubuntu 22.04)
Run these commands on your fresh server to install the necessary software.

```bash
# Update and Install Nginx, Git, Unzip
sudo apt update && sudo apt upgrade -y
sudo apt install -y nginx git unzip curl

# Install PHP 8.2 (Required for Laravel 11)
sudo add-apt-repository ppa:ondrej/php -y
sudo apt update
sudo apt install -y php8.2 php8.2-fpm php8.2-pgsql php8.2-curl php8.2-xml php8.2-mbstring php8.2-zip php8.2-bcmath

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
```

## 3. Backend Deployment (Server)
### A. Clone & Install
1.  Clone the repository to `/var/www/new-client-booking`.
2.  Install Backend Dependencies:
    ```bash
    cd backend
    composer install --optimize-autoloader --no-dev
    ```

### B. Configuration (.env)
1.  Copy `.env.example` to `.env`.
2.  Update the following critical values:
    ```ini
    APP_NAME="New Hall Name"
    APP_URL=https://app.new-hall.com
    DB_DATABASE=new_hall_db
    DB_USERNAME=...
    DB_PASSWORD=...
    ```

### C. Database Setup
1.  Create the new database in PostgreSQL.
2.  Run Migrations and Seeders:
    ```bash
    php artisan migrate --seed
    ```
    *This creates the initial Admin user, default settings, and sets up payment mode constraints.*

3.  **Verify Payment Modes** (Important):
    ```bash
    php artisan tinker
    ```
    ```php
    DB::table('incomes')->select('payment_mode')->distinct()->get();
    exit
    ```
    *The system supports 6 payment modes: `cash`, `card`, `upi`, `bank_transfer`, `cheque`, `other`*
    *All payment modes must be lowercase for database compatibility.*

4.  **Note on Branding**:
    *The system features **dynamic branding** - the login page and application title automatically display the center name from the database. No need to edit frontend code for each client!*
    *The center name is set when you create the center record in the database.*

5.  **Create Expense Categories** (Required):
    ```bash
    php artisan tinker
    ```
    ```php
    $center = App\Models\Center::first();
    
    $categories = ['Cleaning', 'Electricity', 'Maintenance', 'Staff Salary', 'Supplies', 'Other'];
    foreach ($categories as $cat) {
        App\Models\ExpenseCategory::create([
            'center_id' => $center->id,
            'name' => $cat,
            'status' => 'active'
        ]);
    }
    echo "Expense categories created!\n";
    exit
    ```
    *This creates the default expense categories needed for the Expenses module.*

6.  **Assign Users to Halls** (Required for Access Control):
    ```bash
    php artisan tinker
    ```
    ```php
    // Assign all users to all halls in their centers
    $users = App\Models\User::with('centers')->get();
    
    foreach ($users as $user) {
        foreach ($user->centers as $center) {
            $halls = App\Models\Resource::where('center_id', $center->id)->pluck('id');
            $user->resources()->syncWithoutDetaching($halls);
        }
    }
    
    echo "Users assigned to halls!\n";
    exit
    ```
    *This assigns all existing users to all halls in their centers, preserving current access levels.*
    
    **Important Notes on Hall-Based Access Control:**
    - **Admin users** automatically have access to all halls in their centers
    - **Staff users** can only access halls they are assigned to
    - Users can be assigned to multiple halls
    - Hall assignments are managed via the Users page in the admin panel
    - Events, expenses, and income are filtered by accessible halls
    - When creating a new user, you MUST assign at least one hall

### D. File Permissions
Ensure the web server can write to logs and cache:
```bash
sudo chmod -R 775 storage bootstrap/cache
```

### E. Nginx Configuration (Critical)
**IMPORTANT:** This configuration ensures static assets (JS/CSS) are served correctly while routing API calls to Laravel.

Create `/etc/nginx/sites-available/new-client` with this exact content:

```nginx
server {
    listen 80;
    server_name app.new-hall.com;
    root /var/www/new-client-booking/backend/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.html;

    charset utf-8;

    # Serve static assets directly (JS, CSS, images, etc.)
    # This prevents them from being routed to index.html
    location /assets/ {
        try_files $uri =404;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API routes go to Laravel
    location /api {
        try_files $uri $uri/ /index.php?$query_string;
    }

    # Handle PHP/Laravel
    location ~ \.php$ {
        fastcgi_pass unix:/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    # Frontend SPA routing - serve index.html for all other routes
    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```
Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/new-client /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo systemctl restart nginx
```

## 4. Frontend Deployment (Web)
### A. Build the React App
1.  On your local machine (or build server), open `frontend`.
2.  (Optional) Update branding colors in `tailwind.config.js` or `index.css`.
3.  Run Build:
    ```powershell
    npm install
    npm run build
    ```
4.  **Upload**: Copy the contents of `frontend/dist` to the server's `backend/public` folder.
    *   *Note: We use the "Single Root Strategy" where Laravel serves the React Frontend.*

## 5. Mobile App Customization (Android)
To give the new client their own App:

### A. Update Connection
1.  Open `mobile/constants/Config.js`.
2.  Change `API_URL` to the **New Client's Domain**:
    ```javascript
    export const API_URL = 'https://app.new-hall.com/api';
    ```

### B. Update Identity
1.  Open `mobile/app.json`.
2.  Change these fields:
    *   `name`: "New Hall App"
    *   `slug`: "new-hall-app"
    *   `android.package`: "com.velosit.newhall"

### C. Build
Run the build command:
```powershell
npx eas-cli build --platform android --profile production
```

## 6. Final Checklist
- [ ] Is the Domain pointing to the new server?
- [ ] Is SSL enabled?
- [ ] Can the Admin log in?
- [ ] Does the Mobile App assume the correct Branding?
- [ ] Can you create a booking with advance payment?
- [ ] Can you add payments with all 6 payment modes (cash, card, upi, bank_transfer, cheque, other)?
- [ ] Are there any SQL constraint errors when saving payments?

## 7. Troubleshooting

### Payment Mode Errors
If you see SQL errors about payment_mode constraints:

1. **Check EventController.php** (line 94):
   - Must use lowercase: `'cash'` not `'Cash'`

2. **Verify database constraint**:
   ```bash
   php artisan tinker
   ```
   ```php
   DB::select("SELECT constraint_name, check_clause FROM information_schema.check_constraints WHERE constraint_name = 'incomes_payment_mode_check'");
   ```

3. **Supported payment modes** (all lowercase):
   - `cash` - Cash payments
   - `card` - Credit/Debit card
   - `upi` - UPI/Digital wallets
   - `bank_transfer` - Bank transfers
   - `cheque` - Cheque payments
   - `other` - Other methods

