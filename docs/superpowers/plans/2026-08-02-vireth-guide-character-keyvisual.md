# Vireth Guide Character Key Visual Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the framed Ren and Duran portraits with complete transparent character silhouettes and carry the resulting visual language across the public guide.

**Architecture:** Keep the existing static HTML, CSS, and vanilla JavaScript structure. Generate two non-destructive WebP derivatives from approved source images, update the hero component and copy, then use the existing validation script and Playwright to verify all sections.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, ImageMagick, PowerShell, Playwright CLI, GitHub Pages.

## Global Constraints

- Preserve all 20 regions, six reader sections, six start scenarios, sliders, lightbox, and source data.
- Do not modify the approved character source files.
- Do not stage unrelated untracked lore or map files.
- Keep the first viewport connected to the region selection section.
- Use the same complete character assets on desktop and mobile.

---

### Task 1: Add key visual validation

**Files:**
- Modify: `scripts/validate_public_site.ps1`

- [ ] Add assertions for the two full cutout filenames, Korean character introductions, and character guide labels.
- [ ] Run `powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\validate_public_site.ps1`.
- [ ] Confirm the validator fails because the new markup and assets are absent.

### Task 2: Produce transparent character derivatives

**Files:**
- Create: `viewer/assets/illustrations/character_guides/ren-guide-full-cutout.webp`
- Create: `viewer/assets/illustrations/character_guides/duran-guide-full-cutout.webp`

- [ ] Remove only the connected light background from each source image.
- [ ] Trim transparent outer space without cutting the character silhouette.
- [ ] Resize within a 1200×1800 canvas while preserving aspect ratio.
- [ ] Confirm alpha channel, dimensions, and visible hands and shoulders.

### Task 3: Implement the paired character key visual

**Files:**
- Modify: `index.html`

- [ ] Replace the existing hero guide images with the full cutouts.
- [ ] Replace bottom captions with visible Korean and English names and one-line introductions.
- [ ] Remove framed portrait backgrounds and use teal/red accent rules.
- [ ] Add responsive positioning that preserves both silhouettes.

### Task 4: Carry the visual language through the page

**Files:**
- Modify: `index.html`

- [ ] Normalize section eyebrows and icon accents to teal, red, and gold.
- [ ] Keep region cards image-led while reducing decorative nesting.
- [ ] Ensure reader and start sections use the same compact title hierarchy.
- [ ] Preserve sliders, lightbox, and lazy loading behavior.

### Task 5: Verify and publish

**Files:**
- Test: `scripts/validate_public_site.ps1`

- [ ] Run the validator, JavaScript parse check, asset-path check, and `git diff --check`.
- [ ] Inspect 1280×900 and 390×844 screenshots.
- [ ] Confirm zero horizontal overflow, zero broken images, and zero console errors.
- [ ] Stage only the plan, spec, HTML, validator, and two new character assets.
- [ ] Commit, push to `main`, and verify the GitHub Pages URL.
