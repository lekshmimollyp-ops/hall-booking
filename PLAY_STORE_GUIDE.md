# Publishing to Google Play Store
**Prerequisite:** You need a Google Play Developer Account ($25 one-time fee).

## 1. Prepare the Production Build
The Play Store requires an **App Bundle (.aab)**, NOT an APK.

1.  Open your terminal in the `mobile` folder.
2.  Run the production build command:
    ```powershell
    npx eas-cli build --platform android --profile production
    ```
3.  **Wait**: This build takes longer.
4.  **Download**: When finished, it will give you a link to an `.aab` file. **Download this file.**

## 2. Create the App on Console
1.  Go to [Google Play Console](https://play.google.com/console).
2.  Click **Create App**.
3.  **App Name**: "Hall Booking Data Entry".
4.  **Language**: English.
5.  **App or Game**: App.
6.  **Free or Paid**: Free.

## 3. Upload the Bundle
1.  In the Console sidebar, go to **Testing** > **Internal testing** (or **Production** if you are ready to go live immediately).
2.  Click **Create new release**.
3.  **App bundles**: Upload the `.aab` file you downloaded.
4.  **Release Name**: e.g., "1.0.0 Initial Release".
5.  Click **Next** and **Save**.

## 4. Store Listing (Required)
You must fill out the Store Listing before you can release:
*   **Short Description**: "Hall Booking Management System for Staff."
*   **Full Description**: "Manage hall reservations, track payments, and view reports..."
*   **Graphics**:
    *   **App Icon**: 512x512 px (PNG).
    *   **Feature Graphic**: 1024x500 px (PNG).
    *   **Screenshots**: Upload at least 2 screenshots of your app.

## 5. Privacy Policy
*   You must provide a URL to a Privacy Policy.
*   Since this is an internal app, you can host a simple page on your website (e.g., `https://app.mthall.com/privacy`) stating that you only collect data for business logic.

## 6. Review & Publish
1.  Go to **Review and release**.
2.  Google will review your app (takes 1-5 days).
3.  Once approved, it will be live on the Play Store!
