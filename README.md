# Do Note
A Google Keep like note taking app with some rich text formating options inspired from Notion and some more improvements. Currently a work in progress.

---

## Main Features that have to be implemented

- [X] Paste image from clipboard, positioned within the text
- [ ] Voice to text
- [ ] Works offline

---  

## To run the app
1. Install all the dependencies with: `npm install`.
2. Create a firebase project and add the following config variables in a .env file:
```env
NEXT_PUBLIC_apiKey = {api_key}
NEXT_PUBLIC_authDomain = {auth_domain}
NEXT_PUBLIC_projectId = {project_id}
NEXT_PUBLIC_storageBucket = {storage_bucket}
NEXT_PUBLIC_messagingSenderId = {messaging_sender_id}
NEXT_PUBLIC_appId = {app_id}
NEXT_PUBLIC_measurementId = {measurement_id}
```
3. Create a .env.local file and add the following:
```env
COOKIE_SECRET_CURRENT = {secret_string}
COOKIE_SECRET_PREVIOUS = {secret_string}
FIREBASE_PRIVATE_KEY = {firebase_private_key}
```
4. Run the project in development with: `npm run dev`.