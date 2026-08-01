# Vireth Region Carousel Design

## Goal

Replace the tall twenty-region grid with a single horizontal selection strip so the selected region article remains visible close beneath it.

## Interaction

- The strip shows several regions on desktop and about one region on mobile.
- Previous and next controls move one region at a time.
- Touch scrolling, mouse/trackpad horizontal scrolling, and left/right arrow keys select regions.
- The selected region moves into view, updates the position label, and refreshes the existing article below.
- Navigation stops at the first and last region; it does not wrap.

## Layout

- Preserve the current cinematic editorial region article.
- Keep all twenty region cards and their existing crest, summary, capital, and focus text.
- Use one row at every viewport width.
- Hide the native scrollbar while retaining scrolling.
- Keep controls inside the strip edge so they do not cause page overflow.

## Verification

- The source contains one slider shell, two controls, and a live position label.
- Desktop and mobile show a single region-card row with no page-level horizontal overflow.
- Mouse, touch, button, and keyboard selection update the same region detail.
- Existing image and public-content validations continue to pass.
