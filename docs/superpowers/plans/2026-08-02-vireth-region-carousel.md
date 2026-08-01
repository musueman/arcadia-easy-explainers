# Vireth Region Carousel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the twenty-region selector into a compact, accessible, single-row horizontal carousel.

**Architecture:** Keep the existing region data and article renderer. Add a carousel shell around `regionGrid`, centralize region selection in `selectRegion(index, options)`, and have buttons, clicks, scrolling, and keyboard input call that same function.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, PowerShell validation, Playwright browser checks.

## Global Constraints

- Preserve the current cinematic editorial article layout and all twenty regions.
- Do not introduce a JavaScript framework or a carousel dependency.
- Keep unrelated untracked lore and map files outside the commit.

---

### Task 1: Region Carousel Contract

**Files:**
- Modify: `scripts/validate_public_site.ps1`
- Modify: `index.html`

**Interfaces:**
- Consumes: existing `regions`, `regionGrid`, and `renderRegionDetail(index)`.
- Produces: `regionPrev`, `regionNext`, `regionPosition`, and `selectRegion(index, options)`.

- [x] **Step 1: Write the failing validation**

Add assertions for `region-index-shell`, two `region-index-control` buttons, `regionPosition`, and a `regionGrid` keyboard listener.

- [x] **Step 2: Run validation to verify failure**

Run: `powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\validate_public_site.ps1`

Expected: FAIL because the carousel shell is absent.

- [x] **Step 3: Implement the carousel**

Add the one-row scroll-snap CSS, previous/next controls, live position label, and centralized selection logic.

- [x] **Step 4: Run validation**

Run: `powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\validate_public_site.ps1`

Expected: `PUBLIC_SITE_VALIDATION_OK regions=20`.

- [x] **Step 5: Verify responsive behavior**

Use Playwright at 1280x900, 768x1024, and 390x844. Confirm one card row, no page overflow, working buttons and arrow keys, visible selected article, zero broken images, and zero console errors.

- [ ] **Step 6: Publish**

Stage only the implementation, validator, spec, and plan; commit, push to `main`, and verify the GitHub Pages URL.
