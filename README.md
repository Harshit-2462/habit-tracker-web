# 🦇🎀 BatKitty Habit Tracker — Full Stack Web App (Batman × Hello Kitty Theme)

A full-stack, responsive, and gamified Habit Tracker web application fusing **Gotham Dark Knight** aesthetics with **Hello Kitty Pink & Cute** accents. Powered by React, Vite, TypeScript, Tailwind CSS, Framer Motion, Recharts, and Supabase.

---

## 👨‍💻 Developer & Author

**Designed & Developed by Harshit Upadhya** 🦇🎀
- **GitHub Profile**: [https://github.com/Harshit-2462](https://github.com/Harshit-2462)
- **Project Repository**: [https://github.com/Harshit-2462/habit-tracker-web](https://github.com/Harshit-2462/habit-tracker-web)

---

## 🎨 Theme & Aesthetic Highlights

- **Dark Gotham Palette**: Deep obsidian black (`#0a0a0d`), slate card surfaces, Bat-Signal yellow (`#F4D03F`), and Gotham violet (`#9B51E0`).
- **Hello Kitty Accents**: Soft & neon pink (`#FF69B4`, `#FFB6C1`), cute bow badges (`🎀`), micro-animations, and floating star dust particles.
- **Glassmorphism & Neon Glow**: Dynamic backdrop blur, glowing borders, and particle effects.
- **Gamification**: Level ranks (Rookie Gotham Paws → Dark Knight Meow → Kitty Bat Overseer), XP system, coin rewards, daily mystery supply crate, streak flame animation, and confetti bursts.

---

## ⚡ Live Supabase Credentials Configured

This project is pre-configured with the live Supabase credentials provided:

```env
VITE_SUPABASE_URL=https://mplokisnrnthstxupyoh.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_HB8xjfMZBU6fYVZKj1Xwuw_uMX3WUGV
```

### 🗄️ Setting Up Supabase Database Tables

1. Open your Supabase SQL Editor at [https://mplokisnrnthstxupyoh.supabase.co](https://mplokisnrnthstxupyoh.supabase.co).
2. Copy and paste the contents of `supabase/schema.sql` into the SQL Editor and click **Run**.
3. Copy and paste the contents of `supabase/seed.sql` into the SQL Editor and click **Run** to load default categories & achievements.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```

The application will launch locally at `http://localhost:3000`.

### 3. Build for Production
```bash
npm run build
```

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
| --- | --- |
| `N` | Create New Habit |
| `D` | Go to Dashboard |
| `H` | Go to Habits Management |
| `C` | Go to Calendar & Heatmap |
| `A` | Go to Analytics & Charts |
| `S` | Go to Settings |
| `?` | Open Shortcuts Helper |

---

## 📁 Project Structure

```
batkitty-habit-tracker/
├── index.html
├── package.json
├── vite.config.ts
├── .env
├── public/
├── src/
│   ├── components/
│   │   ├── analytics/
│   │   ├── calendar/
│   │   ├── common/
│   │   ├── dashboard/
│   │   ├── gamification/
│   │   ├── habits/
│   │   ├── layout/
│   │   └── settings/
│   ├── contexts/
│   ├── hooks/
│   ├── lib/
│   ├── pages/
│   ├── services/
│   ├── types/
│   └── utils/
└── supabase/
    ├── schema.sql
    └── seed.sql
```
