# Do Note
A Google Keep like note taking app with some rich text formating options inspired from Notion and some more improvements, will be integrated to a sticky note browser extension (a work in progress 😅). 

---

## Main Features that have to be implemented

- [X] Paste image from clipboard, positioned within the text
- [ ] Voice to text
- [ ] Works offline

---  

## To run the app
1. Install all the dependencies with: `pnpm install`.
2. Create a supabase project and add the following config variables in a .env file:
```env
NEXT_PUBLIC_SUPABASE_URL = {supabase_url}
NEXT_PUBLIC_SUPABASE_ANON_KEY = {secret_key}
```
4. Run the project in development with: `pnpm run dev`.