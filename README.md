# Lab-Ease

## Overview
Lab-Ease is a web-based laboratory inventory manager and physical locater system. It is designed to help students, teaching assistants, and lab managers keep a live registry of lab instruments and chemicals, search through them in real-time, and pinpoint their physical storage locations using an interactive laboratory layout map.
## Features
**Digital Lab Registry:** A clean, spreadsheet-style dashboard to track instruments and chemicals. Easily log quantities, category types, storage drawers, and availability status (Available, Low Stock, Out of Stock).

**Interactive Storage Map:** A visual grid representation of the lab layout (incuding cabinet A, B, C, D and Refrigerator). Clicking the "Locate" button on any item instantly switches views and flashes the target cabinet and shelf in teal.

**Real-time Smart Search:** Instantly filter the inventory database by name, cabinet, shelf, or category as you type.

**Shared Cloud Database:** Built-in integration with Supabase so that data is synced across all devices. If a student updates a quantity on the lab computer, the changes are instantly visible to others on tablets or mobile devices.

## Known Bugs
**Chrome Extension CSP:** A harmless Content Security Policy Warning (`Tracking Prevention blocked access to storage`) may appear in the developer console due to strict browser tracking configurations attempting to block font assets from the FontAwesome CDN.

**Favicon 404:** A harmless `404 (Not Found)` warning will trigger for `/favicon.ico` on local servers if no custom browser tab icon file is present in the root folder.

**Locate Highlight Reset:** Fading animations for locater map highlights can occasionally clear pre-maturely if another locater command is fired rapidly.

## Tech Stack
### Frontend:
* HTML5 (Semantic Document Structure)

* CSS3 (Custom design system, HSL color tokens, responsive grids, and micro-animations)
* Javascript (ES6+, asynchronous API handling, client-side routing, DOM manipulation)
* FontAwesome (Icons Library)
* Google Fonts (Inter typeface)

### Database & Cloud:
* Supabase (PostgreSQL Database-as-a-Service)
* Supabase JS Client Library (Loaded via CDN)

## How to use? 
1. **View the Dashboard:** Check out the high-level metrics cards (Total Items, Instruments, Chemicals, Low Stock) and see the last 5 added items in the "Recently Logged Items" feed.
2. **Add Inventory:** Go to the "Inventory" tab and click **"Add Item"**. Fill out the modal form (Name, Type, Quantity, cabinet, Shelf, Status) and click Save to sync it to the cloud.
3. **Edit or Delete Items:** Click the pencil (edit) icon to open the form in edit mode, or trash (delete) icon to remove an item from the database.
4. **Locate on Map:** Search for an item using the search bar, click the map-location icon on its row, and watch the app navigate to the **Lab Locater** tab and flash the cabinet/shelf location.

## How to run locally
1. **Clone the repository:** git clone https://github.com/Chaudhary-G02/Lab-Ease

2. **Open the project folder:** Navigate into the project's frontend directory.
3. **Database Configuration:** Open app.js and paste your Supabase keys at top of the file:

`const SUPABASE_URL = 'your_supabase_project_url';`

`const SUPABASE_ANON_KEY = 'your_supabase_anon_key';`

4. **Run the Application:** Open index.html in your browser (we recommend using the VS Code Live Server extension to preview changes).

## AI Usage
**Database MIgration:** The transition of data storage from a local prototype (localstorage) to a real-time supabase database.

**Debugging & Code Reviews:** Assisted in resolving critical layout bugs.

## Future Plans
**User Role and Permissions:** Set up Clerk authentication and Supabase security rules so that only registered lab assistants can edit the database,  while students get read-only locater access.

**Chemical Hazard Warnings:** Automatically highlight hazardous or expired chemicals with visual caution badges.

**Cabinet Barcode Scanner:** Generate QR codes for storage cabinets so students can scan them on their phones to view all stored items.

## Screenshots
![alt text](<Screenshot 2026-07-01 210707.png>) ![alt text](<Screenshot 2026-07-01 210740.png>) ![alt text](<Screenshot 2026-07-01 210758.png>)
