# EduMentor AI - Design Guidelines

## Design Approach

**Selected Approach:** Design System + Reference Hybrid

**Primary System:** Material Design 3 principles adapted for educational context

**Reference Inspirations:**
- **Duolingo:** Gamification elements, progress indicators, streak tracking
- **Khan Academy:** Clean educational interface, quiz presentation
- **Linear:** Modern typography hierarchy, dashboard layouts
- **Notion:** Chat/messaging interface patterns

**Core Principles:**
1. **Clarity First:** Learning tools must prioritize readability and comprehension
2. **Motivational Design:** Gamification should encourage without overwhelming
3. **Data Transparency:** Progress and analytics should be immediately understandable
4. **Focused Interactions:** Quiz and chat experiences minimize cognitive load

---

## Typography System

**Font Families:**
- **Primary:** Inter (via Google Fonts) - body text, UI elements, chat messages
- **Display:** Lexend (via Google Fonts) - headings, dashboard titles, gamification callouts
- **Monospace:** JetBrains Mono - code snippets, technical answers

**Hierarchy:**
- **Hero/Display:** text-5xl to text-6xl, font-bold (Lexend)
- **Page Headers:** text-3xl to text-4xl, font-semibold (Lexend)
- **Section Headers:** text-2xl, font-semibold (Inter)
- **Subsection/Card Headers:** text-xl, font-medium (Inter)
- **Body Text:** text-base, font-normal (Inter)
- **Small Text/Metadata:** text-sm, font-normal (Inter)
- **Micro Text:** text-xs for labels and hints

---

## Layout System

**Spacing Primitives:**
Core spacing units: **2, 4, 6, 8, 12, 16, 20, 24**

Common patterns:
- Component padding: `p-4` to `p-6`
- Section spacing: `space-y-8` to `space-y-12`
- Card margins: `gap-6` for grids
- Page margins: `px-4 md:px-8 lg:px-16`

**Container Widths:**
- Full app wrapper: `max-w-7xl mx-auto`
- Chat interface: `max-w-4xl mx-auto`
- Quiz cards: `max-w-2xl mx-auto`
- Dashboard grid: `w-full` with responsive columns

**Grid Systems:**
- Dashboard: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
- Stats cards: `grid grid-cols-2 md:grid-cols-4 gap-4`
- Leaderboard: Single column with card layout

---

## Component Library

### Navigation
**Top Navbar:**
- Fixed header with shadow on scroll
- Logo + app name (left), navigation links (center), user profile/XP display (right)
- Height: `h-16`
- Responsive: Hamburger menu on mobile
- Include: Dashboard, Chat, Leaderboard, Profile links
- XP counter with icon badge (always visible)

### Chat Interface
**Message Layout:**
- User messages: Right-aligned, compact bubbles
- AI responses: Left-aligned with AI avatar icon
- Message bubbles: `rounded-2xl` with `px-4 py-3`
- Max width: `max-w-[80%]`
- Spacing between messages: `space-y-4`
- Timestamp: `text-xs` below each message

**Input Area:**
- Fixed bottom input with `rounded-full` text field
- Send button integrated (icon-only, circular)
- Height: `min-h-[60px]`
- Suggestion chips above input for quick queries

### Quiz Components
**Question Card:**
- Centered card with `max-w-2xl`
- Question text: `text-2xl font-semibold` with ample `py-8`
- Answer options: Full-width buttons with `min-h-[56px]`
- Spacing between options: `space-y-4`
- Progress indicator at top: Linear progress bar
- Difficulty badge: Small pill in corner

**Quiz Controls:**
- Skip/Next buttons (secondary action)
- Submit button (primary, prominent)
- Timer display (optional, top-right)

### Dashboard Cards
**Stat Cards:**
- Rounded cards `rounded-xl` with shadow
- Icon at top (large, 48px)
- Metric value: `text-4xl font-bold`
- Metric label: `text-sm`
- Layout: `p-6`, centered content

**Chart Containers:**
- Full-width cards with `p-6`
- Chart title: `text-xl font-semibold mb-4`
- Minimum height: `min-h-[300px]`
- Use Recharts for all visualizations

**Progress Tracking:**
- Linear progress bars with percentage labels
- Subject breakdown: List with progress bars
- Recent activity feed: Timeline layout with icons

### Gamification Elements
**XP Display:**
- Circular progress ring showing current level
- XP count: `text-3xl font-bold` center
- Level indicator: Badge overlay
- Size: `w-32 h-32` for profile, `w-16 h-16` for navbar

**Badge Collection:**
- Grid of earned badges: `grid grid-cols-3 md:grid-cols-5 gap-4`
- Badge cards: `aspect-square` with icon and name
- Locked badges: Reduced opacity with lock icon overlay

**Streak Tracker:**
- Calendar grid showing daily activity
- Current streak: Large number with flame icon
- Best streak: Secondary stat below
- Visual: Heat map style intensity

### Forms & Inputs
**Text Fields:**
- Height: `h-12`
- Rounded: `rounded-lg`
- Padding: `px-4`
- Focus ring with offset

**Buttons:**
- Primary: `h-12 px-6 rounded-lg font-semibold`
- Secondary: Same sizing with different treatment
- Icon buttons: `w-12 h-12 rounded-full`
- Blur background when over images: `backdrop-blur-md`

### Data Visualization
**Charts (Recharts):**
- Line charts for progress over time
- Bar charts for topic comparison
- Pie/Donut for accuracy breakdown
- Responsive sizing with `aspect-[16/9]`

**Tables/Lists:**
- Leaderboard: Alternating row treatment
- Row height: `min-h-[64px]`
- Rank badge in first column
- User avatar + name + XP layout

---

## Page Layouts

### Chat Page
- Full-height layout `h-screen`
- Message area: Scrollable with `flex-1`
- Input fixed at bottom
- Side panel (collapsible): Recent topics, quick actions

### Dashboard Page
- Hero section with overview stats (grid of 4 stat cards)
- Two-column layout: Charts (left 2/3) + Activity feed (right 1/3)
- Sections: Performance trends, Subject breakdown, Recent quizzes, Achievements
- Vertical spacing: `space-y-12`

### Quiz Page
- Centered, focused layout
- Question card dominates viewport
- Minimal distractions
- Progress indicators subtle but present
- Results screen: Full-screen celebration with confetti for high scores

### Leaderboard Page
- Table header with sort controls
- Highlight current user row
- Top 3 podium visualization at top
- Infinite scroll or pagination

---

## Spacing & Structure

**Page-level:**
- Page wrapper: `py-8 px-4 md:px-8`
- Section spacing: `mb-12` between major sections
- Card spacing in grids: `gap-6`

**Component-level:**
- Card padding: `p-6`
- Compact cards: `p-4`
- List items: `py-4 px-6`
- Buttons: `px-6 py-3`

**Responsive Breakpoints:**
- Mobile-first approach
- `md:` at 768px
- `lg:` at 1024px
- `xl:` at 1280px

---

## Icons

**Library:** Heroicons (via CDN)

**Usage:**
- Navigation: 24px icons
- Stat cards: 48px icons
- Inline actions: 20px icons
- Badges: 32px decorative icons
- Chat UI: 20px utility icons

**Common Icons Needed:**
- Chat: ChatBubbleLeftRightIcon, PaperAirplaneIcon
- Quiz: AcademicCapIcon, ClipboardDocumentCheckIcon
- Gamification: FireIcon, TrophyIcon, SparklesIcon, StarIcon
- Dashboard: ChartBarIcon, ChartPieIcon, ClockIcon
- Navigation: HomeIcon, UserIcon, Bars3Icon

---

## Images

**Hero Section (Dashboard Landing):**
- **Not applicable** - Dashboard leads with stat cards grid for immediate data access
- Focus on functional information hierarchy over decorative imagery

**Decorative Elements:**
- Achievement badges: Use icon-based illustrations rather than photos
- Empty states: Simple SVG illustrations for "No quizzes yet," "Start chatting"
- Profile avatars: User-uploaded or generated initials in circles

**Educational Content:**
- Quiz questions may include diagrams (rendered as needed)
- Chat responses may embed explanatory graphics
- Use placeholder rectangles with descriptions for content-specific images

**Background Treatments:**
- Subtle gradient overlays on stat cards
- Geometric patterns for celebration screens
- No large hero images - prioritize functional dashboard design

---

## Animation Guidelines

**Use Sparingly:**
- Page transitions: Simple fade-ins
- Chat messages: Slide-in from respective sides
- Quiz answer feedback: Success/error shake or pulse
- XP gain: Counter animation for earned points
- Streak milestone: Celebratory confetti (one-time trigger)

**Performance:**
- Prefer CSS transitions over JavaScript animations
- Use `transform` and `opacity` for smooth 60fps
- Disable animations for reduced motion preferences

---

## Accessibility

- All interactive elements minimum `44px` touch target
- Color contrast WCAG AA compliant throughout
- Keyboard navigation fully supported
- ARIA labels for screen readers on all icons
- Focus indicators clearly visible
- Form validation with clear error messages