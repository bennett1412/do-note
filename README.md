# Do Note

A Google keep notes variation with a rich text editor and some more improvements. Currently a work in progress.

---

Main Features that have to be implemented

- [ ] Paste image from clipboard, positioned within the text
- [ ] Voice to text
- [ ] Works offline

---

## To run the app

1. Install all the dependencies with: `npm install`
2. Create a firebase project and add the following config variables in a .env file

```env
VITE_apiKey = _add_api_key_here_
VITE_authDomain = _domainName_
VITE_projectId: _projectId_
VITE_storageBucket = _storagebucket_
VITE_messagingSenderId = _senderid_
VITE_appId = _appid_
VITE_measurementId = _measurement_id
```

3. run the project in development with: `npm run dev`
