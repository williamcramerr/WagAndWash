# WagAndWash SaaS - Master Implementation Plan

## Executive Summary

WagAndWash is a comprehensive grooming business operating system targeting independent groomers and small shops (1-5 groomers) with hybrid salon + mobile capabilities. This plan outlines the complete technical architecture, documentation structure, and phased implementation approach.

**Stack**: Next.js 14 (App Router) + Supabase + Stripe + Resend + Vercel + Twilio + Google Maps
**Launch Market**: US Only
**Mobile Strategy**: PWA First
**Pricing Model**: Tiered SaaS (Starter/Pro/Enterprise)

---

## 1. Documentation Structure

The following documentation files will be created in the `/docs` directory:

### Core Documentation
| File | Purpose |
|------|---------|
| `CLAUDE.md` | AI assistant context - project overview, conventions, key files |
| `docs/ARCHITECTURE.md` | System architecture, data flow, integrations |
| `docs/DATABASE.md` | Complete schema design with relationships |
| `docs/API.md` | API routes, endpoints, request/response formats |
| `docs/FEATURES.md` | Feature specifications by module |
| `docs/DEPLOYMENT.md` | Vercel deployment, environment setup, CI/CD |
| `docs/SECURITY.md` | Auth, RLS policies, data protection |
| `docs/TESTING.md` | Testing strategy, coverage requirements |

### Module-Specific Docs
| File | Purpose |
|------|---------|
| `docs/modules/SCHEDULING.md` | Booking engine, capacity, buffers |
| `docs/modules/CRM.md` | Client/pet management, grooming intelligence |
| `docs/modules/PAYMENTS.md` | Stripe integration, deposits, subscriptions |
| `docs/modules/MOBILE-OPS.md` | Routing, geofencing, ETA, offline |
| `docs/modules/SALON-OPS.md` | Stations, walk-ins, POS |
| `docs/modules/AUTOMATION.md` | Retention, campaigns, notifications |
| `docs/modules/ANALYTICS.md` | Dashboards, metrics, reporting |

### Development Guides
| File | Purpose |
|------|---------|
| `docs/guides/SETUP.md` | Local development setup |
| `docs/guides/CONVENTIONS.md` | Code style, naming, patterns |
| `docs/guides/COMPONENT-LIBRARY.md` | UI components, design system |

---

## 2. Technical Architecture

### 2.1 Stack Decisions

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
├─────────────────────────────────────────────────────────────────┤
│  Next.js 14 (App Router) + React 18 + TypeScript               │
│  Tailwind CSS + shadcn/ui                                       │
│  PWA: next-pwa + Workbox (offline support)                     │
│  State: Zustand (client) + TanStack Query (server state)       │
│  Forms: React Hook Form + Zod                                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         API LAYER                               │
├─────────────────────────────────────────────────────────────────┤
│  Next.js API Routes (Route Handlers)                            │
│  Supabase Client (server-side)                                  │
│  tRPC (optional - for type-safe API)                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       DATA LAYER                                │
├─────────────────────────────────────────────────────────────────┤
│  Supabase PostgreSQL                                            │
│  Supabase Auth (email, magic link, OAuth)                       │
│  Supabase Realtime (live updates)                               │
│  Supabase Storage (photos, documents)                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                            │
├─────────────────────────────────────────────────────────────────┤
│  Stripe (payments, subscriptions, Connect)                      │
│  Resend (transactional email)                                   │
│  Twilio (SMS notifications)                                     │
│  Google Maps Platform (routing, geocoding, places)              │
│  Vercel (hosting, edge functions, analytics)                    │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Multi-Tenancy Model

**Approach**: Schema-based isolation with RLS (Row Level Security)

```
tenant_id UUID → Every table has tenant_id column
RLS Policies → Automatic filtering based on auth.jwt() claims
```

Benefits:
- Single database, simple operations
- Strong isolation via RLS
- Easy to scale horizontally later

### 2.3 Key Architectural Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Routing | App Router | Server components, streaming, better DX |
| Auth | Supabase Auth | Native integration, RLS support, OAuth |
| Payments | Stripe Connect | Platform payments, split payouts |
| Maps | Google Maps Platform | Best routing API, Places for addresses |
| SMS | Twilio | Reliability, US coverage, reasonable pricing |
| Email | Resend | Modern API, great DX, good deliverability |
| Real-time | Supabase Realtime | Native integration, presence, broadcasts |
| Offline | Workbox + IndexedDB | PWA standard, background sync |

---

## 3. Database Schema (Core Tables)

### 3.1 Multi-Tenant Foundation

```sql
-- Organizations (Tenants)
organizations (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  owner_id UUID REFERENCES auth.users,

  -- Business Info
  business_type TEXT CHECK (IN ('salon', 'mobile', 'hybrid')),
  timezone TEXT DEFAULT 'America/New_York',
  currency TEXT DEFAULT 'USD',

  -- Subscription
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  plan_tier TEXT CHECK (IN ('starter', 'pro', 'enterprise')),
  plan_status TEXT CHECK (IN ('trialing', 'active', 'past_due', 'canceled')),
  trial_ends_at TIMESTAMPTZ,

  -- Settings (JSONB for flexibility)
  settings JSONB DEFAULT '{}',

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
)

-- Organization Members
org_members (
  id UUID PRIMARY KEY,
  org_id UUID REFERENCES organizations ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users,
  role TEXT CHECK (IN ('owner', 'admin', 'groomer', 'csr', 'dispatcher')),

  -- Groomer-specific
  is_groomer BOOLEAN DEFAULT false,
  groomer_profile_id UUID REFERENCES groomer_profiles,

  -- Permissions (feature flags per member)
  permissions JSONB DEFAULT '{}',

  created_at TIMESTAMPTZ DEFAULT NOW()
)
```

### 3.2 Locations & Resources

```sql
-- Locations (Salons, Service Areas)
locations (
  id UUID PRIMARY KEY,
  org_id UUID REFERENCES organizations ON DELETE CASCADE,

  name TEXT NOT NULL,
  type TEXT CHECK (IN ('salon', 'service_area')),

  -- Address (for salons)
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  country TEXT DEFAULT 'US',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),

  -- Service Area (for mobile - polygon or radius)
  service_area_geojson JSONB,

  -- Operating Hours (JSONB for flexibility)
  operating_hours JSONB,

  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
)

-- Stations (for salon scheduling)
stations (
  id UUID PRIMARY KEY,
  org_id UUID REFERENCES organizations ON DELETE CASCADE,
  location_id UUID REFERENCES locations ON DELETE CASCADE,

  name TEXT NOT NULL,
  type TEXT CHECK (IN ('grooming', 'bath', 'drying', 'nail')),

  is_active BOOLEAN DEFAULT true
)

-- Mobile Units (Vans)
mobile_units (
  id UUID PRIMARY KEY,
  org_id UUID REFERENCES organizations ON DELETE CASCADE,

  name TEXT NOT NULL,
  license_plate TEXT,

  -- Equipment checklist items
  equipment_checklist JSONB DEFAULT '[]',

  -- Assigned groomer (can change)
  default_groomer_id UUID REFERENCES groomer_profiles,

  is_active BOOLEAN DEFAULT true
)
```

### 3.3 Services & Pricing

```sql
-- Services
services (
  id UUID PRIMARY KEY,
  org_id UUID REFERENCES organizations ON DELETE CASCADE,

  name TEXT NOT NULL,
  description TEXT,

  -- Pricing
  base_price_cents INTEGER NOT NULL,

  -- Duration (in minutes)
  base_duration_minutes INTEGER NOT NULL,

  -- Size/Coat modifiers (JSONB)
  -- { "small": { "price_modifier": 0, "duration_modifier": 0 },
  --   "medium": { "price_modifier": 1500, "duration_modifier": 15 }, ... }
  size_modifiers JSONB DEFAULT '{}',
  coat_modifiers JSONB DEFAULT '{}',

  -- Service type
  service_type TEXT CHECK (IN ('salon', 'mobile', 'both')),

  -- Required resources
  requires_station_type TEXT[],

  -- Deposit requirement
  requires_deposit BOOLEAN DEFAULT false,
  deposit_type TEXT CHECK (IN ('fixed', 'percentage')),
  deposit_amount INTEGER, -- cents or percentage * 100

  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW()
)

-- Add-ons
service_addons (
  id UUID PRIMARY KEY,
  org_id UUID REFERENCES organizations ON DELETE CASCADE,
  service_id UUID REFERENCES services,

  name TEXT NOT NULL,
  price_cents INTEGER NOT NULL,
  duration_minutes INTEGER DEFAULT 0,

  is_active BOOLEAN DEFAULT true
)
```

### 3.4 Clients & Pets (CRM)

```sql
-- Clients (Pet Owners)
clients (
  id UUID PRIMARY KEY,
  org_id UUID REFERENCES organizations ON DELETE CASCADE,

  -- Contact Info
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  phone_secondary TEXT,

  -- Address
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),

  -- Preferences
  preferred_groomer_id UUID REFERENCES groomer_profiles,
  preferred_contact TEXT CHECK (IN ('sms', 'email', 'phone')),

  -- Status
  status TEXT CHECK (IN ('active', 'inactive', 'blocked')),
  blocked_reason TEXT,

  -- Metrics (denormalized for performance)
  total_visits INTEGER DEFAULT 0,
  total_spent_cents INTEGER DEFAULT 0,
  last_visit_at TIMESTAMPTZ,
  no_show_count INTEGER DEFAULT 0,
  late_cancel_count INTEGER DEFAULT 0,

  -- Tags for segmentation
  tags TEXT[] DEFAULT '{}',

  -- Notes
  internal_notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
)

-- Pets
pets (
  id UUID PRIMARY KEY,
  org_id UUID REFERENCES organizations ON DELETE CASCADE,
  client_id UUID REFERENCES clients ON DELETE CASCADE,

  name TEXT NOT NULL,
  species TEXT CHECK (IN ('dog', 'cat', 'other')),
  breed TEXT,
  breed_secondary TEXT,

  -- Physical
  weight_lbs DECIMAL(5, 2),
  size TEXT CHECK (IN ('small', 'medium', 'large', 'xlarge')),
  coat_type TEXT CHECK (IN ('smooth', 'double', 'wire', 'curly', 'long', 'hairless')),
  color TEXT,

  -- Health & Safety
  birth_date DATE,
  sex TEXT CHECK (IN ('male', 'female', 'unknown')),
  is_neutered BOOLEAN,

  -- Safety Flags (Critical for grooming intelligence)
  safety_flags JSONB DEFAULT '{}',
  -- { "bite_risk": true, "muzzle_required": true, "stress_triggers": ["dryer", "nail_clip"], ... }

  -- Grooming Preferences
  grooming_notes TEXT,
  style_preferences TEXT,
  tool_preferences TEXT,

  -- Medical
  medical_conditions TEXT[],
  allergies TEXT[],
  medications TEXT[],
  vet_name TEXT,
  vet_phone TEXT,

  -- Vaccinations (JSONB array)
  vaccinations JSONB DEFAULT '[]',
  -- [{ "type": "rabies", "date": "2024-01-15", "expires": "2025-01-15", "document_id": "..." }]

  -- Photo
  photo_url TEXT,

  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
)

-- Grooming History (Grooming Intelligence Layer)
grooming_records (
  id UUID PRIMARY KEY,
  org_id UUID REFERENCES organizations ON DELETE CASCADE,
  pet_id UUID REFERENCES pets ON DELETE CASCADE,
  appointment_id UUID REFERENCES appointments,
  groomer_id UUID REFERENCES groomer_profiles,

  -- What was done
  services_performed JSONB, -- snapshot of services

  -- Grooming Notes
  coat_condition TEXT CHECK (IN ('excellent', 'good', 'fair', 'poor')),
  skin_condition TEXT CHECK (IN ('healthy', 'dry', 'irritated', 'infected', 'other')),
  skin_notes TEXT,

  matting_level TEXT CHECK (IN ('none', 'light', 'moderate', 'severe')),
  matting_locations TEXT[],

  -- Issues Found
  issues_found JSONB DEFAULT '[]',
  -- [{ "type": "flea", "severity": "mild", "notes": "..." }]

  -- Behavior During Grooming
  behavior_notes TEXT,
  behavior_rating TEXT CHECK (IN ('excellent', 'good', 'challenging', 'difficult')),

  -- Before/After Photos
  photos JSONB DEFAULT '[]',
  -- [{ "type": "before", "url": "...", "uploaded_at": "..." }]

  -- Report Card (auto-generated content)
  report_card JSONB,

  created_at TIMESTAMPTZ DEFAULT NOW()
)
```

### 3.5 Appointments & Scheduling

```sql
-- Appointments
appointments (
  id UUID PRIMARY KEY,
  org_id UUID REFERENCES organizations ON DELETE CASCADE,

  -- Client & Pets
  client_id UUID REFERENCES clients ON DELETE CASCADE,
  pet_ids UUID[] NOT NULL, -- Can have multiple pets

  -- Scheduling
  appointment_type TEXT CHECK (IN ('salon', 'mobile')),
  location_id UUID REFERENCES locations,
  station_id UUID REFERENCES stations,
  mobile_unit_id UUID REFERENCES mobile_units,
  groomer_id UUID REFERENCES groomer_profiles,

  -- Time
  scheduled_date DATE NOT NULL,
  scheduled_start TIME NOT NULL,
  scheduled_end TIME NOT NULL,

  -- Buffers (calculated)
  travel_buffer_before INTEGER DEFAULT 0, -- minutes
  travel_buffer_after INTEGER DEFAULT 0,
  cleaning_buffer INTEGER DEFAULT 0,

  -- Actual times (filled during/after appointment)
  actual_start TIMESTAMPTZ,
  actual_end TIMESTAMPTZ,

  -- Services
  services JSONB NOT NULL, -- Snapshot with pricing
  addons JSONB DEFAULT '[]',

  -- Pricing
  subtotal_cents INTEGER NOT NULL,
  discount_cents INTEGER DEFAULT 0,
  tax_cents INTEGER DEFAULT 0,
  total_cents INTEGER NOT NULL,

  -- Deposit
  deposit_required_cents INTEGER DEFAULT 0,
  deposit_paid_cents INTEGER DEFAULT 0,
  deposit_paid_at TIMESTAMPTZ,

  -- Status
  status TEXT CHECK (IN (
    'pending', 'confirmed', 'checked_in',
    'in_progress', 'completed', 'no_show',
    'canceled', 'rescheduled'
  )) DEFAULT 'pending',

  -- Cancellation
  canceled_at TIMESTAMPTZ,
  canceled_by UUID REFERENCES auth.users,
  cancel_reason TEXT,
  late_cancel_fee_cents INTEGER DEFAULT 0,

  -- Mobile-specific
  client_address_snapshot JSONB, -- Address at time of booking
  route_order INTEGER, -- Position in day's route
  eta_window_start TIMESTAMPTZ,
  eta_window_end TIMESTAMPTZ,

  -- Geofence tracking
  groomer_checked_in_at TIMESTAMPTZ,
  groomer_checked_out_at TIMESTAMPTZ,
  groomer_location_on_arrival JSONB, -- { lat, lng }

  -- Confirmation
  confirmation_sent_at TIMESTAMPTZ,
  reminder_sent_at TIMESTAMPTZ,
  client_confirmed_at TIMESTAMPTZ,

  -- Notes
  client_notes TEXT, -- Notes from client during booking
  internal_notes TEXT, -- Staff notes

  -- Source
  booking_source TEXT CHECK (IN ('online', 'phone', 'walk_in', 'recurring', 'rebooking')),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users
)

-- Waitlist
waitlist (
  id UUID PRIMARY KEY,
  org_id UUID REFERENCES organizations ON DELETE CASCADE,

  client_id UUID REFERENCES clients,
  pet_ids UUID[],
  service_id UUID REFERENCES services,

  preferred_dates DATE[],
  preferred_times TEXT[], -- 'morning', 'afternoon', 'evening'
  preferred_groomer_id UUID REFERENCES groomer_profiles,

  status TEXT CHECK (IN ('waiting', 'offered', 'booked', 'expired')),

  offered_appointment_id UUID REFERENCES appointments,
  offered_at TIMESTAMPTZ,
  offer_expires_at TIMESTAMPTZ,

  notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
)

-- Recurring Appointments
recurring_schedules (
  id UUID PRIMARY KEY,
  org_id UUID REFERENCES organizations ON DELETE CASCADE,

  client_id UUID REFERENCES clients,
  pet_ids UUID[],

  -- Pattern
  frequency TEXT CHECK (IN ('weekly', 'biweekly', 'monthly', 'custom')),
  interval_weeks INTEGER, -- For custom
  preferred_day_of_week INTEGER, -- 0-6
  preferred_time TIME,
  preferred_groomer_id UUID REFERENCES groomer_profiles,

  -- Services
  services JSONB NOT NULL,
  addons JSONB DEFAULT '[]',

  -- Settings
  auto_book BOOLEAN DEFAULT false, -- Auto-create appointments
  advance_booking_days INTEGER DEFAULT 14,

  is_active BOOLEAN DEFAULT true,

  last_generated_date DATE,
  next_due_date DATE,

  created_at TIMESTAMPTZ DEFAULT NOW()
)
```

### 3.6 Payments & Transactions

```sql
-- Payments
payments (
  id UUID PRIMARY KEY,
  org_id UUID REFERENCES organizations ON DELETE CASCADE,

  -- References
  appointment_id UUID REFERENCES appointments,
  client_id UUID REFERENCES clients,

  -- Stripe
  stripe_payment_intent_id TEXT,
  stripe_charge_id TEXT,

  -- Amount
  amount_cents INTEGER NOT NULL,
  currency TEXT DEFAULT 'USD',

  -- Type
  payment_type TEXT CHECK (IN (
    'appointment', 'deposit', 'membership',
    'package', 'retail', 'no_show_fee',
    'late_cancel_fee', 'tip'
  )),

  -- Method
  payment_method TEXT CHECK (IN ('card', 'cash', 'check', 'other')),
  card_last_four TEXT,
  card_brand TEXT,

  -- Status
  status TEXT CHECK (IN ('pending', 'succeeded', 'failed', 'refunded', 'partially_refunded')),

  -- Refund tracking
  refunded_amount_cents INTEGER DEFAULT 0,
  refund_reason TEXT,

  -- Metadata
  metadata JSONB DEFAULT '{}',

  created_at TIMESTAMPTZ DEFAULT NOW()
)

-- Tips (separate for reporting)
tips (
  id UUID PRIMARY KEY,
  org_id UUID REFERENCES organizations ON DELETE CASCADE,

  payment_id UUID REFERENCES payments,
  appointment_id UUID REFERENCES appointments,
  groomer_id UUID REFERENCES groomer_profiles,

  amount_cents INTEGER NOT NULL,

  created_at TIMESTAMPTZ DEFAULT NOW()
)

-- Memberships
memberships (
  id UUID PRIMARY KEY,
  org_id UUID REFERENCES organizations ON DELETE CASCADE,

  name TEXT NOT NULL,
  description TEXT,

  -- Pricing
  price_cents INTEGER NOT NULL,
  billing_interval TEXT CHECK (IN ('monthly', 'yearly')),

  -- Benefits
  benefits JSONB NOT NULL,
  -- { "discount_percentage": 15, "free_services": ["nail_trim"], "priority_booking": true }

  is_active BOOLEAN DEFAULT true,

  created_at TIMESTAMPTZ DEFAULT NOW()
)

-- Client Memberships
client_memberships (
  id UUID PRIMARY KEY,
  org_id UUID REFERENCES organizations ON DELETE CASCADE,

  client_id UUID REFERENCES clients ON DELETE CASCADE,
  membership_id UUID REFERENCES memberships,

  -- Stripe
  stripe_subscription_id TEXT,

  -- Status
  status TEXT CHECK (IN ('active', 'past_due', 'canceled', 'paused')),

  started_at TIMESTAMPTZ NOT NULL,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  canceled_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW()
)

-- Packages (Pre-paid)
packages (
  id UUID PRIMARY KEY,
  org_id UUID REFERENCES organizations ON DELETE CASCADE,

  name TEXT NOT NULL,
  description TEXT,

  -- What's included
  services JSONB NOT NULL,
  -- [{ "service_id": "...", "quantity": 5 }]

  -- Pricing
  price_cents INTEGER NOT NULL, -- Total package price
  savings_cents INTEGER, -- How much they save

  -- Validity
  valid_days INTEGER DEFAULT 365,

  is_active BOOLEAN DEFAULT true,

  created_at TIMESTAMPTZ DEFAULT NOW()
)

-- Client Packages
client_packages (
  id UUID PRIMARY KEY,
  org_id UUID REFERENCES organizations ON DELETE CASCADE,

  client_id UUID REFERENCES clients ON DELETE CASCADE,
  package_id UUID REFERENCES packages,

  -- Usage tracking
  services_remaining JSONB NOT NULL,
  -- [{ "service_id": "...", "remaining": 3 }]

  purchased_at TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,

  status TEXT CHECK (IN ('active', 'exhausted', 'expired')),

  created_at TIMESTAMPTZ DEFAULT NOW()
)
```

### 3.7 Notifications & Communications

```sql
-- Notification Templates
notification_templates (
  id UUID PRIMARY KEY,
  org_id UUID REFERENCES organizations ON DELETE CASCADE,

  name TEXT NOT NULL,
  type TEXT CHECK (IN ('sms', 'email')),
  trigger TEXT CHECK (IN (
    'booking_confirmation', 'booking_reminder_24h', 'booking_reminder_2h',
    'on_the_way', 'arrived', 'running_late', 'completed',
    'rebook_reminder', 'lapsed_client', 'review_request',
    'deposit_request', 'payment_receipt', 'membership_renewal'
  )),

  subject TEXT, -- For email
  body TEXT NOT NULL, -- Supports variables like {{client_name}}, {{pet_name}}, etc.

  is_active BOOLEAN DEFAULT true,

  created_at TIMESTAMPTZ DEFAULT NOW()
)

-- Notification Log
notification_log (
  id UUID PRIMARY KEY,
  org_id UUID REFERENCES organizations ON DELETE CASCADE,

  template_id UUID REFERENCES notification_templates,
  client_id UUID REFERENCES clients,
  appointment_id UUID REFERENCES appointments,

  type TEXT CHECK (IN ('sms', 'email')),
  recipient TEXT NOT NULL, -- phone or email

  subject TEXT,
  body TEXT NOT NULL,

  -- Delivery status
  status TEXT CHECK (IN ('pending', 'sent', 'delivered', 'failed', 'bounced')),
  external_id TEXT, -- Twilio/Resend message ID
  error_message TEXT,

  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW()
)
```

### 3.8 Analytics & Audit

```sql
-- Daily Metrics (pre-aggregated for dashboard)
daily_metrics (
  id UUID PRIMARY KEY,
  org_id UUID REFERENCES organizations ON DELETE CASCADE,

  date DATE NOT NULL,

  -- Bookings
  total_bookings INTEGER DEFAULT 0,
  completed_bookings INTEGER DEFAULT 0,
  no_shows INTEGER DEFAULT 0,
  cancellations INTEGER DEFAULT 0,

  -- Revenue
  total_revenue_cents INTEGER DEFAULT 0,
  tips_cents INTEGER DEFAULT 0,

  -- Utilization
  total_available_minutes INTEGER DEFAULT 0,
  total_booked_minutes INTEGER DEFAULT 0,

  -- Clients
  new_clients INTEGER DEFAULT 0,
  returning_clients INTEGER DEFAULT 0,

  -- Mobile specific
  total_route_miles DECIMAL(10, 2),

  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(org_id, date)
)

-- Audit Log
audit_log (
  id UUID PRIMARY KEY,
  org_id UUID REFERENCES organizations ON DELETE CASCADE,

  user_id UUID REFERENCES auth.users,

  action TEXT NOT NULL, -- 'create', 'update', 'delete'
  entity_type TEXT NOT NULL, -- 'appointment', 'client', 'payment', etc.
  entity_id UUID NOT NULL,

  -- What changed
  changes JSONB, -- { "field": { "old": "...", "new": "..." } }

  ip_address INET,
  user_agent TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
)
```

---

## 4. Project Structure

```
wagandwash/
├── .github/
│   └── workflows/
│       ├── ci.yml                 # Lint, test, type-check
│       └── preview.yml            # Vercel preview deployments
│
├── docs/                          # Documentation (see Section 1)
│
├── public/
│   ├── icons/                     # PWA icons
│   ├── manifest.json              # PWA manifest
│   └── sw.js                      # Service worker (generated)
│
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── (auth)/               # Auth routes (login, signup, etc.)
│   │   │   ├── login/
│   │   │   ├── signup/
│   │   │   ├── forgot-password/
│   │   │   └── layout.tsx
│   │   │
│   │   ├── (dashboard)/          # Authenticated app routes
│   │   │   ├── layout.tsx        # Dashboard shell
│   │   │   ├── page.tsx          # Dashboard home
│   │   │   ├── calendar/         # Scheduling views
│   │   │   ├── clients/          # Client CRM
│   │   │   ├── pets/             # Pet management
│   │   │   ├── appointments/     # Appointment management
│   │   │   ├── routes/           # Mobile route planning
│   │   │   ├── payments/         # Payments & transactions
│   │   │   ├── reports/          # Analytics dashboards
│   │   │   ├── settings/         # Org & user settings
│   │   │   └── team/             # Team management
│   │   │
│   │   ├── (booking)/            # Public booking portal
│   │   │   ├── [org-slug]/
│   │   │   │   ├── page.tsx      # Booking widget
│   │   │   │   └── confirm/
│   │   │   └── layout.tsx
│   │   │
│   │   ├── api/                   # API Routes
│   │   │   ├── auth/
│   │   │   ├── webhooks/
│   │   │   │   ├── stripe/
│   │   │   │   └── twilio/
│   │   │   ├── cron/             # Scheduled jobs
│   │   │   └── v1/               # REST API
│   │   │
│   │   ├── layout.tsx            # Root layout
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── ui/                   # shadcn/ui components
│   │   ├── forms/                # Form components
│   │   ├── calendar/             # Calendar components
│   │   ├── booking/              # Booking flow components
│   │   ├── clients/              # Client-related components
│   │   ├── pets/                 # Pet-related components
│   │   ├── mobile/               # Mobile ops components
│   │   └── shared/               # Shared components
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts         # Browser client
│   │   │   ├── server.ts         # Server client
│   │   │   ├── admin.ts          # Admin client (service role)
│   │   │   └── middleware.ts     # Auth middleware
│   │   │
│   │   ├── stripe/
│   │   │   ├── client.ts
│   │   │   └── webhooks.ts
│   │   │
│   │   ├── resend/
│   │   │   └── client.ts
│   │   │
│   │   ├── twilio/
│   │   │   └── client.ts
│   │   │
│   │   ├── google-maps/
│   │   │   ├── client.ts
│   │   │   └── routing.ts
│   │   │
│   │   └── utils/
│   │       ├── dates.ts
│   │       ├── currency.ts
│   │       ├── phone.ts
│   │       └── validation.ts
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── use-auth.ts
│   │   ├── use-org.ts
│   │   ├── use-appointments.ts
│   │   └── ...
│   │
│   ├── stores/                   # Zustand stores
│   │   ├── calendar-store.ts
│   │   ├── booking-store.ts
│   │   └── ui-store.ts
│   │
│   ├── types/
│   │   ├── database.ts           # Generated from Supabase
│   │   ├── api.ts
│   │   └── ...
│   │
│   └── config/
│       ├── constants.ts
│       ├── features.ts           # Feature flags per tier
│       └── routes.ts
│
├── supabase/
│   ├── migrations/               # SQL migrations
│   ├── seed.sql                  # Seed data
│   └── config.toml               # Supabase config
│
├── scripts/
│   ├── generate-types.ts         # Generate TypeScript from Supabase
│   └── seed-dev.ts               # Development seeding
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env.example
├── .env.local
├── CLAUDE.md                     # AI assistant context
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 5. Feature Gating by Tier

| Feature | Starter ($49/mo) | Pro ($99/mo) | Enterprise ($199/mo) |
|---------|------------------|--------------|----------------------|
| Groomers | 1 | 3 | Unlimited |
| Appointments/mo | 100 | 500 | Unlimited |
| Client CRM | ✓ | ✓ | ✓ |
| Online Booking | ✓ | ✓ | ✓ |
| SMS Reminders | 50/mo | 250/mo | Unlimited |
| Email Notifications | ✓ | ✓ | ✓ |
| Deposits | ✓ | ✓ | ✓ |
| Mobile Routing | Basic | Advanced | Advanced |
| Geofence Check-in | - | ✓ | ✓ |
| Live ETA | - | ✓ | ✓ |
| Memberships | - | ✓ | ✓ |
| Packages | - | ✓ | ✓ |
| Report Cards | - | ✓ | ✓ |
| Analytics Dashboard | Basic | Advanced | Advanced |
| Multi-location | - | - | ✓ |
| API Access | - | - | ✓ |
| Priority Support | - | - | ✓ |
| White-label | - | - | ✓ |

---

## 6. Implementation Phases

### Phase 1: Foundation & Core MVP (Weeks 1-6)

**Week 1-2: Infrastructure**
- [ ] Project setup (Next.js, TypeScript, Tailwind, shadcn/ui)
- [ ] Supabase project creation & schema migration
- [ ] Auth flow (signup, login, forgot password)
- [ ] Multi-tenant organization setup
- [ ] Basic RLS policies
- [ ] Vercel deployment pipeline
- [ ] Environment configuration

**Week 3-4: Core CRM & Booking**
- [ ] Client management (CRUD, search)
- [ ] Pet management with safety flags
- [ ] Service catalog management
- [ ] Basic appointment booking flow
- [ ] Calendar view (day, week)
- [ ] Drag-and-drop rescheduling

**Week 5-6: Payments & Notifications**
- [ ] Stripe integration (payments)
- [ ] Deposit collection flow
- [ ] Basic payment processing
- [ ] Resend email integration
- [ ] Twilio SMS integration
- [ ] Booking confirmation/reminder notifications

### Phase 2: Grooming Intelligence & Mobile (Weeks 7-10)

**Week 7-8: Grooming Intelligence**
- [ ] Grooming history timeline
- [ ] Coat/skin condition tracking
- [ ] Behavior/safety flag system
- [ ] Photo upload (before/after)
- [ ] Auto-generated report cards
- [ ] Groomer notes per pet

**Week 9-10: Mobile Operations**
- [ ] Google Maps integration
- [ ] Route optimization (time windows)
- [ ] Travel buffer calculation
- [ ] Mobile-specific booking flow
- [ ] Geofence check-in/out
- [ ] Live ETA notifications
- [ ] Offline mode (PWA)

### Phase 3: Retention & Business Tools (Weeks 11-14)

**Week 11-12: Retention Automation**
- [ ] Smart rebook interval suggestions
- [ ] Automated rebooking campaigns
- [ ] Lapsed client detection
- [ ] Review request automation
- [ ] Waitlist management
- [ ] Slot matching

**Week 13-14: Business Operations**
- [ ] Staff management & roles
- [ ] Groomer performance dashboard
- [ ] Basic analytics dashboard
- [ ] No-show policy enforcement
- [ ] Late cancellation fees
- [ ] Commission tracking

### Phase 4: Advanced Features (Weeks 15-18)

**Week 15-16: Monetization**
- [ ] Membership plans
- [ ] Pre-paid packages
- [ ] Stripe subscriptions
- [ ] Tip handling
- [ ] Split payments

**Week 17-18: Polish & Launch**
- [ ] Public booking portal
- [ ] Onboarding wizard
- [ ] Help documentation
- [ ] Performance optimization
- [ ] Security audit
- [ ] Launch prep

---

## 7. Critical Files to Create First

1. **CLAUDE.md** - AI context file (root)
2. **docs/ARCHITECTURE.md** - System architecture
3. **docs/DATABASE.md** - Full schema documentation
4. **supabase/migrations/001_initial_schema.sql** - Core tables
5. **src/lib/supabase/client.ts** - Supabase client setup
6. **src/app/layout.tsx** - Root layout with providers
7. **src/components/ui/** - Base UI components (shadcn)

---

## 8. Environment Variables

```env
# App
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_APP_NAME=WagAndWash

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Resend
RESEND_API_KEY=

# Twilio
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
GOOGLE_MAPS_SERVER_KEY=

# Feature Flags
NEXT_PUBLIC_ENABLE_MOBILE_OPS=true
NEXT_PUBLIC_ENABLE_MEMBERSHIPS=true
```

---

## 9. Verification Plan

### Local Development Testing
1. Run `npm run dev` - verify app starts
2. Create test organization through signup
3. Add services, clients, pets
4. Book appointment through calendar
5. Process test payment via Stripe test mode
6. Verify email/SMS delivery (test mode)

### Integration Testing
1. Run Supabase local with `supabase start`
2. Run migrations and verify schema
3. Test RLS policies with different user roles
4. Verify Stripe webhooks with Stripe CLI
5. Test offline mode functionality

### E2E Testing
1. Full booking flow (public portal → payment → confirmation)
2. Mobile workflow (booking → route → check-in → completion)
3. Grooming record creation with photos
4. Membership purchase and usage

---

## 10. Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Complex routing optimization | Use Google Routes API (proven), implement basic version first |
| Offline sync conflicts | Implement last-write-wins with conflict detection UI |
| Multi-tenant data leaks | RLS + thorough testing + audit logging |
| SMS/email costs | Implement usage limits per tier, monitor closely |
| Stripe Connect complexity | Start with direct charges, add Connect for multi-location later |

---

## Next Steps After Approval

1. Initialize Next.js project with TypeScript
2. Set up Supabase project and configure auth
3. Create initial database migration
4. Implement CLAUDE.md and core documentation
5. Build authentication flow
6. Begin Phase 1 implementation

---

## 11. Architecture Enhancements (Post-Review)

### 11.1 Additional Database Tables Required

```sql
-- Recurring Appointments
recurring_appointments (
  id UUID PRIMARY KEY,
  org_id UUID REFERENCES organizations ON DELETE CASCADE,
  client_id UUID REFERENCES clients,
  pet_ids UUID[],

  frequency TEXT CHECK (IN ('weekly', 'biweekly', 'monthly', 'custom')),
  day_of_week INTEGER, -- 0-6
  preferred_time TIME,
  groomer_id UUID REFERENCES groomer_profiles,

  services JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,

  last_generated_date DATE,
  next_due_date DATE,

  created_at TIMESTAMPTZ DEFAULT NOW()
)

-- Waitlist
waitlist (
  id UUID PRIMARY KEY,
  org_id UUID REFERENCES organizations,
  client_id UUID REFERENCES clients,
  pet_ids UUID[],

  preferred_dates DATE[],
  preferred_times TEXT[], -- 'morning', 'afternoon', 'evening'
  preferred_groomer_id UUID REFERENCES groomer_profiles,
  service_id UUID REFERENCES services,

  status TEXT CHECK (IN ('waiting', 'offered', 'booked', 'expired')),
  offered_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW()
)

-- Customer Credits/Gift Cards
customer_credits (
  id UUID PRIMARY KEY,
  org_id UUID REFERENCES organizations,
  client_id UUID REFERENCES clients,

  amount_cents INTEGER NOT NULL,
  remaining_cents INTEGER NOT NULL,

  type TEXT CHECK (IN ('refund', 'gift_card', 'loyalty', 'adjustment')),
  source_description TEXT,

  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
)

-- Inventory (for future POS)
inventory_items (
  id UUID PRIMARY KEY,
  org_id UUID REFERENCES organizations,

  name TEXT NOT NULL,
  sku TEXT,
  category TEXT,

  cost_cents INTEGER,
  price_cents INTEGER,

  quantity_on_hand INTEGER DEFAULT 0,
  reorder_threshold INTEGER,

  is_active BOOLEAN DEFAULT true
)

-- Product Usage Tracking
product_usage (
  id UUID PRIMARY KEY,
  org_id UUID REFERENCES organizations,

  appointment_id UUID REFERENCES appointments,
  inventory_item_id UUID REFERENCES inventory_items,

  quantity_used DECIMAL(10, 2),

  created_at TIMESTAMPTZ DEFAULT NOW()
)

-- Staff Commissions
commission_rules (
  id UUID PRIMARY KEY,
  org_id UUID REFERENCES organizations,

  name TEXT NOT NULL,
  type TEXT CHECK (IN ('percentage', 'flat', 'tiered')),

  -- For percentage
  percentage DECIMAL(5, 2),

  -- For tiered (JSONB)
  tiers JSONB,
  -- [{ "min": 0, "max": 2000, "percentage": 40 }, { "min": 2001, "max": null, "percentage": 50 }]

  applies_to TEXT CHECK (IN ('services', 'retail', 'tips', 'all')),

  is_active BOOLEAN DEFAULT true
)

groomer_commissions (
  id UUID PRIMARY KEY,
  org_id UUID REFERENCES organizations,

  groomer_id UUID REFERENCES groomer_profiles,
  appointment_id UUID REFERENCES appointments,

  base_amount_cents INTEGER NOT NULL,
  commission_amount_cents INTEGER NOT NULL,
  commission_rule_id UUID REFERENCES commission_rules,

  period_start DATE,
  period_end DATE,

  paid_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW()
)

-- Customer Reviews
reviews (
  id UUID PRIMARY KEY,
  org_id UUID REFERENCES organizations,

  appointment_id UUID REFERENCES appointments,
  client_id UUID REFERENCES clients,
  groomer_id UUID REFERENCES groomer_profiles,

  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,

  -- Internal response
  response TEXT,
  responded_at TIMESTAMPTZ,
  responded_by UUID REFERENCES auth.users,

  -- Visibility
  is_public BOOLEAN DEFAULT true,

  created_at TIMESTAMPTZ DEFAULT NOW()
)
```

### 11.2 Critical Database Indexes

```sql
-- Appointment scheduling (most critical for performance)
CREATE INDEX idx_appointments_groomer_date
  ON appointments (groomer_id, scheduled_date, scheduled_start)
  WHERE status NOT IN ('canceled', 'no_show');

CREATE INDEX idx_appointments_location_date
  ON appointments (location_id, scheduled_date);

CREATE INDEX idx_appointments_client
  ON appointments (client_id, scheduled_date DESC);

-- Route optimization
CREATE INDEX idx_appointments_mobile_date
  ON appointments (scheduled_date, appointment_type)
  WHERE appointment_type = 'mobile' AND status = 'confirmed';

-- Pet lookup for grooming intelligence
CREATE INDEX idx_pets_client ON pets (client_id);

-- Active safety flags (critical for safety)
CREATE INDEX idx_pet_safety_active
  ON pets USING gin(safety_flags)
  WHERE safety_flags != '{}';

-- Customer search (full text)
CREATE INDEX idx_clients_search ON clients
  USING gin(to_tsvector('english',
    first_name || ' ' || last_name || ' ' || COALESCE(email, '') || ' ' || COALESCE(phone, '')
  ));

-- Membership status
CREATE INDEX idx_client_memberships_active
  ON client_memberships (client_id, status)
  WHERE status = 'active';

-- Geofence events
CREATE INDEX idx_geofence_events_lookup
  ON appointments (id)
  WHERE groomer_checked_in_at IS NOT NULL;
```

### 11.3 Optimized RLS Pattern

```sql
-- Cache business IDs in a function for performance
CREATE OR REPLACE FUNCTION auth_business_ids()
RETURNS uuid[] AS $$
  SELECT array_agg(org_id)
  FROM org_members
  WHERE user_id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Active business from JWT claims
CREATE OR REPLACE FUNCTION auth_active_org_id()
RETURNS uuid AS $$
  SELECT COALESCE(
    (auth.jwt() -> 'user_metadata' ->> 'active_org_id')::uuid,
    (SELECT org_id FROM org_members WHERE user_id = auth.uid() LIMIT 1)
  )
$$ LANGUAGE sql STABLE;

-- Simplified RLS policies using these functions
CREATE POLICY "appointments_tenant" ON appointments
  FOR ALL USING (org_id = auth_active_org_id());

CREATE POLICY "clients_tenant" ON clients
  FOR ALL USING (org_id = auth_active_org_id());
```

### 11.4 Offline Sync Strategy

**Priority Levels for Sync Queue:**

| Priority | Actions | Rationale |
|----------|---------|-----------|
| CRITICAL | Geofence check-in/out, appointment status | Customer-facing, time-sensitive |
| HIGH | Grooming reports, safety flags | Data integrity, safety |
| NORMAL | Pet notes, appointment notes | Can tolerate delay |
| LOW | Photo uploads | Large payloads, can wait for WiFi |

```typescript
// src/lib/sync/priorities.ts
export const SYNC_PRIORITY = {
  CRITICAL: 0,
  HIGH: 1,
  NORMAL: 2,
  LOW: 3,
} as const;

export const SYNC_ACTIONS = {
  // Critical
  GEOFENCE_CHECK_IN: { type: 'geofence_check_in', priority: SYNC_PRIORITY.CRITICAL },
  GEOFENCE_CHECK_OUT: { type: 'geofence_check_out', priority: SYNC_PRIORITY.CRITICAL },
  APPOINTMENT_STATUS: { type: 'appointment_status', priority: SYNC_PRIORITY.CRITICAL },

  // High
  CREATE_GROOMING_REPORT: { type: 'grooming_report', priority: SYNC_PRIORITY.HIGH },
  ADD_SAFETY_FLAG: { type: 'safety_flag', priority: SYNC_PRIORITY.HIGH },

  // Normal
  ADD_PET_NOTE: { type: 'pet_note', priority: SYNC_PRIORITY.NORMAL },
  UPDATE_NOTES: { type: 'update_notes', priority: SYNC_PRIORITY.NORMAL },

  // Low
  UPLOAD_PHOTOS: { type: 'upload_photos', priority: SYNC_PRIORITY.LOW },
};
```

### 11.5 Stripe Integration Phasing

**Phase 1 (MVP)**: Direct Charges (No Connect)
- Deposits via PaymentIntents (manual capture)
- One-time payments for appointments
- Basic subscriptions for memberships

**Phase 2**: Add Stripe Connect (Express)
- When 10+ businesses need automated payouts
- Platform fee structure (2.9% + $0.30)
- Connected accounts for each grooming business

```typescript
// Phase 1 - Simple webhook events to handle
const PHASE1_WEBHOOKS = [
  'payment_intent.succeeded',
  'payment_intent.payment_failed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'invoice.payment_succeeded',
  'invoice.payment_failed',
];
```

### 11.6 Real-time Subscriptions Map

| Feature | Table | Events | Channel Pattern |
|---------|-------|--------|-----------------|
| Salon Dashboard | appointments | INSERT, UPDATE | `salon-${locationId}` |
| Groomer Mobile App | appointments | UPDATE, DELETE | `groomer-${groomerId}` |
| Route View | appointments | UPDATE | `route-${date}` |
| Customer ETA | appointments | UPDATE | `tracking-${appointmentId}` |
| Station Board | appointments | UPDATE | `stations-${locationId}` |

### 11.7 Route Optimization Strategy

**Primary**: Google Routes Optimization API
- Best for complex multi-stop routes with time windows
- Handles constraints (breaks, max appointments, avoid areas)
- ~$5-10 per 1,000 optimizations

**Fallback**: Simple nearest-neighbor algorithm
- For offline scenarios
- For routes < 4 stops
- Stored locally in IndexedDB

---

## 12. Documentation Files to Create

After approval, the following documentation files will be created:

```
/CLAUDE.md                          # AI assistant context (priority 1)
/docs/
├── ARCHITECTURE.md                 # System architecture overview
├── DATABASE.md                     # Full schema documentation
├── API.md                          # API routes and endpoints
├── DEPLOYMENT.md                   # Vercel deployment guide
├── SECURITY.md                     # Auth, RLS, data protection
├── modules/
│   ├── SCHEDULING.md               # Booking engine specs
│   ├── CRM.md                      # Client/pet management
│   ├── PAYMENTS.md                 # Stripe integration
│   ├── MOBILE-OPS.md               # Routing, geofencing
│   ├── NOTIFICATIONS.md            # SMS/Email automation
│   └── ANALYTICS.md                # Dashboard metrics
└── guides/
    ├── SETUP.md                    # Local dev setup
    ├── CONVENTIONS.md              # Code standards
    └── OFFLINE-SYNC.md             # PWA offline strategy
```

---

## IMPLEMENTATION APPROACH: UI-FIRST

**Strategy**: Build world-class UI first, then work backwards to connect functionality.

### UI-First Priorities:
1. Design system and component library
2. Dashboard shell and navigation
3. Calendar/scheduling views
4. Client/pet management interfaces
5. Booking flow
6. Mobile-responsive layouts
7. Then connect to backend services

*This plan provides a complete blueprint for building WagAndWash. Ready to proceed with UI-first implementation.*
