# BO.Militar Design Guidelines

## Design Approach

**Design System**: Material Design 3 adapted for emergency services with enhanced contrast and visibility. Prioritizing clarity, accessibility, and rapid information processing for high-stress situations.

**Core Principles**:
- **Immediate Clarity**: Critical information must be instantly recognizable
- **Trust & Authority**: Professional government service aesthetic
- **Action-Oriented**: Emergency actions prominently featured
- **Status-Driven**: Color-coded system states guide user attention

---

## Typography

**Font Family**: 
- Primary: Inter (via Google Fonts CDN)
- Fallback: system-ui, sans-serif

**Scale**:
- Hero/Page Titles: text-4xl (36px) font-bold
- Section Headers: text-2xl (24px) font-semibold
- Card Titles: text-xl (20px) font-semibold
- Body: text-base (16px) font-normal
- Labels/Meta: text-sm (14px) font-medium
- Captions: text-xs (12px) font-normal

---

## Layout System

**Spacing Units**: Use Tailwind units of **2, 4, 6, 8, 12, 16** (e.g., p-4, gap-8, mb-12)

**Container Strategy**:
- Login/Auth pages: max-w-md centered
- Dashboard panels: max-w-7xl with px-6
- Forms: max-w-2xl
- Incident details: max-w-4xl
- Chat: max-w-3xl

**Grid Patterns**:
- Dashboard stats: 4-column grid (grid-cols-1 md:grid-cols-2 lg:grid-cols-4)
- Incident cards: 2-column (grid-cols-1 lg:grid-cols-2)
- Mobile: Always single column

---

## Component Library

### Navigation
- **Top Bar**: Fixed header with logo left, user profile/logout right, height h-16
- **Role Badge**: Display institution (PM/Bombeiros) with icon, visible on all authenticated pages
- **Breadcrumbs**: For navigation depth (Dashboard > Ocorrências > Detalhes)

### Authentication Screens
- **Landing Page**: Centered layout, prominent logo, two large role selection cards (Cidadão / Atendente)
- **Login Forms**: Card-based (p-8), clear field labels above inputs, institutional badge for attendants
- **Registration**: Multi-step feel with clear field grouping, privacy notices in alert boxes

### Dashboard Cards
- **Stat Cards**: Elevated shadow, icon top-left, large number display, descriptive label below
- **Status Indicators**: Badge components with dot indicator (Aguardando: yellow, Em Atendimento: blue, Concluído: green)
- **Alert Box**: Red border-l-4, light red background, icon left, urgent messaging

### Forms
- **Input Fields**: Outlined style, label above, helper text below, clear focus states
- **Select Dropdowns**: Consistent with text inputs, chevron indicator
- **Buttons**:
  - Primary Emergency: Large (py-4 px-8), solid, full width on mobile, icon optional
  - Secondary Actions: Outlined, medium size (py-2 px-6)
  - Tertiary: Text-only with underline on hover
- **File Upload**: Drag-and-drop zone with preview thumbnails
- **Location Capture**: Map preview with coordinates display, "Capturar Localização" button with GPS icon

### Incident Components
- **Incident Card**: Border, hover elevation, header with status badge, metadata row (time/type/protocol), truncated description
- **Detail View**: 
  - Hero section: Protocol number, status, timestamp
  - Two-column layout: Citizen info left (with call/chat buttons), Incident details right
  - Evidence gallery: Thumbnail grid with lightbox
  - Action buttons: Fixed bottom bar on mobile, right-aligned on desktop
- **Timeline/History**: Vertical line with status change nodes, timestamp and user info

### Chat Interface
- **Message Bubbles**: Rounded, citizen messages left-aligned, attendant right-aligned, system messages centered
- **Input Bar**: Fixed bottom, textarea with send button, attachment option
- **Auto-message**: Distinct styling (bordered, light background) for bot welcome

### Tables/Lists
- **Incident Table**: Sortable headers, row hover states, status column with badges, quick action icons right
- **Filters**: Chip-based selection above table (Todas, Aguardando, Despachado, etc.)
- **Pagination**: Bottom center, showing count

---

## Status Color System

**System States** (use for badges, borders, indicators):
- Aguardando: Yellow/Amber tones
- Despachado: Blue tones
- Em Atendimento: Purple tones
- Concluído: Green tones
- Alert/Urgent: Red tones

**Usage**: Apply via border-l-4, badge backgrounds, and icon colors

---

## Icons

**Library**: Heroicons (outline for most UI, solid for filled states)

**Usage**:
- Emergency types: Fire, Shield, Medical icons
- Actions: Phone, Chat, Location, Camera icons
- Status: CheckCircle, Clock, AlertTriangle icons
- Navigation: ChevronRight, Menu, User icons

---

## Images

**Logo Placement**: Top center on landing, top-left on authenticated pages

**No Hero Image**: This is a functional dashboard system, not marketing. Use icon-based visual hierarchy instead.

**Evidence Images**: Displayed as thumbnails in grid, expandable to full view

---

## Responsive Behavior

- Mobile-first: Stack all multi-column layouts to single column
- Tables: Convert to card view on mobile
- Fixed action buttons: Bottom sheet on mobile, inline on desktop
- Chat: Full-screen on mobile, sidebar/panel on desktop

---

## Accessibility

- All interactive elements keyboard accessible
- Form inputs with proper labels and ARIA attributes
- Status changes announced to screen readers
- Minimum touch targets: 44x44px
- High contrast mode support for emergency visibility