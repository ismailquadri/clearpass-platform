# Frontend Audit: Quick Reference Checklist

## For AI Agents — Rapid Assessment Format

---

## 🚀 QUICK WINS (Check These First — Easy Fixes, High Impact)

### Performance (5 min check)

- [ ] Lighthouse score > 80? (If <50, site feels slow)
- [ ] First Contentful Paint < 1.8s?
- [ ] No images >500KB?
- [ ] Mobile LCP < 2.5s?

### Critical Bugs (5 min check)

- [ ] Can I sign up → log in → use main feature without errors?
- [ ] Forms submit without duplicating on double-click?
- [ ] "No data" screens show helpful guidance, not blank?
- [ ] Links don't 404 (or 404 page is helpful)?

### Mobile Basics (5 min check)

- [ ] No horizontal scroll?
- [ ] Buttons at least 44x44px and tappable?
- [ ] Text readable without zoom (16px+ body)?
- [ ] Keyboard doesn't cover form inputs?

### Accessibility Basics (5 min check)

- [ ] Can I Tab through page without getting stuck?
- [ ] Can I see focus outline (keyboard nav)?
- [ ] Images have alt text (meaningful, not "image1")?
- [ ] Text contrast looks good (no light gray on white)?

### Engagement (5 min check)

- [ ] Is there a reason to come back? (Progress, streak, daily bonus?)
- [ ] Does the app celebrate wins? (Confetti, badge, toast?)
- [ ] Can I see my profile/personalization?
- [ ] Are notifications opt-in or respectfully sparse?

**TIME ESTIMATE: ~25 minutes for basic health check**

---

## 📋 FULL AUDIT CHECKLIST (Organized by Severity)

### CRITICAL (Product Cannot Ship)

- [ ] No rendering crashes (blank screens, console errors)
- [ ] Core features work on Chrome, Safari, Firefox
- [ ] Forms don't double-submit on double-click
- [ ] API failures show error message, not blank page
- [ ] LCP < 3.5s on mobile 4G
- [ ] CLS < 0.1 (layout doesn't jump around)
- [ ] No XSS vulnerabilities (content is escaped)
- [ ] All interactive elements keyboard-accessible
- [ ] Text contrast ≥ 4.5:1 (normal text)
- [ ] Modal closes with Escape key
- [ ] No broken links returning blank pages
- [ ] Responsive at 320px, 768px, 1440px breakpoints

### HIGH (Ship With These Fixed or Accept Known Issues)

- [ ] Loading states visible (spinners, skeletons, not blank)
- [ ] Confirmation on delete/destructive actions
- [ ] Error messages clear and inline (not "ERR_400")
- [ ] Form labels associated with inputs
- [ ] Icon buttons have aria-labels or tooltips
- [ ] Empty states helpful (show next steps, not blank)
- [ ] Hover/focus/active states visible on all buttons
- [ ] Tap targets 44x44px+ on mobile
- [ ] No fixed font sizes that break at 200% zoom
- [ ] Notification strategy defined (not spammy)
- [ ] Success states clear (user knows action worked)
- [ ] Images responsive (scale, not stretched)

### MEDIUM (Should Fix Soon After Launch)

- [ ] Progress/streaks visible (if applicable to product)
- [ ] Celebration animation on first significant action
- [ ] Customization options (dark mode, preferences)
- [ ] Semantic HTML (buttons not divs, nav not divs)
- [ ] Related content grouped logically
- [ ] Search function works and is visible
- [ ] Data tables have proper headers (<thead>, <th>)
- [ ] Breadcrumbs or path indicator visible
- [ ] Leaderboard or social comparison (if applicable)
- [ ] Achievement/badge system (if applicable)

### LOW (Nice-to-Have Polish)

- [ ] Easter eggs or playful moments
- [ ] Micro-animations (button press feedback)
- [ ] Personalized recommendations
- [ ] Custom 404 page
- [ ] Undo/redo functionality
- [ ] Scroll position restored on back
- [ ] Confetti on milestone achievement
- [ ] Custom error message tone (humor where appropriate)

---

## 🎯 ENGAGEMENT HOOKS SCORECARD

### Does the product have...

**Habit Loops?**

- [ ] Clear trigger (notification, email, internal motivation)
- [ ] Frictionless action (one-click if possible)
- [ ] Variable reward (not same every time)
- [ ] Investment step (profile, content, purchase)

**Progress Visibility?**

- [ ] User sees % complete or level progress
- [ ] Milestones celebrated (badge, toast, animation)
- [ ] Next goal visible ("3 more to unlock...")

**Streaks/Consistency Hooks?**

- [ ] Daily login streak visible
- [ ] Milestone streaks highlighted (7, 30, 365)
- [ ] "You'll lose streak if you don't..." motivation

**Social Mechanics?**

- [ ] Can compare with friends or see leaderboard
- [ ] Can see friend activity
- [ ] Can share achievements
- [ ] Can invite others

**Rewards System?**

- [ ] Points/XP visible and meaningful
- [ ] Badges achievable but not trivial
- [ ] Levels provide progression feeling
- [ ] Unlockables available (features, cosmetics)

**Personalization?**

- [ ] Profile customizable (avatar, bio, theme)
- [ ] Recommendations based on behavior
- [ ] Notification preferences user-controlled
- [ ] Dark/light mode toggle

**FTUE (First-Time User Experience)?**

- [ ] Product value clear within 3 seconds
- [ ] Aha moment < 5 minutes
- [ ] Tutorial/guide optional, not mandatory
- [ ] Welcome email sent post-signup
- [ ] No paywall before showing value

**Scoring:**

- 6–7 mechanics strong = Excellent retention potential
- 4–5 mechanics = Good engagement
- 2–3 mechanics = Basic, but will churn users
- 0–1 mechanics = No reason to return

---

## 🔍 TESTING CHECKLIST BY DEVICE

### Desktop (Chrome)

- [ ] LCP < 2.5s?
- [ ] All buttons tappable/clickable?
- [ ] Hover states visible?
- [ ] Modal/overlay stacking correct?

### Mobile (iPhone)

- [ ] No horizontal scroll?
- [ ] Tap targets 44x44px+?
- [ ] Keyboard doesn't hide input?
- [ ] Readable without zoom?
- [ ] Input type correct (email, tel, number)?

### Tablet (iPad)

- [ ] Landscape layout works?
- [ ] Portrait layout works?
- [ ] Touch targets adequate?

### Slow Network (3G)

- [ ] Loading states visible?
- [ ] Page usable while loading?
- [ ] Images load progressively?
- [ ] Timeouts handled (not infinite loading)?

### Screen Reader (NVDA/JAWS)

- [ ] Page purpose clear from h1?
- [ ] Navigation labeled (nav, landmark)?
- [ ] Form inputs have labels?
- [ ] Images have meaningful alt?
- [ ] Tables have headers?

### Keyboard Only (Tab/Shift-Tab/Enter/Escape)

- [ ] Can reach all interactive elements?
- [ ] Focus visible?
- [ ] Tab order logical?
- [ ] No traps (can't escape)?

### High Zoom (200%)

- [ ] Readable?
- [ ] Functional?
- [ ] No horizontal scroll?

---

## 🚨 CRITICAL RED FLAGS (Stop and Fix)

### Performance

- [ ] LCP > 4s on mobile = **CRITICAL**
- [ ] CLS > 0.25 = **CRITICAL** (layout jumping is annoying)
- [ ] "Error: undefined" visible to user = **CRITICAL**
- [ ] Images > 1MB = **HIGH**

### Functionality

- [ ] Forms submit twice on double-click = **CRITICAL**
- [ ] API failure shows no message = **CRITICAL**
- [ ] Modal can't be closed = **CRITICAL**
- [ ] Core feature broken on mobile = **CRITICAL**

### UX

- [ ] No indication when action completes = **HIGH**
- [ ] No loading spinner (appears frozen) = **HIGH**
- [ ] Buttons < 32px wide on mobile = **HIGH**
- [ ] Error message unclear ("Invalid input") = **MEDIUM**

### Accessibility

- [ ] Can't navigate with keyboard = **CRITICAL**
- [ ] No focus visible = **CRITICAL**
- [ ] Text contrast < 3:1 = **HIGH**
- [ ] No alt text on images = **HIGH**

### Security

- [ ] API tokens in localStorage = **CRITICAL**
- [ ] XSS vulnerability (unescaped HTML) = **CRITICAL**
- [ ] Mixed HTTP/HTTPS = **HIGH**
- [ ] File upload no validation = **MEDIUM**

### Engagement

- [ ] No reason to return (no progress, no reward) = **MEDIUM**
- [ ] Success happens silently = **MEDIUM**
- [ ] Notifications spam user (>5/day) = **MEDIUM**

---

## 📊 AUDIT SCORING SYSTEM

**Technical: 0–100**

- 90–100: Excellent (fast, reliable, no errors)
- 70–89: Good (minor issues, good baseline)
- 50–69: Acceptable (works but has friction)
- 30–49: Poor (multiple issues affecting UX)
- 0–29: Broken (not production-ready)

**UX: 0–100**

- 90–100: Delightful (clear, intuitive, polished)
- 70–89: Good (minor clarity issues)
- 50–69: Adequate (works but confusing in places)
- 30–49: Frustrating (unclear purpose, hard to use)
- 0–29: Broken (can't figure out how to use)

**Accessibility: A–F**

- A: Full WCAG AA compliance (keyboard, SR, contrast, etc.)
- B: Most WCAG AA (minor gaps)
- C: Some accessibility (basic only)
- D: Poor accessibility (major issues)
- F: Inaccessible (fails on multiple criteria)

**Engagement: 0–10 Hooks**

- 8–10: Habit-forming (multiple strong mechanics)
- 6–7: Engaging (good retention potential)
- 4–5: Basic engagement (users return for utility)
- 2–3: Limited hooks (churn risk)
- 0–1: No reason to return (one-time use only)

**Overall Grade: A–F**

- A: Ship it (minor polish only)
- B: Ship with known issues (non-critical items documented)
- C: Fix critical items, then ship
- D: Major issues, must fix before launch
- F: Not ready for users

---

## 📝 ISSUE DOCUMENTATION TEMPLATE

For each issue found, document:

```
**Issue ID:** [#1, #2, etc.]
**Feature/Page:** [Where it occurs]
**Severity:** CRITICAL | HIGH | MEDIUM | LOW
**Issue:** [What's wrong]
**Impact:** [Who's affected, how bad]
**Reproduction:** [Steps to reproduce]
**Recommendation:** [Specific fix, not vague]
**Effort:** [5 min | 30 min | 2 hours | 1 day | ?]
**Retention Impact:** [Does this affect user returning? Yes/No]
```

### Example:

```
**Issue ID:** #3
**Feature/Page:** Mobile Sign-Up Form
**Severity:** HIGH
**Issue:** Email input keyboard shows numeric instead of email type
**Impact:** Mobile users can't type @ symbol easily, form entry friction
**Reproduction:** On iOS, tap email input field in sign-up → notice numeric keyboard
**Recommendation:** Add `inputMode="email"` to email input or `type="email"`
**Effort:** 5 min
**Retention Impact:** Yes (signup friction = higher abandonment)
```

---

## 🎬 EXECUTION FLOW FOR AI AGENTS

1. **Setup (2 min)**
   - Open live product
   - Open DevTools (F12)
   - Open accessibility inspector
   - Have checklist ready

2. **Quick Health Check (25 min)**
   - Run through "QUICK WINS" section above
   - Document any blockers

3. **Deep Dive by Section (60 min)**
   - Technical (1.1–1.6 from full framework)
   - UX (2.1–2.6 from full framework)
   - A11y (3.1–3.5 from full framework)
   - Engagement (4.1–4.9 from full framework)

4. **Severity Sorting (10 min)**
   - Separate: CRITICAL | HIGH | MEDIUM | LOW
   - Order by: Impact × Frequency

5. **Reporting (15 min)**
   - Create report with summary + details
   - Provide actionable recommendations
   - Suggest quick wins first
   - Provide roadmap (what to fix when)

**TOTAL TIME: ~2 hours for comprehensive audit**

---

## 💡 SMART AGENT TIPS

**When auditing for Quadri's community (African/emerging market creatives):**

1. **Test on slower networks** (2G/3G simulation)
   - Your audience may be on slower connections
   - Performance issues hit harder in these markets

2. **Test on less common devices** (older Android phones, budget devices)
   - Not everyone has latest iPhone
   - Older browsers may not support modern CSS

3. **Check if product teaches value** (is a creative able to understand ROI?)
   - "How will this help me earn more?" should be clear quickly
   - Onboarding should show money/impact, not just features

4. **Retention = Income**
   - For creatives, repeated use = building momentum = monetization
   - Engagement hooks directly translate to user lifetime value
   - Flag any feature that prevents repeated visits

5. **Community & Social** > Solo Success
   - Creatives want to be seen, compared, celebrated
   - Social proof (leaderboards, shout-outs) drives higher ROI than points alone
   - Flag if product is isolating vs. community-building

---

**AUDIT BEGINS WHEN YOU HAVE THIS CHECKLIST**
**AUDIT ENDS WHEN EVERY SECTION IS DOCUMENTED**
