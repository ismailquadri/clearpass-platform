# Frontend Audit Framework for AI Agents
## Detailed Instructions for Technical & UX Assessment + Engagement Hooks

---

## OVERVIEW
You are auditing a digital product's frontend for **technical robustness**, **user experience quality**, **accessibility compliance**, **engagement mechanics**, and **retention hooks**. The audit should identify both critical failures and missed opportunities for user delight.

Each section includes specific checks, scoring criteria, and actionable recommendations.

---

## SECTION 1: TECHNICAL FUNCTIONALITY AUDIT

### 1.1 Performance & Load Time
**Critical Metrics:**
- First Contentful Paint (FCP): Target < 1.8s
- Largest Contentful Paint (LCP): Target < 2.5s
- Cumulative Layout Shift (CLS): Target < 0.1
- Time to Interactive (TTI): Target < 3.5s

**Checks:**
- [ ] Open DevTools → Lighthouse → Run Performance Audit
- [ ] Check for unused CSS, JavaScript, and image assets
- [ ] Verify lazy loading on images below the fold
- [ ] Test on slow 3G connection (DevTools → Network throttling)
- [ ] Check for render-blocking resources (CSS/JS loaded synchronously)
- [ ] Verify fonts are optimized (WOFF2, preload critical fonts)
- [ ] Test mobile performance separately (often 2–3x slower than desktop)

**Red Flags:**
- Images larger than 500KB sent over the wire
- Multiple blocking scripts in `<head>`
- No minification of CSS/JS in production
- Uncompressed or oversized font files
- Images not responsive to device pixel ratio

**Scoring:** 
- Excellent: All Core Web Vitals green
- Good: 1–2 yellows, no reds
- Poor: Any red, LCP > 3s, CLS > 0.25

---

### 1.2 Browser Compatibility & Cross-Platform Testing

**Checks:**
- [ ] Desktop: Chrome, Firefox, Safari, Edge (latest 2 versions)
- [ ] Mobile: iOS Safari, Chrome Android, Samsung Internet
- [ ] Tablet: iPad (landscape + portrait), Android tablets
- [ ] Feature detection: Flexbox, Grid, CSS variables, fetch API
- [ ] Polyfills for older browsers if targeting IE11 or older Android

**Test Each:**
- Responsive layout shifts at breakpoints (320px, 375px,768px, 1024px, 1440px)
- Form submissions and validation
- Modal/overlay rendering and focus management
- Animations and transitions (frame rate consistency)
- Touch interactions (tap targets, swipe, pinch-zoom)

**Red Flags:**
- Layout breaks at any standard breakpoint
- Buttons/links unclickable on mobile
- Horizontal scroll appears unexpectedly
- Text rendering inconsistent across browsers
- Animations stutter or drop below 30fps on mobile

---

### 1.3 API Integration & Data Handling

**Checks:**
- [ ] All API endpoints return correct status codes (200, 400, 401, 404, 500)
- [ ] Error responses are user-friendly (not raw JSON dumps)
- [ ] Network failures gracefully degrade (show fallback UI, not blank)
- [ ] Timeout handling: API calls timeout after 10–30s
- [ ] Polling/real-time updates don't spam the network
- [ ] Form submissions handle duplicate submissions (disable button post-submit)
- [ ] File uploads show progress and handle cancellation
- [ ] Search/filter debouncing prevents excessive API calls

**Data Validation:**
- [ ] Empty state handled gracefully (not "undefined" or broken UI)
- [ ] Null/undefined fields don't crash the UI
- [ ] Large datasets paginated (not loading 10,000 items at once)
- [ ] Date/timezone handling correct for user's locale
- [ ] Numbers formatted with proper separators (1,000 vs 1000)

**Red Flags:**
- "Error: undefined" displayed to user
- Form submits multiple times if user clicks twice
- No loading state during API call (appears frozen)
- Failed API calls silently fail (no error message)
- Sensitive data (tokens, passwords) logged to console

---

### 1.4 Form Handling & Validation

**Checks:**
- [ ] Real-time validation (debounced, not on every keystroke)
- [ ] Clear, inline error messages (not just red borders)
- [ ] Error messages positioned below/near invalid field
- [ ] Form fields preserve state on page reload (localStorage if needed)
- [ ] Required fields marked visually (`*` or `aria-required`)
- [ ] Submit button disabled while request pending
- [ ] Successful submission shows confirmation (toast, modal, or redirect)
- [ ] Form data cleared after successful submission
- [ ] Password field has toggle to show/hide password

**Validation Rules:**
- [ ] Email: RFC 5322 compliant or client-side regex acceptable
- [ ] Phone: Regional formatting respected
- [ ] Dates: Locale-aware parsing (MM/DD vs DD/MM)
- [ ] URLs: Valid protocol check
- [ ] Passwords: Strength indicator helpful but not annoying

**Red Flags:**
- Validation only runs on submit (too late for user)
- Error messages are cryptic ("ERR_400_INVALID_INPUT")
- Form allows invalid submissions
- No indication that form is processing
- Form data lost on page refresh

---

### 1.5 State Management & Data Consistency

**Checks:**
- [ ] User actions reflect immediately in UI (optimistic updates)
- [ ] Page refresh doesn't lose unsaved form data
- [ ] Navigation doesn't clear necessary context (e.g., search filters persist)
- [ ] Multiple open tabs/windows sync correctly (if applicable)
- [ ] Undo/redo functionality where appropriate
- [ ] Scroll position restored when navigating back

**Red Flags:**
- Data discrepancy between UI and backend
- User clicks "save" but changes don't appear
- Navigating back loses all context
- Tabs display different data for same resource

---

### 1.6 Security & Data Privacy (Frontend)

**Checks:**
- [ ] No sensitive data (passwords, tokens, API keys) in localStorage
- [ ] Form data sanitized before display (XSS prevention)
- [ ] CSRF tokens present in forms (if using cookies)
- [ ] HTTPS enforced (no mixed HTTP/HTTPS)
- [ ] Console doesn't log sensitive data
- [ ] File uploads validated on frontend (file type, size)
- [ ] Links to external sites use `rel="noopener noreferrer"`
- [ ] Rate limiting prevents brute-force submissions

**Red Flags:**
- API tokens visible in localStorage/sessionStorage
- User data displayed without escaping (raw HTML injection risk)
- Console logs contain sensitive info
- Mixed HTTP/HTTPS resources
- File upload accepts any file type/size

---

## SECTION 2: USER EXPERIENCE (UX) AUDIT

### 2.1 Information Architecture & Navigation

**Checks:**
- [ ] Primary navigation clear and consistent across all pages
- [ ] Information hierarchy logical (not buried 4 clicks deep)
- [ ] Breadcrumbs or navigation path visible (user knows where they are)
- [ ] Search function available and prominent
- [ ] Internal links use descriptive anchor text (not "click here")
- [ ] No dead links (404s should be handled gracefully)
- [ ] Footer contains important links (about, terms, contact, social)
- [ ] Mobile menu doesn't hide critical information

**Content Organization:**
- [ ] Related content grouped together
- [ ] Call-to-action (CTA) buttons obvious and high-contrast
- [ ] No more than 5–7 main navigation items (prevents cognitive overload)

**Red Flags:**
- User can't find key features
- Navigation hierarchy changes inconsistently
- Search returns irrelevant results
- Dead links return blank pages instead of 404s
- Mobile menu collapses essential navigation

---

### 2.2 Visual Design & Consistency

**Checks:**
- [ ] Consistent color palette across the product (max 4–5 primary colors)
- [ ] Typography hierarchy clear (H1 > H2 > H3 > body text)
- [ ] Consistent spacing/padding (use an 8px or 4px grid)
- [ ] Button styles consistent (primary, secondary, danger, disabled states)
- [ ] Icons consistent in style and weight
- [ ] Consistent border-radius throughout (not 4px in one place, 12px in another)
- [ ] Whitespace used effectively (not cramped, not too sparse)
- [ ] Images/illustrations consistent in style

**Contrast Audit:**
- [ ] Text color has sufficient contrast ratio (WCAG AA: 4.5:1 for normal text, 3:1 for large text)
- [ ] Use WebAIM Contrast Checker on all text elements
- [ ] Links are underlined or have visual distinction beyond color alone

**Red Flags:**
- Colors randomly chosen (no system)
- Typography sizes wildly inconsistent
- Cluttered layout with no breathing room
- Images of wildly different styles side-by-side
- Buttons styled inconsistently
- Low contrast text (gray on light gray)

---

### 2.3 Interaction Design & Feedback

**Checks:**
- [ ] All interactive elements provide immediate visual feedback (hover, active, focus)
- [ ] Loading states clear (spinner, skeleton, or message)
- [ ] Success/error states shown prominently (toast, banner, or modal)
- [ ] Confirmation dialogs for destructive actions (delete, unsub, etc.)
- [ ] Tooltips appear on hover for abbreviations or complex terms
- [ ] Empty states are helpful (not just blank, show next steps)
- [ ] Transitions are smooth (200–300ms, not jarring)
- [ ] Animations don't repeat endlessly (annoying)

**Button & Link States:**
- [ ] Default (rest)
- [ ] Hover (color change or lift effect)
- [ ] Active/pressed (darker or inverted)
- [ ] Disabled (grayed out, not clickable)
- [ ] Loading (spinner or disable + text change)
- [ ] Focus (keyboard navigation, visible outline)

**Red Flags:**
- Buttons don't respond to hover
- No loading indicator during API calls
- Success happens silently (user unsure if action worked)
- Animations are distracting or slow
- No focus states (keyboard users can't navigate)
- Destructive actions don't ask for confirmation

---

### 2.4 Content Clarity & Copywriting

**Checks:**
- [ ] Headings clearly state page purpose or feature
- [ ] Body copy is scannable (short paragraphs, lists, bold key phrases)
- [ ] Call-to-action copy is action-oriented ("Sign Up" not "Submit")
- [ ] Microcopy helpful ("Password must be 8+ characters" not "Invalid")
- [ ] No jargon or explain technical terms on first use
- [ ] Numbers/stats formatted for readability (1M, not 1,000,000)
- [ ] Dates/times shown in user's timezone (if applicable)
- [ ] Tone consistent throughout (not switching from casual to formal)
- [ ] No typos or grammatical errors

**Common Issues:**
- [ ] Placeholder text too light to read
- [ ] Helper text hidden or unclear
- [ ] Button labels vague ("OK" instead of "Save Changes")
- [ ] Error messages blame the user ("You entered invalid data" vs "Email format incorrect")

**Red Flags:**
- Confusing or unclear headers
- Long paragraphs of dense text
- Jargon unexplained
- Tone inconsistent (casual one moment, formal the next)
- Typos or poor grammar

---

### 2.5 Mobile UX Specifics

**Checks:**
- [ ] Tap targets at least 44x44px (iOS) or 48x48px (Android)
- [ ] Form inputs don't zoom on focus (set `initial-scale` correctly)
- [ ] Keyboard doesn't cover critical input fields
- [ ] Soft keyboard input type correct (email, phone, number, etc.)
- [ ] No horizontal scroll needed
- [ ] Touch-friendly spacing between interactive elements
- [ ] Images scale appropriately on small screens
- [ ] Readability without zooming (font size 16px minimum for body)

**Testing:**
- [ ] Use Chrome DevTools → Device Mode (not just resizing browser)
- [ ] Test on actual phone (not just emulator)
- [ ] Test with one hand (thumb reach)
- [ ] Test with slow internet (see loading states)

**Red Flags:**
- Buttons tiny, hard to tap
- Keyboard obscures input
- Horizontal scroll appears
- Text too small to read
- Menu items require pinch-zoom to tap

---

### 2.6 Onboarding & First-Time User Experience (FTUE)

**Checks:**
- [ ] Landing page clearly explains what the product does (within 3 seconds)
- [ ] First-time users guided to main feature (tutorial, tooltip, or highlighted demo)
- [ ] Sign-up flow is simple (3–5 steps max)
- [ ] Welcome email sent after signup (confirms email, next steps)
- [ ] Empty states show "how to get started" not just "no data"
- [ ] Completion percentage or progress indicator visible (motivates users)
- [ ] No friction before showing value (don't ask for too much info upfront)
- [ ] Aha moment reached within first 5 minutes

**Red Flags:**
- Unclear product value proposition
- Signup requires too much info (>10 fields)
- No guidance for first-time users
- Empty screens with no context
- Forced tutorial can't be skipped
- No confirmation user completed onboarding

---

## SECTION 3: ACCESSIBILITY (A11Y) AUDIT

### 3.1 Keyboard Navigation

**Checks:**
- [ ] All interactive elements reachable via Tab key
- [ ] Tab order logical and predictable (left-to-right, top-to-bottom)
- [ ] Focus trap in modals (Tab cycles within modal, not to background)
- [ ] Escape key closes modals/overlays
- [ ] Keyboard shortcuts documented (if available)
- [ ] No keyboard traps (user can't escape an input without mouse)

**Testing:**
- Disable mouse in OS settings
- Navigate entire site using only Tab, Shift+Tab, Enter, Escape, Arrow keys

**Red Flags:**
- Can't access menu without mouse
- Focus trap invisible (can't see where keyboard focus is)
- Modal doesn't close with Escape
- Tab order random or illogical

---

### 3.2 Screen Reader Compatibility

**Checks:**
- [ ] Semantic HTML used (`<button>`, `<form>`, `<nav>`, not `<div>` as button)
- [ ] Form labels properly associated with inputs (`<label for="id">`)
- [ ] Images have meaningful alt text (not "image1" or blank)
- [ ] Icon buttons have aria-label (`<button aria-label="Close">×</button>`)
- [ ] Complex elements have ARIA roles (`aria-expanded`, `aria-current`, `aria-live`)
- [ ] Lists marked as `<ul>`/`<ol>` (not `<div>`)
- [ ] Data tables have `<thead>`, `<tbody>`, `<th>` tags with scope
- [ ] Decorative images have `alt=""` (hidden from screen readers)

**Testing:**
- Use NVDA (Windows) or JAWS (Windows/Mac) or VoiceOver (Mac/iOS)
- Listen: Can screen reader convey the page purpose and navigation?

**Red Flags:**
- Images have no alt text
- Form inputs lack labels
- Divs used as buttons
- ARIA used incorrectly (ARIA-label on a div styled like a button)
- No semantic HTML structure

---

### 3.3 Color & Contrast

**Checks:**
- [ ] No information conveyed by color alone (e.g., "red means error" — also use icon/text)
- [ ] Text color contrast ≥ 4.5:1 for normal text (WCAG AA)
- [ ] Text color contrast ≥ 3:1 for large text (18px+ bold or 24px+)
- [ ] Interactive elements contrast ≥ 3:1 from adjacent colors
- [ ] Color-blind safe palette (avoid red/green only distinctions)

**Tools:**
- WebAIM Contrast Checker
- Color Blindness Simulator (Coblis)
- Lighthouse DevTools audit

**Red Flags:**
- Light gray text on white background
- Red/green used as only distinction
- Low contrast buttons
- Color used as sole indicator of state

---

### 3.4 Responsiveness for Assistive Tech

**Checks:**
- [ ] Zoom to 200% and content still readable/functional
- [ ] Text resizable (browser zoom or CSS zoom support)
- [ ] Focus visible at all zoom levels
- [ ] No fixed font sizes that can't be overridden

**Red Flags:**
- Content breaks at 200% zoom
- Focus invisible at high zoom
- Text can't be resized

---

### 3.5 Motion & Animation Sensitivity

**Checks:**
- [ ] Respect `prefers-reduced-motion` media query
- [ ] Parallax or auto-playing animations can be paused/disabled
- [ ] No flashing content (>3 flashes/second = seizure risk)
- [ ] Animation doesn't auto-play unless user initiates

**CSS Example:**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}
```

**Red Flags:**
- Animations can't be disabled
- Parallax causes motion sickness
- Flashing content without warning
- Animations play on load (should be user-triggered)

---

## SECTION 4: ENGAGEMENT HOOKS & RETENTION MECHANICS

### 4.1 Micro-Moments That Drive Return Visits

#### A. Progress Visibility
- [ ] User can see progress toward a goal (% complete, level, streak)
- [ ] Progress persists and updates in real-time
- [ ] Celebration moment when milestone reached (confetti, badge, toast)
- [ ] Next milestone visible ("3 more days to unlock...") — creates pull

**Example:** Duolingo streak counter, Figma auto-save indicator, gym app workout log.

#### B. Streaks & Consistency Hooks
- [ ] Daily login streak visible and celebrated
- [ ] Streak broken = gentle reminder (not shame, but "keep the momentum")
- [ ] Milestone streaks highlighted (7, 30, 100, 365 days)
- [ ] Streak counter shows both current and personal best

**Psychology:** Loss aversion is stronger than gain. Users return to avoid breaking streak.

#### C. Variable Rewards (Randomness)
- [ ] Occasional surprises (random daily bonus, surprise feature unlock)
- [ ] Not every day the same (keeps habits from becoming boring)
- [ ] Rewards unpredictable but plausible (not "surprise $100", but "surprise 10 XP")
- [ ] Timed scarcity ("This bonus available for 24 hours") — creates urgency

**Example:** Bonus XP on specific days, daily surprise unlocks, hidden easter eggs.

#### D. Social Proof & Competition
- [ ] Leaderboard (public or private comparison with friends)
- [ ] Friend activity feed ("Your friend just unlocked...")
- [ ] Share achievements (one-click share to Twitter/LinkedIn)
- [ ] Group challenges or multiplayer streaks

**Psychology:** Users want to be seen and compared. Friendly competition drives engagement.

#### E. Personalization & Customization
- [ ] User can personalize their profile (avatar, banner, bio)
- [ ] Recommendations based on behavior (not generic)
- [ ] Customizable notifications (frequency, type)
- [ ] Dark/light mode toggle
- [ ] User preferences saved and reflected immediately

**Example:** Spotify "Discover Weekly", Netflix recommendations, personalized dashboard.

---

### 4.2 Habit Loop Architecture (Hook Model)

**Trigger → Action → Variable Reward → Investment**

#### Trigger (External & Internal)
- [ ] Push notification (well-timed, not spammy)
- [ ] Email reminder (daily digest or milestone-based)
- [ ] In-app notification badge (number shows unread count)
- [ ] Internal trigger (user's own motivation to check progress)

**Red Flags:**
- Push notifications sent at odd hours or too frequently
- No way to customize notification timing
- Notifications for trivial events

#### Action (Easiest Possible Path)
- [ ] One-click actions (no multi-step forms for simple tasks)
- [ ] Clear CTA buttons with action-oriented copy
- [ ] Frictionless signup (social login or magic link)
- [ ] Auto-fill forms where safe (names, emails)

**Red Flags:**
- Main feature requires 5+ form fields
- Unclear what to do next
- CTA button hard to find

#### Variable Reward (Novelty + Completion)
- [ ] Random element keeps habit fresh (not same every time)
- [ ] Tangible reward for action (points, badge, unlock)
- [ ] Social reward (praise, visibility, likes)
- [ ] Functional reward (time saved, feature unlocked)

**Example:** 
- Complete a task → earn XP (variable amount)
- Post content → see engagement metrics rise
- Daily login → unlock new feature

#### Investment (Sunk Cost)
- [ ] User spends time building profile (photos, bio) → feels invested
- [ ] User uploads content or data → creates lock-in
- [ ] User invites friends → more reasons to return
- [ ] User makes purchases or upgrades → financial investment

**Example:**
- Spotify wrapped (invested time in listening)
- Duolingo course progress (invested study time)
- Figma designs (invested creative work)

---

### 4.3 FOMO (Fear of Missing Out) Hooks

**Implementation:**
- [ ] Limited-time offers (scarcity: "This deal expires in 2 hours")
- [ ] Exclusive content for members only
- [ ] Community challenges (end date visible: "3 days left")
- [ ] New features highlighted as "New" with expiration date
- [ ] Social proof ("1,200 people completed this challenge this week")

**Example Messaging:**
- "Only 5 spots left for the VIP tier"
- "Last chance to earn 2x bonus points (expires tonight)"
- "Join 40,000+ creators already using this..."

**Warning:** Overuse creates distrust. Use sparingly and authentically.

---

### 4.4 Gamification Elements

**Checks:**
- [ ] Points/XP system (clear how to earn, visible totals)
- [ ] Badges or achievements (visual recognition, profile display)
- [ ] Levels (progression feeling, not just points)
- [ ] Challenges or quests (themed, time-limited goals)
- [ ] Leaderboards (global, friends, or team-based)
- [ ] Unlockables (cosmetic rewards, new features at levels)

**Best Practices:**
- Points should be meaningful (earning 5 XP vs 500 XP feels different)
- Badges should require effort but be achievable
- Progression should be visible (can't see how many more points needed = demotivating)
- Avoid "participation trophies" (everyone gets it = worthless)

**Red Flags:**
- Gamification feels forced or artificial
- Rewards are purely cosmetic and not meaningful
- Progress reset frequently (kills long-term engagement)
- Leaderboard dominated by inactive users

---

### 4.5 Content & Community Feedback Loops

**Checks:**
- [ ] User-generated content visible (posts, comments, contributions)
- [ ] Comments/likes show up immediately (engagement feedback)
- [ ] Creator gets notification when content engaged with
- [ ] Community moderation visible (featured posts, removed spam)
- [ ] Trending or "hot" content highlighted
- [ ] Feed algorithm shows relevant, personalized content

**Example Mechanics:**
- Creator posts → followers see it → followers like/comment → creator sees engagement → motivated to post again
- User writes guide → others upvote → guide ranks higher → author gets visibility → writes more

---

### 4.6 Notification Strategy (Push, Email, In-App)

**Engagement-Focused Notifications:**
- [ ] Timely (not at 3 AM)
- [ ] Personalized (mentions user by name, shows relevant data)
- [ ] Action-oriented ("Tap to claim your bonus" not "You have a notification")
- [ ] Preference-based (user controls frequency and type)
- [ ] Sparse (more valuable if rare)

**What NOT to notify about:**
- System updates that don't affect user experience
- Milestones for other users (unless close friend)
- Every single interaction (exhausting)

**Example Good Notifications:**
- "You're 1 streak away from unlocking the gold badge!"
- "Sarah just joined your challenge — compete now"
- "Your weekly digest is ready"

**Red Flags:**
- More than 1–2 notifications per day
- Notifications don't include actionable next step
- User can't control notification frequency
- Notifications sent at inconvenient times

---

### 4.7 Moments of Delight (Non-Essential UX Polish)

**Implementation:**
- [ ] Easter eggs (hidden features or jokes discoverable by power users)
- [ ] Micro-interactions (button bounces on click, loader has personality)
- [ ] Personalized messages (birthday greetings, anniversary celebrations)
- [ ] Unexpected rewards (bonus for returning after a week)
- [ ] Playful error messages (not just "Error 404" but "This page took a wrong turn...")
- [ ] Celebration animations (confetti for milestone, fireworks for achievement)

**Example:**
- Gmail's "Undo Send" (10-second window to regret)
- Slack's randomly rotating workspace icon
- Figma's satisfying comment delete animation

**Note:** Delight should enhance but not distract from core functionality.

---

### 4.8 Onboarding to First "Aha" Moment

**Checks:**
- [ ] Aha moment defined (what makes user realize the product's value?)
- [ ] Time to aha < 5 minutes
- [ ] Clear path from landing to aha (tutorial or guided tour)
- [ ] Aha moment celebrated (confirmation message, visual feedback)
- [ ] Next action immediately clear (what to do after aha?)

**Example Aha Moments:**
- Trello: Drag a card → see it move → realize organizing is easy
- Notion: Create a database → see it populate → realize it's a tool they need
- Twitter: See your tweet get liked → realize people see you → feel like you belong

**Red Flags:**
- Aha moment requires onboarding > 10 minutes
- Users don't understand product purpose before trying it
- No celebration when aha moment reached

---

### 4.9 Retention Metrics to Track

**Implementation - Add these to your analytics:**

1. **DAU/MAU (Daily/Monthly Active Users)**
   - DAU = users who took meaningful action today
   - MAU = users who took meaningful action in last 30 days
   - DAU/MAU ratio shows stickiness (60%+ is excellent)

2. **Retention Cohorts**
   - Day 1, Day 7, Day 30 retention rates
   - "Of users who signed up today, what % return in 7 days?"
   - Target: 30% day 7 retention (varies by product)

3. **Churn Rate**
   - What % of users stop using product each month?
   - Low churn = strong engagement hooks

4. **Time on Site / Session Duration**
   - Are users spending meaningful time?
   - More time = stronger engagement

5. **Returning User Frequency**
   - Do users come back multiple times per week?
   - Frequency indicates habit formation

---

## SECTION 5: CRITICAL AUDIT CHECKLIST

### Must-Have (Product Cannot Launch Without These)
- [ ] No critical performance issues (LCP > 3s, CLS > 0.25)
- [ ] Core functionality works on mobile and desktop
- [ ] Form validation prevents invalid submissions
- [ ] API errors show user-friendly messages
- [ ] Login/auth works correctly
- [ ] No XSS vulnerabilities (escaped content)
- [ ] Keyboard navigation functional
- [ ] Text has sufficient contrast
- [ ] Page layout responsive at all breakpoints

### High Priority (Launch Will Have Issues Without These)
- [ ] Empty states helpful (not blank)
- [ ] Loading states visible during API calls
- [ ] Confirmation dialogs for destructive actions
- [ ] Focus states visible for keyboard users
- [ ] Form error messages clear and inline
- [ ] Image alt text present
- [ ] Button states (hover, active, disabled) visible
- [ ] Tap targets 44x44px+ on mobile
- [ ] Notification strategy defined (not spammy)

### Nice-to-Have (Improves Engagement & Retention)
- [ ] Progress tracking visible (streaks, achievements)
- [ ] Celebratory animations on milestones
- [ ] Personalization (profile, customization options)
- [ ] Leaderboards or social comparison
- [ ] Gamification (badges, XP, levels)
- [ ] Community features (comments, user-generated content)
- [ ] Personalized recommendations
- [ ] Easter eggs or playful UX moments

---

## SECTION 6: REPORTING TEMPLATE

### Executive Summary
- Critical Issues: [Number]
- High Priority Issues: [Number]
- Engagement Hooks Present: [Number/Details]
- Overall Grade: A/B/C/D/F

### Critical Issues Found
1. [Issue]: [Impact] [Severity: CRITICAL]
   - Recommendation: [Fix]

### High Priority Issues
1. [Issue]: [Impact] [Severity: HIGH]
   - Recommendation: [Fix]

### Engagement Hooks Assessment
- Strengths: [What's working well]
- Gaps: [What's missing]
- Recommendations: [Prioritized list of engagement improvements]

### Accessibility Audit Results
- WCAG Compliance Level: A / AA / AAA
- Keyboard Navigation: Pass / Fail
- Screen Reader Compatibility: Pass / Fail / Partial

### Performance Summary
- Lighthouse Score: [0–100]
- FCP: [Time]ms
- LCP: [Time]ms
- CLS: [Score]

### Next Steps
1. [Priority 1 fix]
2. [Priority 2 fix]
3. [Priority 3 fix]

---

## AGENT INSTRUCTIONS: HOW TO USE THIS FRAMEWORK

**Step 1: Environment Setup**
- Open the live product in a modern browser (Chrome preferred)
- Open DevTools (F12)
- Have a screen reader ready (NVDA for Windows, VoiceOver for Mac)

**Step 2: Execute Audits in Order**
1. Technical Functionality (1.1–1.6): 20 minutes
2. User Experience (2.1–2.6): 20 minutes
3. Accessibility (3.1–3.5): 15 minutes
4. Engagement Hooks (4.1–4.9): 15 minutes
5. Critical Checklist (5): 10 minutes

**Step 3: Document Issues**
- For each issue, note: [Feature/Page] → [Issue] → [Impact] → [Recommendation]
- Rate severity: CRITICAL (breaks functionality) / HIGH (severely impacts UX) / MEDIUM (noticeable but not blocking) / LOW (polish/nice-to-have)

**Step 4: Provide Actionable Recommendations**
- Don't just say "button is hard to click"
- Say: "CTA button is 32px wide (target: 48px). Increase padding to 16px vertical, 24px horizontal. Severity: HIGH (mobile users can't tap reliably)"

**Step 5: Provide the Report**
- Use the template in Section 6
- Prioritize by severity + impact on user retention
- Suggest quick wins (easy to fix, high impact) first

---

## EXAMPLES OF GOOD AUDIT FINDINGS

### Example 1: Performance Issue
**Finding:**
- Product: Account Settings page
- Issue: LCP 4.2s (target: 2.5s)
- Root Cause: Hero image 2.8MB, unoptimized
- Impact: Users on slow connections see blank page for 4+ seconds, perceive product as slow
- Recommendation: Compress image to 400KB using TinyPNG, add skeleton loader while image loads
- Severity: CRITICAL (affects brand perception on mobile)

### Example 2: Engagement Gap
**Finding:**
- Product: Habit Tracker app
- Issue: No celebration when user completes first habit
- Root Cause: Task completion silently saves to database
- Impact: User doesn't realize they've succeeded, doesn't feel motivated to return
- Recommendation: Show toast notification "You did it! 🎉" + unlock first badge + show "2 more habits to unlock level 2"
- Severity: HIGH (missing key retention hook)

### Example 3: Accessibility Issue
**Finding:**
- Product: Modal dialog
- Issue: Cannot close modal with Escape key
- Root Cause: Escape handler not implemented
- Impact: Keyboard users trapped, cannot navigate site
- Recommendation: Add `onKeyDown` handler: `if (e.key === 'Escape') closeModal()`
- Severity: CRITICAL (blocks keyboard users from using product)

---

## QUICK REFERENCE: RED FLAGS SUMMARY

**Performance:**
- LCP > 3s, CLS > 0.25, FCP > 2s, TTI > 4s

**UX:**
- Unclear value prop, confusing navigation, low contrast text, broken forms

**Accessibility:**
- No keyboard nav, no alt text, no focus states, color-only information

**Security:**
- API tokens in localStorage, XSS vulnerabilities, unescaped content

**Engagement:**
- No progress tracking, silent success states, no notifications, no personalization

---

**AUDIT COMPLETE WHEN:**
- All sections 1–5 completed
- Every issue documented with severity, impact, and recommendation
- Report generated using Section 6 template
- Prioritized roadmap provided (quick wins first)
