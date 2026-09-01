# Digital Swasthya Healthcare Platform

Digital Swasthya is a unified digital health ecosystem designed to model India's structured public healthcare tiers under the Ayushman Bharat Digital Health Mission (ABDM). 

This platform connects patients, primary health centres, district general hospitals, and state super-specialty research centres in a single continuous care pathway, mapping the patient journey from rural clinics to specialized urban interventions.

---

## Features

1. **Patient Portal**: Generate a 14-digit ABHA (Ayushman Bharat Health Account) Card, book consultations, review diagnostic reports, check local generic medicine stock levels, access securing physician chat, and query the **HealthAssist AI symptom helper**.
2. **Doctor Portal**: Manage outpatient queue lists, review full E-Health diagnostic records (ECG waveforms, Echo logs), write digital e-prescriptions, and author referral transfer slips.
3. **Hospital Portal**: Track live bed availability, manage pharmacy stock inventory with low-stock alerts, and triage inbound referral admissions.
4. **Admin Portal**: Platform-wide audit logs tracking medical events, practitioner registries, and diagnostic distributions.

---

## 1. How to Install

Ensure you have [Node.js](https://nodejs.org/) installed (version 18+ is recommended).

Clone or navigate into the project directory and install the required dependencies:

```bash
cd digital-swasthya
npm install
```

---

## 2. How to Run Locally

Start the Vite development server:

```bash
npm run dev
```

The application will run locally, usually at [http://localhost:5173/](http://localhost:5173/).

---

## 3. Project Structure

```
digital-swasthya/
├── src/
│   ├── components/         # Reusable UI controls (Button, Card, Input, Modal, Badge, Alert)
│   ├── context/            # Global State Providers (Auth, Language, Theme, HealthStore)
│   ├── data/               # Mock datasets representing the Indian tier pipeline
│   ├── layouts/            # Public navbar wrappers and Role-based Dashboard panels
│   ├── pages/              # Portal screens (public, patient, doctor, hospital, admin)
│   ├── routes/             # AppRouter mappings
│   ├── App.tsx             # Root component chaining providers
│   ├── index.css           # Tailwind CSS imports & @theme settings
│   └── main.tsx            # DOM mounting entrypoint
├── postcss.config.js       # PostCSS processor settings (Tailwind v4 compatible)
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite compiler settings
```

---

## 4. Available Routes

### Public Web Routes
- `/` - Landing Page containing the Indian healthcare tier timeline
- `/about` - Core description of the ABDM three-tier model
- `/services` - Medical offering catalog sorted by care levels (PHC, CHC, Specialist)
- `/doctors` - Search and filters for registered medical officers
- `/hospitals` - Hospital lookup with live bed trackers
- `/login` - Role-based Sign In console
- `/register` - Aadhaar verification and 14-digit ABHA card generator

### Authenticated Portal Routes
- `/portal/patient` - Patient Dashboard showing ABHA card and Swasthya Journey Tracker
- `/portal/patient/book` - Appointment scheduler
- `/portal/patient/records` - Pathology report and ECG file downloads
- `/portal/patient/prescriptions` - Generic drugs check and pharmacy stock checker
- `/portal/patient/chat` - Practitioner chat
- `/portal/patient/bot` - HealthAssist AI symptoms & PM-JAY policy bot
- `/portal/doctor` - Physician OPD dashboard queue
- `/portal/doctor/patients` - Comprehensive diagnostic reviews and prescription authoring
- `/portal/doctor/referrals` - Referral writer
- `/portal/doctor/schedule` - Work schedule planner
- `/portal/hospital` - Bed occupancy status and inbound triage
- `/portal/hospital/inventory` - Pharmacy database with low-stock warnings
- `/portal/hospital/h2h` - Inter-facility admissions chat
- `/portal/admin` - Central statistics panel
- `/portal/admin/users` - Doctor licence registry approvals
- `/portal/admin/audit` - Chronological security ledger

---

## 5. Mock Authentication

To simplify testing, the login screen includes presets that let you log in as pre-configured accounts:
- **Patient**: `patient@swasthya.in` (Rajesh Kumar)
- **Doctor**: `doctor@swasthya.in` (Dr. Arvind Sharma)
- **Hospital Staff**: `hospital@swasthya.in` (Shimla General Hospital Admissions Desk)
- **Admin**: `admin@swasthya.in` (National Registry Director)

*Developer Toolbar:* A floating simulator bar remains visible at the top during testing, allowing you to switch roles instantly to trace the clinical workflow.

---

## 6. How to Replace Mock Data with an API

The platform uses `HealthStoreContext.tsx` to handle read/write states. To replace this with a live API:

1. Create an API client helper (e.g. using `axios` or native `fetch`):
   ```typescript
   // src/utils/api.ts
   export const fetchReferrals = async () => {
     const response = await fetch('/api/referrals');
     return response.json();
   };
   ```
2. Replace state loading inside `HealthStoreProvider` with `useEffect` calls:
   ```typescript
   useEffect(() => {
     fetchReferrals().then(data => setReferrals(data));
   }, []);
   ```
3. Update mutation functions (like `createReferral` or `bookAppointment`) to post back to the server:
   ```typescript
   const createReferral = async (refData) => {
     const response = await fetch('/api/referrals', {
       method: 'POST',
       body: JSON.stringify(refData)
     });
     const savedReferral = await response.json();
     setReferrals(prev => [savedReferral, ...prev]);
   };
   ```

---

## 7. How to Add New Languages

Internationalization keys are mapped in `src/context/LanguageContext.tsx`. To add a new language (e.g. Bengali):

1. Open `src/context/LanguageContext.tsx`.
2. Add the language identifier in the type definition:
   ```typescript
   type Language = 'en' | 'hi' | 'bn';
   ```
3. Expand the `translations` object dictionary with the corresponding key translations:
   ```typescript
   const translations: Record<Language, Record<string, string>> = {
     en: { ... },
     hi: { ... },
     bn: {
       'nav.home': 'হোম',
       'nav.about': 'আমাদের সম্পর্কে',
       'landing.title': 'ডিজিটাল স্বাস্থ্য',
       // Add all keys...
     }
   };
   ```
4. The multilingual selector in headers will automatically update.

---

## 8. How to Build for Production

Generate compiled static build files in the `dist` directory:

```bash
npm run build
```

This commands compiles TypeScript declarations and bundles assets using Vite. To preview the production bundle locally:

```bash
npm run preview
```
