# GameX - Premium Esports Tournament Platform

GameX is a premium, production-ready gaming and tournament matchmaking web application. The frontend is built using Next.js 15+ App Router, styled with Tailwind CSS, and powered by TanStack Query for modern clientside caching.

The application features a clean API abstraction layer that simulates real-world network latency and state mutations, making it ready to be linked to a FastAPI (Python) backend with minimal changes.

---

## 🎮 Features

- **Dynamic Homepage**: High-stakes metrics counters, active game lobbies, top ranked players, verified league hosts, newsletter forms, and gaming gear merch store listings.
- **Tournaments Lobby**: Search indexing and filters to query tournaments by game, entry fee structure, and status (Upcoming, Live, Completed). Supporting list and grid display toggles.
- **Tournament Details**: Rules specifications, prize pool breakdowns, and an interactive **bracket matchmaking tree** visualizing player pairings and qualifiers across multiple rounds.
- **Create Tournament Wizard**: A 5-step interactive form flow to specify names, rules, entry details, match schedules, and review.
- **Organizer Dashboard**: Interface allowing tournament creators to approve, reject, or remove entrants, post broadcasts, and manage active brackets.
- **My Tournaments HUB**: Dashboard listing a player's registered, hosted, draft, and completed tournaments.
- **Global Leaderboards**: Rank boards detailing player XP standings, win rates, and levels.
- **Community Forum**: LFG threads, tagging filters, topics likes, and comments.
- **Settings & Profile**: Wallet linking, customization preferences, badge collections, and XP growth visualizations.
- **Looping Video Background Login**: Slidable overlay authentication form with transition panels.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15+ (App Router, Turbopack compiler)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, next-themes (Forced dark mode)
- **Animations**: Framer Motion
- **State Management & Caching**: TanStack Query (React Query)
- **Forms**: React Hook Form & Zod (For schemas validation)
- **Charts**: Recharts (Player statistics)
- **Icons**: Lucide React
- **Notifications**: Sonner (toasts)

---

## 📁 Folder Structure

```text
├── public/                 # Static assets (MP4 video background, local images, fonts)
├── src/
│   ├── app/                # Next.js App Router (Layouts & Pages)
│   ├── components/         # Reusable layouts, cards, and UI components
│   ├── lib/                # Shared utilities & cn classmerges
│   ├── mock/               # In-memory mock database generators
│   ├── providers/          # QueryClient & Dark Theme providers
│   ├── services/           # Asynchronous API mock services layer
│   └── types/              # TypeScript interface definitions
├── postcss.config.mjs      # Tailwind CSS preprocessor
├── tsconfig.json           # Compiler rules
└── next.config.ts          # Next.js framework configuration
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have Node.js (v18+) installed.

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the local development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

3. Compile the production optimized build:
   ```bash
   npm run build
   ```
