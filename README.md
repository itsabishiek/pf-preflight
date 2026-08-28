# PF Compass

### PF Transfer Preflight

**Know what needs fixing before you submit.**

PF Compass is an independent, citizen-first prototype that rethinks the PF transfer experience around one simple idea: **help people understand potential problems before they submit, and guide them when something goes wrong.**

> **This is an independent hackathon prototype and is not an official EPFO service or government product.**

---

## The Problem

Transferring a PF after changing jobs can involve multiple employment records, KYC information, service history, employment dates, and other conditions.

The difficult part is often not finding the transfer option. The difficult part is understanding:

- whether the transfer is ready to submit
- which previous employment record is relevant
- what a potential issue actually means
- what needs to be fixed
- what to do after a rejection or unexpected state
- whether the user needs to take action or simply wait

A traditional workflow can feel like:

```text
Find the service
      ↓
Fill in the details
      ↓
Submit
      ↓
Wait
      ↓
Something goes wrong
      ↓
"What do I do now?"
```

PF Compass rethinks that journey as:

Understand
↓
Check
↓
Identify potential issues
↓
Understand why
↓
Resolve
↓
Submit
↓
Track
↓
Recover if needed

---

## Our Approach

PF Compass introduces **PF Transfer Preflight** — a guided experience that checks common readiness conditions for a selected PF transfer before submission.

Instead of treating the user as someone who already understands EPFO terminology and workflows, the experience is organized around the user's intent and context.

### Core principles

**Prevention**

Surface common issues before submission rather than making users discover them later.

**Explanation**

Turn technical or unfamiliar states into clear, citizen-friendly explanations.

**Recovery**

When something goes wrong, provide a meaningful next step instead of leaving the user at a dead end.

**Intent over terminology**

Users should be able to navigate the service without first understanding government forms and terminology.

**Transparency**

The system clearly distinguishes between deterministic checks, simulated behavior, and future possibilities.

---

## Key Features

### 1. PF Transfer Preflight

Before submission, users can review common readiness conditions for their specific transfer.

Examples include:

- UAN status
- Identity KYC
- Bank KYC
- Employment information
- Date of Exit
- Service / pension history

The checks are deterministic and designed to be understandable and inspectable.

---

### 2. Source → Destination Transfer Context

Users explicitly choose the previous employment record they want to transfer from.

The current employment is shown as the destination.

```text
Previous employment
        ↓
Mosaic Retail Services

        →

Current destination
        ↓
Cedar Works India
```

This makes the transfer relationship clear throughout the journey.

---

### 3. Interactive Employment Journey

The user's synthetic employment history is presented as a chronological journey.

Each previous employment record can be selected and evaluated independently.

This prevents the readiness experience from feeling like a generic checklist detached from the user's actual transfer.

---

### 4. Contextual Issue Explanation

When a potential issue is detected, PF Compass explains:

- where the issue was found
- what was detected
- why it matters
- what the user should do first
- what could happen if the user continues without resolving it

The goal is not simply to display an error.

The goal is to answer:

> **"What does this mean, and what should I do next?"**

---

### 5. Recovery Experience

The product treats an issue as part of the journey rather than a dead end.

The simulated recovery flow allows the user to:

```text
Issue detected
      ↓
Understand
      ↓
Resolve
      ↓
Recheck
      ↓
Ready
```

The original transfer context is preserved throughout recovery.

---

### 6. Optional Assisted Journey Discovery

Users who already know what they need can continue using the normal structured journey selection.

For users who are unsure, PF Compass provides an optional natural-language entry point:

> **Not sure where to start? Tell us what happened.**

The user can describe their problem in their own words.

For example:

> "I changed jobs and my old PF hasn't transferred."

Gemini classifies the description into one of the available journey categories and suggests the most appropriate starting point.

The user must confirm the suggestion before entering the journey.

---

## AI Usage

Gemini is intentionally used in a **narrow and controlled role**.

### Gemini is used for:

- natural-language journey intent classification
- understanding user descriptions
- multilingual intent understanding

### Gemini is NOT used for:

- deciding EPFO eligibility
- determining claim approval/rejection
- calculating official outcomes
- interpreting government policy as an authority
- deciding readiness
- accessing EPFO systems
- submitting real government transactions

The core transfer and readiness logic remains deterministic.

```text
User description
      ↓
Gemini intent classification
      ↓
User confirmation
      ↓
Existing deterministic journey
      ↓
Readiness engine
```

If Gemini is unavailable, users can always fall back to the normal structured journey selection.

---

## Prototype Scope

This project intentionally uses **synthetic data and simulated government behavior**.

The prototype does not:

- connect to live EPFO systems
- use real UAN credentials
- collect Aadhaar/PAN details
- collect real bank information
- perform real OTP verification
- submit actual EPFO claims
- track real government transactions
- use undocumented or private EPFO APIs
- scrape EPFO
- imply government endorsement

All member records, claim states, references, timestamps, and processing events are fictional.

This allows the prototype to demonstrate the experience safely without pretending to have production access to government systems.

---

## Scalability Vision

PF Compass is designed conceptually as a **citizen guidance layer**, rather than a replacement for government systems.

The current prototype focuses only on EPFO PF transfer.

The longer-term architecture could look like:

```text
Citizen Experience
        ↓
Journey Orchestration
        ↓
Readiness Engine
        ↓
Recovery Engine
        ↓
Government Adapter
        ↓
Official Public-Service Systems
```

This separation means the citizen experience does not need to be completely redesigned every time an underlying government system changes.

Future journeys could include:

- PF withdrawal
- PF advance claims
- KYC/profile corrections
- Date of Exit issues
- UAN-related problems
- pension-related journeys
- grievance guidance
- additional public-service systems

These are future possibilities and are not part of the current prototype.

---

## Technology

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### UI

- shadcn/ui
- Lucide Icons

### AI

- Google Gemini API
- `@google/genai`

### Architecture

- Deterministic readiness rules
- Local synthetic data
- Client-side journey state
- Server-side Gemini route for intent classification

---

## Project Structure

A simplified view of the project:

```text
src/
├── app/
│   ├── api/
│   │   └── journey-intent/
│   └── ...
│
├── components/
│
├── data/
│   └── mock-member.ts
│
├── features/
│   └── transfer/
│       ├── components/
│       └── rules/
│
├── lib/
│
└── types/
    └── transfer.ts

docs/
└── PROJECT_MEMORY.md
```

---

## Example Journey

A typical demonstration follows this path:

```text
Landing page
      ↓
Choose a journey
      ↓
Describe the problem OR select Transfer my PF
      ↓
Confirm journey
      ↓
Choose previous employment
      ↓
View source → destination
      ↓
Run transfer preflight
      ↓
Potential issue detected
      ↓
Review issue
      ↓
Understand why it matters
      ↓
Resolve simulated issue
      ↓
Re-run preflight
      ↓
Ready to continue
      ↓
Review transfer
      ↓
Submit simulated transfer
      ↓
Track progress
      ↓
Simulate issue
      ↓
Recover
      ↓
Retry
      ↓
Completed
```

---

## Why PF Compass?

The product is based on a simple observation:

> Government services should not require citizens to become experts in government processes before they can successfully use them.

A dashboard can tell a user **what happened**.

PF Compass aims to tell them:

> **what happened + why it matters + what to do next**

The core idea is:

# Don't discover the problem after you submit.

---

## Running Locally

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env.local` file:

```env
GEMINI_API_KEY=your_gemini_api_key
```

The Gemini API key must remain server-side and must never be exposed to client-side code.

### 3. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## Validation

The project is validated with:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

The application is also designed so that the core product remains usable when Gemini is unavailable.

---

## Important Disclaimer

PF Compass is an **independent hackathon prototype**.

It is not affiliated with, endorsed by, or operated by EPFO or the Government of India.

All account information, transfer states, references, and processing behavior shown in the prototype are synthetic or simulated.

The prototype demonstrates a proposed citizen experience and does not perform real government transactions.
