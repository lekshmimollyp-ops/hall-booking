# Mobile App Build Guide (Step-by-Step)

This guide will help you turn your code into an Android App (`.apk` file) that you can install on your phone.

### ⚠️ Prerequisites
1.  **Node.js**: You already have this (since you're running the project).
2.  **Expo Account**: You need a free account at [expo.dev](https://expo.dev/signup). **Sign up now if you haven't.**

---

### Step 0: ⚠️ CRITICAL CHECK (Don't Skip)
Before you build, you **MUST** check one file.
1.  Open `mobile/constants/Config.js`.
2.  Make sure the line says:
    ```javascript
    export const API_URL = 'https://app.mthall.com/api';
    ```
    *   **If it says `192.168...` (Localhost)**: The app will NOT work. Change it to the real website address.

---

### Step 1: Open Terminal in Correct Folder
1.  Open your VS Code Terminal.
2.  Run this exact command to go to the mobile folder:
    ```powershell
    cd "c:\Users\Lekshmi M\Documents\velosit\retalinepro\static-websites\hall-booking\mobile"
    ```

### Step 2: Login to Expo
You need to connect your terminal to your Expo account.
Run this command:
```powershell
npx eas-cli login
```
*   It will ask for your **Email** and **Password** (the ones you used to sign up on expo.dev).
*   Type them in and press Enter.

### Step 3: Start the Build
Now, we tell Expo to build the app for Android.
Run this command:
```powershell
npx eas-cli build --platform android --profile preview
```

### 🗒️ What will happen next?
1.  **Keystore**: It might ask `"Would you like to generate a new Android Keystore?"`
    *   **Type `Y` and press Enter.** (This is your app's digital signature).
2.  **Upload**: It will compress your code and upload it to Expo's servers.
3.  **Waiting**: The build happens in the cloud. It usually takes **10 to 20 minutes**.
    *   You can close the terminal if you want, but keep it open to see the progress.
4.  **Download**: When it's done, it will give you a **link** (e.g., `https://expo.dev/artifacts/...`).
    *   Click that link to download the `.apk` file.
    *   Send that file to your phone and install it!

### ❌ If it fails...
*   **Error**: "You are not logged in." -> Run `npx eas-cli login` again.
*   **Error**: "EAS project not found." -> Run `npx eas-cli init` and choose the default options.

---
**Ready?** Go to Step 1 and run the commands!
