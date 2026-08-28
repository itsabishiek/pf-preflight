# PF Compass — Project Memory

## Product

PF Compass

## Flagship journey

PF Transfer Preflight

## One-line description

A citizen-first guidance layer that helps EPFO members understand whether they are ready for a PF journey, identify potential blockers before submission, and recover when something goes wrong.

## Core promise

> Know what needs fixing before you submit your EPFO request.

## Primary user

An Indian employee who has changed jobs and wants to transfer their previous PF/service to their current employment.

## Primary pain

The user may not know whether their records are ready, what a government-side issue means, or what to do after a failed transfer.

## Primary solution

PF Transfer Preflight.

## Key concept

Prevention + Explanation + Recovery.

## Product philosophy

Do not redesign every EPFO page. Redesign the user's decision journey.

## Main interaction model

Intent → Understand → Preflight → Identify blockers → Explain → Fix → Recheck → Submit → Track → Recover if needed

## AI philosophy

AI may assist with intent understanding, explanation, translation, and personalization. AI must not be treated as the authoritative source for government rules. Business/readiness logic should remain deterministic and inspectable.

## Source-of-truth philosophy

Use official EPFO/publicly documented rules and processes as the basis for factual government workflow behavior. Never invent rules merely to make the prototype work.

## Prototype boundary

All government interactions are simulated. All member information is synthetic. No real credentials, live government API, undocumented API, scraping, or private system access.

## Scalability thesis

The long-term concept is a reusable citizen guidance layer that can sit in front of multiple public-service systems.

Citizen Experience → Journey Orchestration → Readiness Engine → Recovery Engine → Government Adapter

The hackathon prototype only demonstrates EPFO PF Transfer.

## Future possibilities

PF withdrawal, PF advance claims, KYC/profile corrections, Date of Exit issues, UAN issues, pension-related journeys, claim recovery, and grievance guidance. These should not distract from the transfer MVP.

## Product differentiator

This is not an AI chatbot for EPFO. It is a preflight and recovery experience that helps citizens understand whether they are ready and what they can do next.

## Competitive positioning

A dashboard tells a citizen what happened. PF Compass should tell them what happened, why, and what they can do next.

## Design philosophy

Trustworthy, calm, simple, mobile-first, accessible, plain-language, and progressively disclosed. Avoid excessive AI visual gimmicks and generic SaaS dashboard aesthetics.

## Demo story

A fictional employee wants to transfer their PF. The system detects a potential issue before submission, explains the problem, and gives the user a simulated recovery path. Readiness becomes successful, then the user submits and sees a timeline. A future phase may demonstrate rejection and recovery.

## Hackathon honesty

This is an independent prototype, not an official EPFO product. It does not imply EPFO or government endorsement. Mock data and simulated backend behavior are intentional.

## North-star question

At every stage ask: What does the citizen need to understand or do next?

## Phase 3

Phase 3 intentionally contains no LLM. Its objective is to make the core transfer journey intelligent through deterministic rules, state-aware interaction, contextual readiness, issue investigation, and recovery.

## AI Roadmap

AI is intentionally deferred to Phase 4. Phase 4 may introduce optional Gemini-powered natural-language journey discovery for people who do not know which service to select. The direct structured journey selector remains the primary path.

## Phase 3 Product Principle

The product should feel intelligent because it understands the user's selected transfer context and responds to it, not because an AI model is present.

## Phase 3.5

Focused on UX cohesion rather than new functionality.

The transfer source/destination relationship remains persistent throughout the journey.

The employment history acts as contextual journey navigation.

Issue explanation and recovery are tied to the selected transfer.

AI remains intentionally deferred to Phase 4.

## Phase 4 — Assisted Journey Discovery

Users still primarily choose from structured journey options. For users who do not know which service they need, the product provides an optional natural-language discovery experience.

Gemini classifies a description into one of:

* TRANSFER_PF
* WITHDRAW_PF
* TRACK_REQUEST
* FIX_ISSUE
* UNKNOWN

The user must confirm the suggested journey. Gemini does not determine EPFO eligibility, policy, readiness, claim outcomes, or government procedures.

## AI Architecture

Natural language → Gemini intent classification → User confirmation → Existing deterministic journey

## AI Failure Principle

PF Compass remains fully usable without Gemini. If Gemini fails or is unavailable, direct journey selection remains available.

## Multilingual AI

Natural-language journey discovery can accept English, Hindi, Tamil, and other supported languages without requiring the user to change the interface language first.

## Final Product Direction

PF Compass focuses on one deep citizen journey: PF Transfer Preflight. The product is intentionally narrow for the hackathon. PF Transfer Preflight is currently the only fully implemented flagship journey; future journeys may sit beneath PF Compass.

## Product Differentiators

1. Preflight — identify common readiness issues before submission.
2. Recovery — explain what went wrong and what the citizen should do next.
3. Assisted discovery — optionally help users identify the correct starting journey from natural language.

## AI Role

Gemini is only used for optional journey-intent classification. The core transfer flow remains deterministic.

## Final Demo

The preferred judge demonstration starts with: “I changed jobs and my PF hasn't transferred.” The system identifies Transfer my PF, confirms the journey, runs preflight, exposes a simulated issue, explains it, resolves it, submits, tracks, demonstrates a recovery state, and completes the simulated journey.
