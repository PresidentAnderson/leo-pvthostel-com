# PVT Hostel Leo Design System
## Master Brief – November 2025 Edition

This document defines the premium UI standards for PVT Hostel Leo's web presence.

---

## 1. Brand Tokens (Core)

### Colors

| Token            | Value            | Usage                        |
|------------------|------------------|------------------------------|
| `brand-black`    | #0E0E0E          | hero, flash sale background  |
| `brand-gold`     | #D3A867          | accents, buttons, highlights |
| `brand-white`    | #FFFFFF          | cards, forms                 |
| `text-primary`   | #111111          | headers                      |
| `text-secondary` | #555555          | descriptions                 |
| `divider-light`  | rgba(0,0,0,0.08) | separators                   |

### Usage Guidelines
- **Primary Actions:** Gold (`#D3A867`) on dark backgrounds
- **Secondary Actions:** Black (`#0E0E0E`) on light backgrounds
- **Text Hierarchy:** Primary for headers, Secondary for body copy
- **Contrast:** Minimum 5:1 ratio for accessibility (WCAG AA)

---

## 2. Typography

### Font Family
- **Primary:** Inter / DM Sans (system fallback: -apple-system, BlinkMacSystemFont, sans-serif)
- **Monospace:** SF Mono / Consolas (for countdown timers)

### Type Scale

| Level | Size      | Weight    | Line Height | Usage                    |
|-------|-----------|-----------|-------------|--------------------------|
| H1    | 48-64px   | bold      | 1.1         | Hero headlines           |
| H2    | 32-40px   | semibold  | 1.2         | Section titles           |
| H3    | 24px      | medium    | 1.3         | Card headers             |
| Body  | 16-18px   | regular   | 1.6         | Main content             |
| Small | 14px      | regular   | 1.5         | Meta text, captions      |
| Micro | 12px      | medium    | 1.4         | Labels, badges           |

### Tone
Minimalist, calm, premium. Avoid excessive punctuation or ALL CAPS (except for subtle labels).

---

## 3. Spacing & Layout

### Section Spacing
- **Vertical Padding:** 80-120px (desktop), 60px (mobile)
- **Horizontal Padding:** 24px (mobile), 48px (tablet), 96px (desktop)

### Card Spacing
- **Desktop:** 32px internal padding
- **Mobile:** 20px internal padding
- **Gap between elements:** 16px (default), 24px (loose)

### Grid System
- **Desktop:** 2×2 grid for forms, 3-column for galleries
- **Tablet:** 2-column
- **Mobile:** Single column, full-width cards

### Border Radius
- **Cards:** 12px (standard), 16px (large cards)
- **Buttons:** 24px (full rounded)
- **Inputs:** 12px

---

## 4. Component Specifications

### Flash Sale Card

#### Structure
- Dark block with gold accents
- Max-width: 1200px, centered
- Faint background texture at 12% opacity
- Gold accent line: 4px height at top

#### Elements
1. **Label:** Uppercase, 0.25em letter-spacing, gold color
2. **Headline:** 32-40px, semibold, white
3. **Countdown:** Monospace font, 18-20px, with clock icon
4. **CTA Button:** Gold background, black text, rounded-full

#### States
- **Default:** Gold button (#D3A867)
- **Hover:** Darker gold (#c39855)
- **Focus:** Ring-2 ring-gold with offset
- **Timer < 5 min:** Warning color (#F59E0B) with optional pulse

#### Accessibility
- `aria-live="polite"` on countdown
- `aria-hidden="true"` on decorative icons
- Keyboard focus visible (ring-2)
- Minimum contrast 5:1

---

### Booking Card

#### Layout
- White background, shadow-2xl
- 2×2 grid (desktop) → 1×4 (mobile)
- Form inputs with icon prefixes

#### Input Fields
- **Border:** 1px solid gray-300
- **Focus State:** ring-2 ring-gold, border-black
- **Error State:** border-red-500
- **Disabled State:** opacity-50

#### Form Elements
1. **Labels:** Font-medium, text-primary
2. **Inputs:** Full-width, outline-none
3. **Icons:** Gray-500, 20px, left-aligned
4. **Submit Button:** Black background, white text, full-width on mobile

#### States
- **Focus:** Shadow + ring effect
- **Validation:** Real-time error display
- **Loading:** Disabled state with spinner

#### Accessibility
- Each input paired with `<label>`
- Keyboard navigation support
- Screen reader labels for date inputs
- Clear error messaging

---

## 5. Responsive Breakpoints

| Breakpoint | Width    | Layout Changes                    |
|------------|----------|-----------------------------------|
| XL         | ≥1280px  | Full layout, wide cards, centered |
| LG         | ≥1024px  | 2-column grid, reduced spacing    |
| MD         | ≥768px   | 2-column forms, stacked sections  |
| SM         | <768px   | Single column, full-width buttons |

### Mobile-First Approach
- Start with mobile layout
- Progressively enhance for larger screens
- Touch targets minimum 44px × 44px
- Reduce vertical spacing by 30% on mobile

---

## 6. Interaction & Motion

### Transitions
- **Duration:** 150ms (fast), 300ms (standard)
- **Easing:** ease-out for all interactions
- **Properties:** transform, opacity, background-color

### Animations
1. **Card Entrance:** Fade-in + 10px upward slide, 300ms
2. **Button Hover:** Scale 1.02, 150ms
3. **Focus Ring:** Instant appearance (0ms)
4. **Countdown:** Real-time update, no animation

### Scroll Behavior
- Smooth scroll on anchor links
- Parallax effects: subtle (0.3-0.5 speed)
- No scroll hijacking

---

## 7. Accessibility Standards

### WCAG 2.1 Level AA Compliance
- Color contrast minimum 5:1
- Focus indicators always visible
- Keyboard navigation for all interactive elements
- Screen reader support (ARIA labels)

### Best Practices
- Semantic HTML (header, nav, main, footer)
- Alt text for all images
- Skip navigation links
- No reliance on color alone for information

---

## 8. Asset Guidelines

### Images
- **Hero:** 1920×1080px minimum, WebP format
- **Cards:** 800×600px, optimized for Retina
- **Icons:** SVG preferred, 24px grid

### Montreal Skyline Texture
- Path: `/montreal-skyline.png`
- Opacity: 12% on dark backgrounds
- Position: center/cover

---

## 9. Code Standards

### Tailwind CSS Usage
```tsx
// Preferred: Utility classes
className="bg-[#0E0E0E] text-white rounded-2xl p-10"

// Avoid: Inline styles
style={{ backgroundColor: '#0E0E0E' }}
```

### Component Structure
```tsx
"use client"; // For interactive components
import { Icon } from "lucide-react";

export default function ComponentName() {
  return (
    <section className="...">
      {/* Component content */}
    </section>
  );
}
```

---

## 10. Implementation Checklist

When implementing new components:

- [ ] Uses brand color tokens
- [ ] Follows type scale
- [ ] Responsive breakpoints tested
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Focus states visible
- [ ] Hover states smooth
- [ ] Loading states handled
- [ ] Error states clear
- [ ] Mobile touch targets ≥44px

---

## Next Steps

1. Generate high-fidelity canvas mockups
2. A/B test flash sale variants
3. Integrate with booking API
4. Add analytics tracking
5. Performance audit (Lighthouse 90+)

---

**Document Version:** 1.0
**Last Updated:** November 2025
**Maintained By:** PVT Hostel Leo Development Team
