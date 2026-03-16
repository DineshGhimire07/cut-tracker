# Personal Fat-Loss Tracking Dashboard — Roadmap

> A premium, private body recomposition command center for disciplined cutting.
> Not a generic fitness app. Not a public SaaS. Not a childish AI-looking UI.
> A serious personal operating system for fat-loss tracking, decision support, and progress analytics.

---

## Table of Contents

1. [Core Purpose](#1-core-purpose)
2. [Design Direction](#2-design-direction)
3. [Brand & Visual Identity](#3-brand--visual-identity)
4. [App Structure & Pages](#4-app-structure--pages)
5. [User Baseline (Preloaded)](#5-user-baseline-preloaded)
6. [Page-by-Page Specifications](#6-page-by-page-specifications)
7. [Scoring Systems](#7-scoring-systems)
8. [Decision Logic Engine](#8-decision-logic-engine)
9. [Dashboard Components](#9-dashboard-components)
10. [Data Model](#10-data-model)
11. [Seeded Demo Content](#11-seeded-demo-content)
12. [Insight Card Examples](#12-insight-card-examples)
13. [Technical Architecture](#13-technical-architecture)
14. [Responsiveness Guidelines](#14-responsiveness-guidelines)
15. [Anti-Patterns (What NOT to Do)](#15-anti-patterns-what-not-to-do)
16. [Implementation Phases](#16-implementation-phases)

---

## 1. Core Purpose

Create a **14-day fat-loss tracker** with:

- Strong daily logging
- Weekly review logic
- Progress analytics & body trend visualization
- Clean decision-support system

The dashboard must help the user:

- Track whether fat loss is **actually happening**
- Identify **inconsistency** in tracking or adherence
- Avoid **emotional reactions** to single-day scale changes
- Make data-driven decisions after collecting clean data

### Philosophy

> This app must not just collect data. It must **interpret data properly**.

Priorities:

| Priority | Over |
|---|---|
| Weekly average weight | One-day readings |
| Consistency | Perfection |
| True tracking | Guessed tracking |
| Trend analysis | Emotional reaction |
| Hidden calorie awareness | Surface-level logging |
| Fat-loss decision logic after 14 days | Premature conclusions |

---

## 2. Design Direction

| Attribute | Guideline |
|---|---|
| Theme | Dark by default |
| Layout | Clean grid, desktop-first |
| Glassmorphism | Subtle only — no blur overload |
| Style | Minimal, sharp, structured, premium |
| Feel | Disciplined, masculine, focused, performance-oriented |
| Transitions | Smooth, polished hover states, elegant spacing |
| Hierarchy | Clear visual hierarchy at every level |
| No | Cartoonish cards, fake AI gradients, neon overload |
| No | "AI-generated website" feel |
| No | Template-based look |

---

## 3. Brand & Visual Identity

### Color Palette

| Role | Color |
|---|---|
| Background | Deep charcoal / near-black (#0D0D0F, #111114) |
| Surface | Dark slate / elevated card (#1A1A1F, #222228) |
| Border | Subtle steel (#2A2A30) |
| Primary text | Off-white (#E8E8EC) |
| Secondary text | Muted gray (#8A8A95) |
| Accent (primary) | Muted red / crimson (#C4343A, #A82D33) |
| Accent (secondary) | Steel blue (#5A7A9A) |
| Success | Muted green (#3DA66B) |
| Warning | Muted amber (#D4943A) |
| Danger | Deep red (#C43A3A) |

### Typography

- Primary font: **Inter** or **Outfit** (clean, modern, premium)
- Monospace for data: **JetBrains Mono** or **IBM Plex Mono**
- Strong hierarchy: clear H1–H4 sizing with tight line-heights
- No browser defaults

### Iconography

- Clean, minimal line icons (Lucide, Phosphor, or Heroicons)
- No emoji, no cartoonish icons
- Consistent stroke width and sizing

---

## 4. App Structure & Pages

```
├── 1. Overview Dashboard        — Home / command center
├── 2. Daily Check-In            — Serious daily input form
├── 3. 14-Day Tracker            — Visual phase board/timeline
├── 4. Progress Analytics        — Interactive charts & trends
├── 5. Body Metrics              — Weight, waist, trend tracking
├── 6. Nutrition Tracking        — Calories, macros, hidden calorie system
├── 7. Activity & Training       — Steps, workouts, burn reference
├── 8. Weekly Review             — Auto-generated 7-day summaries
├── 9. Progress Photos           — Private photo gallery & comparisons
└── 10. Settings / Baseline      — Profile, targets, preferences
```

---

## 5. User Baseline (Preloaded)

| Field | Value |
|---|---|
| Age | 21 |
| Height | 172 cm |
| Weight | 74–75 kg |
| Goal | Fat loss while maintaining muscle |
| Gym frequency | 6 days/week |
| Daily steps (current) | ~5,000 |
| Maintenance calories | 2,500 kcal/day |
| Target calories | 1,900–2,000 kcal/day |
| Protein target | 130g+ daily |
| Step target | 8,000+ daily |

---

## 6. Page-by-Page Specifications

### 6.1 Overview Dashboard (Home)

The user opens the app and **instantly** sees:

#### KPI Cards

- Current day number in 14-day phase
- Today's calorie intake vs target
- Today's protein vs target
- Today's steps vs target
- Today's workout status
- Hydration status
- Sleep hours
- Adherence score for the day

#### Trend Indicators

- Rolling 7-day average weight
- Estimated weight change over 14 days
- Consistency score
- Data quality score
- Body-weight trend chart (mini)
- Calorie consistency indicator
- Protein consistency indicator
- Step consistency indicator
- Workout completion rate

#### Warning Badges

- ⚠️ Incomplete tracking
- ⚠️ Protein too low
- ⚠️ Step target missed
- ⚠️ Weight trend unclear due to inconsistent entries

#### Quick Summary Panel

Contextual status messages:

- ✅ "Cut is on track"
- ⚠️ "Tracking quality too weak to judge"
- 🔄 "Likely water fluctuation"
- 📋 "Review needed after Day 14"

---

### 6.2 Daily Check-In Page

A serious, efficient input form. No bloat.

#### Core Fields

| Field | Type | Required |
|---|---|---|
| Date | Date picker | Yes |
| Morning body weight | Number (kg) | Yes |
| Calories eaten | Number (kcal) | Yes |
| Protein eaten | Number (g) | Yes |
| Carbs eaten | Number (g) | Yes |
| Fats eaten | Number (g) | Yes |
| Steps | Number | Yes |
| Workout done | Yes/No toggle | Yes |
| Workout type | Select/text | If workout done |
| Workout duration | Number (min) | If workout done |
| Water intake | Number (L) | Yes |
| Sleep hours | Number (hr) | Yes |

#### Secondary Fields

| Field | Type | Required |
|---|---|---|
| Waist measurement | Number (cm) | Optional (but available) |
| Hunger level | 1–10 slider | Yes |
| Energy level | 1–10 slider | Yes |
| Cravings level | 1–10 slider | Yes |
| Digestion status | Select | Yes |
| Soreness level | 1–10 slider | Yes |
| Photo taken | Yes/No | Yes |
| Binge / untracked food | Yes/No | Yes |
| Notes | Text area | Optional |

#### Data Quality Checkboxes (Critical)

- [ ] Fully tracked day
- [ ] Food weighed properly
- [ ] Hidden calories counted
- [ ] Same weigh-in conditions followed

> These checkboxes directly feed the **Data Quality Score**. Days without them checked have reduced confidence.

---

### 6.3 14-Day Tracker Page

A visual 14-day board/timeline. Each day = structured card or row.

#### Each Day Card Displays

- Day number & date
- Body weight
- Calories & protein
- Steps
- Workout (yes/no + type)
- Sleep & water
- Adherence score
- Fully tracked indicator
- Warning flags if incomplete

#### Top Progress Bar

- Completed days count
- Remaining days count
- Percentage complete (visual bar)

#### Interactions

- Click any day → expand full details
- At end of 14-day cycle → auto-generate review summary

---

### 6.4 Progress Analytics Page

> One of the most important sections.

#### Interactive Charts (Polished, Hoverable, Responsive)

| Chart | Type |
|---|---|
| Daily weight | Line chart |
| 7-day rolling average weight | Smoothed line overlay |
| Calorie intake trend | Bar + line |
| Protein trend | Bar chart |
| Step trend | Bar chart |
| Sleep trend | Line chart |
| Water trend | Line chart |
| Adherence score trend | Line chart |
| Waist measurement trend | Line chart |
| Workout completion rate | Bar/donut chart |

#### Highlight Features

- Show noisy daily scale fluctuations vs actual smoothed trend
- Calorie compliance patterns
- Low activity patterns
- Missed protein days (highlighted)
- Sleep vs hunger correlation (if possible)
- Chart tooltips: polished, informative
- Toggle: 7-day / 14-day views
- Date filtering

---

### 6.5 Body Metrics Section

#### Track & Visualize

- Weight (current, start, best in phase, average)
- Waist measurement
- Estimated trend rate
- Start vs current difference
- Physique notes
- Optional body fat estimate field (not overemphasized)

#### "Judge Progress By" Panel (Priority Order)

1. Weekly average weight
2. Waist trend
3. Progress photos
4. Gym performance
5. Daily scale = **noise, not truth**

---

### 6.6 Nutrition Tracking Section

#### Core Tracking

- Calories, protein, carbs, fats
- Target adherence percentage
- Average daily intake
- Macro consistency
- Under-target / over-target day counts

#### Hidden Calories Risk System

Prompt user to watch for:

| Category | Examples |
|---|---|
| Cooking fats | Oils, butter, ghee |
| Beverages | Milk tea, chai, sugary drinks |
| Snacking | Biscuits, nuts, peanut butter |
| Sauces | Ketchup, mayo, dressings |
| Bakery | Bread, roti, baked goods |
| Kitchen bites | Random bites while cooking |
| Extras | Extra rice, roti, untracked drinks |

> If a day is marked **not fully tracked** or **hidden calories not counted** → reduce Data Quality Score.

---

### 6.7 Activity & Training Section

#### Track

- Daily steps
- Workout completion
- Workout type
- Training duration
- Weekly workout count
- Estimated calorie burn (reference only)

#### Important Note (Always Visible)

> ⚠️ **"Do not casually eat back exercise calories."**
> Exercise helps the deficit but does not automatically justify extra intake.

---

### 6.8 Weekly Review Section

Auto-generate a review card every 7 days.

#### Calculated Metrics

- Average body weight
- Average calories & protein
- Average steps
- Workout completion %
- Sleep & water averages
- Fully tracked days count
- Consistency score & data quality score
- Waist change
- Progress interpretation

#### Weekly Review Must Answer

- Is fat loss likely occurring?
- Is data quality strong enough to judge?
- Is the user adherent enough?
- Is there likely water retention masking progress?
- Is protein sufficient?
- Are steps too low?
- Is recovery hurting adherence?

#### Smart Review Messages

| Scenario | Message |
|---|---|
| Good compliance | "Good compliance. Continue current plan." |
| Weak tracking | "Weight trend unclear because tracking consistency is weak." |
| Undercounting | "Calories may be undercounted." |
| Low protein | "Protein target frequently missed." |
| Low steps | "Step output too low for aggressive fat loss." |
| Early phase | "Do not change calories yet. Collect more clean data." |
| Emotional reaction | "Judgment should come from weekly average, not one weigh-in." |

> Tone: calm, sharp, analytical, honest. Not a coach screaming motivation.

---

### 6.9 Progress Photos Section

#### Photo Types

- Front, Side, Back, Flexed (optional)

#### Organization

- By date and 14-day phase
- Clean, elegant, private-feeling gallery (not social media style)

#### Comparison Module

- Day 1 vs Day 14
- Week 1 vs Week 2
- Custom side-by-side compare

---

### 6.10 Settings / Baseline

#### Editable Profile

- Age, height, current weight
- Target calories, protein target, step target
- Gym frequency, maintenance calories
- 14-day cycle start date

#### Tracking Preferences

- Metric units toggle
- Dark mode / Light mode
- Reminder banners
- Chart smoothing on/off
- Show adherence score
- Show data quality score

---

## 7. Scoring Systems

### 7.1 Adherence Score

Calculated per day based on:

| Factor | Weight |
|---|---|
| Calories within target range (±100 kcal) | High |
| Protein target hit (130g+) | High |
| Steps target hit (8,000+) | Medium |
| Workout completed | Medium |
| Water goal met | Low |
| Sleep acceptable (6+ hours) | Low |
| No binge/untracked food | High |

### 7.2 Data Quality Score

Calculated per day based on:

| Factor | Weight |
|---|---|
| Fully tracked day | High |
| Food weighed properly | High |
| Hidden calories counted | High |
| Weigh-in conditions consistent | Medium |
| All major fields completed | Medium |

> **Important:** A day can have **high adherence but low data quality**, and vice versa. Always show both separately.

---

## 8. Decision Logic Engine

At the end of 14 days, auto-generate a **Cut Analysis Summary**:

```
IF tracking_quality == HIGH
   AND avg_calories ≈ target
   AND steps reasonably consistent
   AND protein ≥ target
   AND weekly_avg_weight DROPPED
THEN → "Continue same calories. Cut is working."

IF tracking_quality == LOW
THEN → "Do not make aggressive changes yet. Improve tracking first."

IF tracking_quality == HIGH
   AND adherence == HIGH
   AND NO meaningful drop in avg weight
THEN → "Recommend slight calorie reduction (-100 kcal) or step increase (+1,000 steps)."

IF gym_performance CRASHING
   AND sleep POOR
   AND hunger EXTREME
THEN → "Flag: deficit may be too aggressive. Consider diet break or refeed."
```

---

## 9. Dashboard Components

| Component | Description |
|---|---|
| KPI Cards | Key metrics at a glance |
| Trend Charts | Line/bar charts with tooltips |
| Warning Banners | Contextual alerts for issues |
| Consistency Heatmap | Visual grid of daily consistency |
| 14-Day Completion Tracker | Progress bar / ring |
| Daily Log Table | Sortable, filterable day entries |
| Weekly Summary Card | Auto-generated review panel |
| Photo Comparison Module | Side-by-side viewer |
| Notes Panel | Quick notes / journal |
| Insight Cards | Smart contextual messages |
| Adherence Indicator | Score badge per day |
| Data Quality Indicator | Score badge per day |

### Visual Features

- Polished chart tooltips
- Sticky sidebar navigation
- Collapsible sections
- Card expansion for day details
- Date filtering controls
- 7-day / 14-day toggle views
- Smooth CSS transitions
- Clean loading states
- Premium empty states
- Custom progress rings/bars
- No overdesigned gimmicks

---

## 10. Data Model

### Daily Log Entry Schema

```
DailyLog {
  id                       : UUID
  date                     : Date
  dayNumberInCycle         : Number (1–14)
  
  // Body
  weight                   : Number (kg, to 0.1)
  waist                    : Number (cm, optional)
  
  // Nutrition
  calories                 : Number (kcal)
  protein                  : Number (g)
  carbs                    : Number (g)
  fats                     : Number (g)
  
  // Activity
  steps                    : Number
  workoutDone              : Boolean
  workoutType              : String (enum or free text)
  workoutDuration          : Number (minutes)
  
  // Recovery
  waterIntake              : Number (liters)
  sleepHours               : Number
  hungerLevel              : Number (1–10)
  energyLevel              : Number (1–10)
  cravingsLevel            : Number (1–10)
  digestionStatus          : String (enum: good/okay/poor/bloated)
  sorenessLevel            : Number (1–10)
  
  // Tracking Quality
  fullyTracked             : Boolean
  foodWeighed              : Boolean
  hiddenCaloriesCounted    : Boolean
  sameWeighInConditions    : Boolean
  bingeOrUntrackedFood     : Boolean
  
  // Media & Notes
  photoReferences          : String[] (file paths or URLs)
  photoTaken               : Boolean
  notes                    : String
  
  // Computed (derived)
  adherenceScore           : Number (0–100)
  dataQualityScore         : Number (0–100)
  
  // Timestamps
  createdAt                : DateTime
  updatedAt                : DateTime
}
```

### Supporting Models

```
UserBaseline {
  age                      : Number
  height                   : Number (cm)
  currentWeight            : Number (kg)
  targetCalories           : Number (kcal)
  maintenanceCalories      : Number (kcal)
  proteinTarget            : Number (g)
  stepTarget               : Number
  gymFrequency             : Number (days/week)
  cycleStartDate           : Date
}

WeeklyReview {
  id                       : UUID
  weekNumber               : Number
  startDate                : Date
  endDate                  : Date
  avgWeight                : Number
  avgCalories              : Number
  avgProtein               : Number
  avgSteps                 : Number
  workoutCompletionRate    : Number (%)
  avgSleep                 : Number
  avgWater                 : Number
  fullyTrackedDays         : Number
  consistencyScore         : Number
  dataQualityScore         : Number
  waistChange              : Number
  interpretation           : String
  recommendations          : String[]
}

ProgressPhoto {
  id                       : UUID
  date                     : Date
  dayNumberInCycle         : Number
  type                     : String (front/side/back/flexed)
  filePath                 : String
}
```

---

## 11. Seeded Demo Content

Preload the app with **14 days of realistic example data** so the dashboard looks real on first launch.

### Demo Data Requirements

- Realistic weight fluctuations (73.8–75.2 kg range)
- Varied calorie adherence (some on-target, some slightly over)
- A few missed protein days
- Step counts varying between 4,000–10,000
- 2–3 days not fully tracked
- 1 day with binge/untracked food
- Waist measurements on Day 1, 7, 14
- Varied sleep (5.5–8 hours)
- Different workout types (push, pull, legs, upper, lower, rest)
- Realistic hunger/energy/cravings patterns

> The demo data should demonstrate the tracking logic, scoring systems, and decision engine working properly.

---

## 12. Insight Card Examples

Contextual, smart messages displayed throughout the app:

| Insight | Context |
|---|---|
| "Your weight is noisy, but the 7-day average is trending down." | Weight trend analysis |
| "Three low-protein days reduced recovery quality." | Protein tracking |
| "Step consistency is the weakest part of this phase." | Activity analysis |
| "Two days were not fully tracked, so judgment confidence is lower." | Data quality |
| "You are reacting to daily noise. Focus on average trend." | Weight concern |
| "The cut should be judged after enough clean data, not emotion." | Early phase |
| "Calories may be undercounted. Check hidden calorie sources." | Nutrition warning |

> Tone: Calm, analytical, honest. Never preachy or motivational.

---

## 13. Technical Architecture

### Stack

| Layer | Technology |
|---|---|
| Framework | Vite + React (or Next.js) |
| Language | JavaScript / TypeScript |
| Styling | Vanilla CSS (custom design system) |
| Charts | Chart.js or Recharts (interactive) |
| State | React Context or Zustand |
| Persistence | LocalStorage (minimum) + optional backend |
| Icons | Lucide React or Phosphor |
| Fonts | Google Fonts (Inter / Outfit + JetBrains Mono) |

### Architecture Principles

- Clean, reusable component architecture
- Local data persistence as minimum viable storage
- Structured for future backend/database connection
- Strong form validation
- Support photo uploads (local file references)
- Clean state management patterns
- Modular page structure

### Key Components

```
src/
├── components/
│   ├── layout/          — Sidebar, TopBar, PageWrapper
│   ├── dashboard/       — KPICard, TrendChart, InsightCard, WarningBadge
│   ├── forms/           — CheckInForm, SettingsForm
│   ├── tracker/         — DayCard, TimelineView, ProgressBar
│   ├── charts/          — WeightChart, CalorieChart, MacroChart, etc.
│   ├── photos/          — PhotoGallery, CompareView
│   ├── review/          — WeeklyReviewCard, CutAnalysis
│   └── common/          — Button, Input, Toggle, Slider, Badge, Modal
├── pages/
│   ├── Dashboard.jsx
│   ├── DailyCheckIn.jsx
│   ├── Tracker.jsx
│   ├── Analytics.jsx
│   ├── BodyMetrics.jsx
│   ├── Nutrition.jsx
│   ├── Activity.jsx
│   ├── WeeklyReview.jsx
│   ├── ProgressPhotos.jsx
│   └── Settings.jsx
├── data/
│   ├── seedData.js      — 14-day demo content
│   ├── constants.js     — Targets, thresholds, scoring weights
│   └── baseline.js      — Default user profile
├── utils/
│   ├── scoring.js       — Adherence & data quality calculators
│   ├── analytics.js     — Rolling averages, trends, correlations
│   ├── decisions.js     — Cut analysis logic engine
│   └── formatters.js    — Number, date, unit formatting
├── hooks/
│   ├── useStore.js      — State management
│   └── useChartData.js  — Chart data transformations
├── styles/
│   ├── index.css        — Design system tokens & globals
│   ├── layout.css       — Grid, sidebar, page structure
│   ├── components.css   — Component-specific styles
│   └── charts.css       — Chart customizations
└── App.jsx
```

---

## 14. Responsiveness Guidelines

| Breakpoint | Behavior |
|---|---|
| Desktop (1200px+) | Full grid layout, sidebar visible, all charts inline |
| Tablet (768–1199px) | Compact grid, collapsible sidebar, stacked some cards |
| Mobile (<768px) | Single column, stacked cards, simplified charts, bottom nav |

### Key Rules

- Desktop-first layout, responsive down
- Forms remain clean and usable on mobile
- Sidebar converts to hamburger/bottom nav on small screens
- Charts simplify (fewer data points, larger touch targets)
- Cards stack vertically on mobile
- Maintain premium feel at every breakpoint

---

## 15. Anti-Patterns (What NOT to Do)

| ❌ Don't | ✅ Do Instead |
|---|---|
| MyFitnessPal clone look | Original, purpose-built dashboard |
| Generic fitness illustrations | Clean data visualizations |
| Landing page first | Real product dashboard first |
| Community/social features | Private, personal tool |
| Startup-pitch looking UI | Handcrafted, functional interface |
| Overdesigned gimmicks | Intentional, useful components |
| Neon color overload | Restrained, muted accent colors |
| Template-based feel | Custom, premium design system |
| Motivational coach screaming | Calm, analytical, honest tone |
| Eating back exercise calories logic | Clear warning against it |

---

## 16. Implementation Phases

### Phase 1 — Foundation

- [ ] Initialize project (Vite + React)
- [ ] Set up design system (CSS tokens, typography, colors)
- [ ] Build layout shell (sidebar, top bar, page routing)
- [ ] Create common components (buttons, inputs, cards, badges)
- [ ] Set up state management & local persistence
- [ ] Define data models & seed data

### Phase 2 — Core Pages

- [ ] Overview Dashboard with KPI cards & mini charts
- [ ] Daily Check-In form (all fields, validation, quality checkboxes)
- [ ] 14-Day Tracker (day cards, progress bar, expand/collapse)
- [ ] Settings / Baseline page

### Phase 3 — Analytics & Intelligence

- [ ] Progress Analytics page (all charts, interactive, hoverable)
- [ ] Body Metrics section (weight trend, waist, comparison panels)
- [ ] Nutrition Tracking section (macros, hidden calorie system)
- [ ] Activity & Training section

### Phase 4 — Review & Decision Engine

- [ ] Weekly Review auto-generation logic
- [ ] Cut Analysis decision engine (14-day logic)
- [ ] Insight cards system
- [ ] Warning badges & contextual messages

### Phase 5 — Photos & Polish

- [ ] Progress Photos gallery & comparison module
- [ ] Login screen (simple, premium)
- [ ] Empty states, loading states
- [ ] Animations, transitions, hover effects
- [ ] Mobile responsiveness pass
- [ ] Performance optimization
- [ ] Final design polish

---

> **End goal:** This app should feel like a private body recomposition command center for a disciplined cut. The user should feel more honest, more aware, and more in control after using it.
