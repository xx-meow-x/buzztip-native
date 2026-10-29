# BuzzTip 
Web version of BuzzTIP. Hosted through Firebase.

## Steps to host through Expo Go:
1. Create the app and run this command in your terminal:

```bash
npx create-expo-app@latest buzztip-native --template blank-typescript
cd buzztip-native

# copy everything from this folder over it (App.tsx, app.json, tsconfig.json, src/, rules, functions/, scripts/ ...)
# delete the template's own App.tsx if it asks about overwriting. THEN:
```bash
npx create-expo-app@latest buzztip-native --template blank-typescript
cd buzztip-native
# copy everything from this folder over it (App.tsx, app.json, tsconfig.json, src/, rules, functions/, scripts/ ...)
# delete the template's own App.tsx first if it asks about overwriting

npx expo install firebase @react-native-async-storage/async-storage react-native-svg \
  expo-image-picker expo-font expo-status-bar @expo-google-fonts/figtree @expo-google-fonts/bricolage-grotesque \
  @react-navigation/native @react-navigation/native-stack react-native-screens \
  react-native-safe-area-context @react-native-community/datetimepicker
```

`npx expo install` picks the versions that match your Expo SDK. I used Expo ver. ~57 because it was returning an unsupported version error in Expo Go. If the font import names in
`App.tsx` error, open the package in `node_modules/@expo-google-fonts/...` and match the export names.

## Firebase setup

1. Firebase console > add a **Web app** > copy its config into `.env` 
2. **Authentication** > Sign-in method > enable **Email/Password**.
3. **Firestore Database** and **Storage** (currently deprecated. this one requires a subscription)
4. Deploy the rules (locking the app to TIP emails)
   ```bash
   npm i -g firebase-tools && firebase login && firebase use --add
   firebase deploy --only firestore:rules,storage
   ```
5. Run: `npx expo start`

## 3. How the @tip.edu.ph lock works

| Layer | What it does | Needed? |
|---|---|---|
| App check (`src/lib/auth.js`) | Rejects non-TIP emails on the form. Friendly errors only. **Not security**: anyone can bypass the app. | UX |
| Email verification (`AuthContext`, `VerifyEmail`) | Proves the person owns that @tip.edu.ph inbox. Without it anyone could type someone else's address. | Yes |
| **Security rules** (`firestore.rules`, `storage.rules`) | Every read/write requires `email_verified == true` AND an email ending in `@tip.edu.ph`, checked on Google's servers on every request. This is the real gate. | **Yes** |
| Blocking function (`functions/index.js`) | Refuses to even create non-TIP accounts. Keeps your user list clean. | Optional |

The optional blocking function needs Authentication upgraded to **Identity Platform** and the **Blaze**
plan. Deploy: `cd functions && npm install && cd .. && firebase deploy --only functions`.

Later, the student account number can be a fifth layer: a Cloud Function checks it against the
registrar's records and sets a custom claim; add `&& request.auth.token.verifiedStudent == true`
to `isTip()` in both rules files.

IMPORTANT: Before launch, turn on **App Check** (Firebase console) so only the original copy of BuzzTIP to Firebase.

## 4. Admins (announcements)

Only admins can post announcements (the option is silently hidden for everyone else).
Make one: see the steps at the top of `scripts/set-admin.js`.

## 5. Course group chats

`src/lib/enrollment.js` returns no courses until you connect the registrar. Possible future addition: a Cloud Function
looks up a student's courses by account number, creates the course group if missing (a `groups` doc with
`isCourse: true`, `course: "CS 301"`, plus its `conversations/c_<groupId>` doc with the same fields) and adds the student's uid to
`memberIds` on **both** docs. The rules block the app itself from joining or leaving course groups.

## 6. TypeScript

Strict mode is on. The whole project type-checks with zero errors (`npx tsc --noEmit`), verified against the real
React Native, Firebase, React Navigation and Expo type definitions.

- `src/types.ts` holds every Firestore data model (`Group`, `Conversation`, `Post`, ...), the screen list
  (`RootStackParamList`) and the sheet props. Change a field there and the compiler shows everything it breaks.
- `tsconfig.json` has one `paths` entry that points `@firebase/auth` at its React Native typings. Firebase ships
  web typings by default, which would hide `getReactNativePersistence`. Keep it.
- `functions/` and `scripts/` stay plain JavaScript (they run on Node, not in the app).

## 7. Data model

`users/{uid}` (+ `reminders/`, `wallMine/` private subcollections), `groups`, `conversations/{id}/messages`
(DM id `dm_<uidA>_<uidB>`, group chat id `c_<groupId>`), `posts`, `announcements`, `events`, `listings`,
`lostFound`, `wall`. Photos go to Storage under `avatars/<uid>/` and `listings/<uid>/`.

## 8. Known limits


- Photo uploads are unavailable due to Firebase limitations; built-in bee and flower profile avatars can still be selected.
- Unread is only a gold dot and not a count. The Chats tab badge counts chats with something new.
- Everything subscribes at sign-in (capped lists). For thousands of users, move each subscription into its screen and paginate.
- Display names are copied into posts and chats when created, so renaming yourself doesn't update old ones.
- Freedom Wall posts have no author field in the database. Admins can delete abusive posts but not see who wrote them.


## 9. Put it on the web (Firebase Hosting)

Works on any phone or computer browser, nothing to install. Run from the project folder, one command per line:

```
npx expo install react-dom react-native-web @expo/metro-runtime
npx expo export --platform web
firebase deploy --only hosting
```

Firebase prints a `https://<project-id>.web.app` link to share. Notes:

- People can use "Add to Home screen" in their mobile browser for an app-like icon.
- The export reads the `.env` at build time, so run it on the computer that has the `.env` file.
- Redeploy (the last two commands) after every change. Phones running the app through Expo Go see changes live, the website does not.
- If the deploy says there is no Hosting site, open Hosting in the Firebase console and press Get started once.
- On wide screens the app shows as a centered phone-width column. Phones show it full screen.

