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
    *This creates the initial Admin user and default settings.*

### D. File Permissions
Ensure the web server can write to logs and cache:
sudo chmod -R 775 storage bootstrap/cache
```

### E. Nginx Configuration (Critical)
To avoid 404 errors, use this **Single Root Strategy**.
Create `/etc/nginx/sites-available/new-client` with this exact content:

```nginx
server {
    listen 80;
    server_name app.new-hall.com;
    root /var/www/new-client-booking/backend/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php index.html;

    charset utf-8;

    # Handle React Frontend (Fallthrough to index.php)
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    # Handle PHP/Laravel
    location ~ \.php$ {
        fastcgi_pass unix:/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
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
