# SquadForge Financial Core — UI/UX Specification

**Author role:** Business Analyst / UI Analyst  
**Format:** AWS Kiro screen specification  
**Status:** Baseline  
**Product:** SquadForge Financial Core

---

# Screen Specifications

## Product Overview

SquadForge is a lightweight internal resource optimisation tool for delivery leads in a financial-services environment. It helps users capture a delivery need, generate ranked candidate recommendations, explain suitability scores, build a proposed squad, and finalize the squad selection.

**Primary user journey:**

Capture Demand → Generate Recommendations → Review Candidate Rankings → Expand Score Breakdown → Assign Candidates → Finalize Squad

**Prototype scope:**

- Uses mock candidate and demand data only.
- Uses deterministic rules-based scoring.
- No external HR, finance, identity, or resource-management integrations are required.
- UI must prioritize speed, clarity, and explainability for resource-allocation decisions.

---

# Global App Shell

## Screen: Application Shell

**Purpose:** Provide consistent navigation, search, and workspace access across SquadForge.

**Layout:**
- Top header — fixed horizontal bar with global search, notification icon, settings icon, and user avatar.
- Left sidebar — vertical navigation with SquadForge branding and primary workspace links.
- Main content area — displays the active screen content.
- Sticky footer region — reserved for proposed squad actions when candidates are selected.

**Data displayed:**
- App name: `SquadForge`
- Sidebar section label: `SF Resource Optimization`
- Navigation items: `Demand Center`, `Resource Queue`, `Team Config`, `Analytics`, `Support`, `Documentation`
- Global search placeholder: `Search resources...`
- Active navigation state: current screen highlighted with secondary green background
- User avatar: mock user image or initials

**Interactions:**
- Click navigation item → active screen changes and selected item is highlighted.
- Type into global search → filters visible candidates/resources where supported.
- Click settings icon → opens settings menu or placeholder popover.
- Click notification icon → opens notifications popover or placeholder empty state.
- Click user avatar → opens user menu or placeholder popover.

**States:**
- Empty: shell still renders; main area displays the selected screen empty state.
- Loading: top header and sidebar remain visible while main content shows skeleton placeholders.
- Error: shell remains visible and the main content shows a recoverable error message.

---

## Screen: Demand Center

**Purpose:** Capture the delivery requirement that will be used to generate candidate recommendations.

**Layout:**
- Page header — screen title and short instruction text.
- Demand form card — primary form container using a white or off-white surface with a subtle border.
- Squad Intent input — large text field for describing the work request.
- Urgency and Project Code row — two-column layout for urgency level and project code.
- Business Domain and Expected Duration row — two-column layout for domain and duration.
- Required Competencies selector — chip-based multi-select area with add/remove actions.
- Weighted Suitability Logic panel — read-only scoring explanation showing component weights.
- Primary action button — `Generate Recommendations`.
- Workspace status card — confirms current matching constraints and live-sync state.

**Data displayed:**
- Squad Intent: free-text string, example `Retail Banking App Refactor`
- Urgency: enum, example `HIGH`
- Project Code: string, format `ZAF-YYYY-###`, example `ZAF-2024-081`
- Business Domain: string, example `Retail Banking`
- Expected Duration: integer (weeks), example `12`
- Required Competencies: array of skill chips, examples `React.js`, `Spring Boot`, `Swift`
- Scoring weights: `Skills 50%`, `Availability 30%`, `Role 20%`
- Workspace Status: short system message, example `Demand parameters are locked to Financial Cluster A guidelines.`
- Sync status: badge, example `Live Sync`

**Interactions:**
- Type into Squad Intent → updates demand criteria in session state.
- Select Urgency → updates demand criteria and affects ranking priority.
- Enter Project Code → validates required project reference.
- Select Business Domain → updates demand criteria.
- Enter Expected Duration → updates demand criteria.
- Click `+ Add Skill` → opens skill autocomplete or selectable list.
- Click `x` on a skill chip → removes the competency from the demand criteria.
- Click `Generate Recommendations` → validates form and generates ranked candidate recommendations.
- Modify any demand input after results exist → recalculates recommendations in real time or prompts the user to regenerate, depending on implementation mode.

**States:**
- Empty: form shows placeholder values and no recommendation results.
- Loading: `Generate Recommendations` button shows loading state; recommendation area shows skeleton cards.
- Error: inline field errors appear under invalid inputs; form-level error displays `Unable to generate recommendations. Check demand details and try again.`

---

## Screen: Resource Queue / Recommendation Workspace

**Purpose:** Display ranked candidate recommendations and allow the user to assign candidates to a proposed squad.

**Layout:**
- Two-column workspace — left demand/scoring panel and right recommendation queue.
- Left panel — active demand criteria, competency chips, scoring-weight explanation, and workspace status.
- Right panel header — `Recommendation Queue` title with filter and rank controls.
- Candidate grid — two-column grid of candidate recommendation cards on desktop.
- Sticky proposed squad footer — fixed bottom panel showing selected candidates and squad actions.

**Data displayed:**
- Active demand criteria: squad intent, urgency, project code, business domain, duration, required competencies
- Candidate name: string, example `Thabo Mokoena`
- Candidate role: string, example `Senior Fullstack Developer`
- Availability status: enum, examples `Available Now`, `Next Mon`, `2 Week Notice`
- Suitability score: percentage, example `94%`
- Skills Match score: numeric contribution out of 50, example `48/50`
- Availability score: numeric contribution out of 30, example `21/30`
- Role Fit score: numeric contribution out of 20, example `20/20`
- Candidate avatar: image or initials fallback
- Proposed squad count: string, example `3 of 5 seats filled (60%)`
- Squad velocity score: decimal number, example `8.2`

**Interactions:**
- Click `Filter` → opens filter controls for role, availability, skills, domain, or suitability range.
- Click `Rank` → changes sort order by suitability, availability, skill match, or role fit.
- Click `Expand Breakdown` → opens candidate scoring breakdown inline or in a side panel.
- Click `Assign to Squad` → adds candidate to the sticky proposed squad footer.
- Click `Assign to Squad` for an already selected candidate → prevents duplicate assignment and shows a short message.
- Click selected candidate avatar/chip in footer → shows candidate summary or highlights the card.
- Click `Reset Proposal` → clears all selected candidates.
- Click `Finalize Squad` → opens the squad summary confirmation screen.

**States:**
- Empty: `No recommendations yet. Capture demand details and generate recommendations.`
- Loading: candidate cards display skeleton avatar, score, bars, and action placeholders.
- Error: `Unable to load recommendation queue. Try again.` with a retry action.

---

## Screen: Candidate Recommendation Card

**Purpose:** Present a single candidate's fit at a glance and provide actions for explainability and assignment.

**Layout:**
- Candidate header — avatar, name, role, availability status, and suitability score.
- Score breakdown preview — three rows for Skills Match, Availability, and Role Fit.
- Progress bars — horizontal bars showing relative score strength.
- Card actions — `Expand Breakdown` link and `Assign to Squad` button.

**Data displayed:**
- Avatar: image source or initials fallback
- Name: string
- Role: string
- Suitability label: uppercase label `Suitability`
- Suitability value: percentage, format `0–100%`
- Availability label: status badge with icon and color treatment
- Skills Match: `score/50`
- Availability score: `score/30`
- Role Fit score: `score/20`
- Action state: assignable, selected, disabled, or unavailable

**Interactions:**
- Click `Expand Breakdown` → expands detailed score explanation.
- Click external-link icon beside breakdown label → opens full candidate breakdown view where implemented.
- Click `Assign to Squad` → adds candidate to proposed squad and updates footer count.
- Hover card → applies subtle navy-tinted hover state.
- Keyboard focus on card actions → shows visible focus state.

**States:**
- Empty: not applicable for an individual card; empty state handled by the recommendation queue.
- Loading: card skeleton displays avatar circle, title lines, score bar placeholders, and disabled button.
- Error: card-level fallback displays `Candidate data unavailable.` when a candidate record cannot be rendered.

---

## Screen: Candidate Breakdown

**Purpose:** Explain why a candidate received their suitability score so the user can trust the recommendation.

**Layout:**
- Expandable accordion within candidate card or right-side detail drawer.
- Score calculation section — component scores with numeric values and progress bars.
- Reasoning section — short rule-based explanation.
- Candidate metadata section — skill coverage, domain alignment, availability/notice period, and tenure.

**Data displayed:**
- Candidate name and role
- Total Suitability Score: percentage, example `94%`
- Skills Match: contribution out of 50 and normalized percentage
- Availability score: contribution out of 30 and normalized percentage
- Role Fit score: contribution out of 20 and normalized percentage
- Matched skills: array of skill chips
- Missing or weaker skills: optional array of skill chips
- Availability status: enum or date label
- Recommendation reason: generated text, example `Strong skill alignment, high availability, and exact role match.`
- Calculation formula: `Total = Skills + Availability + Role`

**Interactions:**
- Click `Expand Breakdown` → shows detailed calculation.
- Click `Collapse Breakdown` or the active link again → hides detailed calculation.
- Click a skill chip → filters or highlights matching candidates where supported.
- Click `Assign to Squad` from expanded state → adds candidate without collapsing the explanation.

**States:**
- Empty: `No breakdown available for this candidate.`
- Loading: score rows show skeleton bars and placeholder reason text.
- Error: `Unable to load score breakdown.` with retry action.

---

## Screen: Proposed Delivery Squad Footer

**Purpose:** Keep selected squad members visible while the user reviews recommendations and prepares to finalize the squad.

**Layout:**
- Sticky bottom footer — full-width bar fixed to bottom of viewport.
- Left section — title `Proposed Delivery Squad`, seat count, and selected member avatars/chips.
- Middle section — squad velocity score and trend indicator.
- Right section — secondary reset button and primary/success finalize button.

**Data displayed:**
- Selected count: string, example `3 of 5 seats filled (60%)`
- Selected candidates: avatar stack with overflow count, example `+2`
- Squad Velocity Score: decimal, example `8.2`
- Velocity trend: arrow or small trend indicator
- Reset action label: `Reset Proposal`
- Finalize action label: `Finalize Squad`

**Interactions:**
- Assign candidate → footer updates selected count and avatar stack.
- Remove candidate from footer chip → count and avatar stack update.
- Click `Reset Proposal` → clears selected candidates after confirmation or immediate reset.
- Click `Finalize Squad` → opens squad summary screen.
- Attempt duplicate assignment → footer remains unchanged and duplicate warning appears.

**States:**
- Empty: footer may be hidden or show `No candidates selected yet.` with disabled finalize button.
- Loading: footer actions disabled while finalization request is pending.
- Error: `Unable to update proposed squad. Try again.`

---

## Screen: Squad Summary / Finalize Squad

**Purpose:** Confirm selected squad members before completing the proposal.

**Layout:**
- Centered summary card or full-page confirmation panel.
- Project information section — displays demand details.
- Squad member table — selected candidates and their score summaries.
- Recommendation summary — optional explanation of overall squad fit.
- Action bar — `Back`, `Export Summary`, and `Done` or `Confirm Finalize`.

**Data displayed:**
- Project Code: string, example `ZAF-2024-081`
- Business Domain: string, example `Retail Banking`
- Squad Intent: free-text summary
- Urgency: enum
- Required Competencies: chip list
- Member Name: string
- Member Role: string
- Suitability Score: percentage
- Availability Status: enum
- Score components: Skills, Availability, Role values where space allows
- Final squad count: integer and percentage of seats filled
- Squad Velocity Score: decimal

**Interactions:**
- Click `Back` → returns to Resource Queue without losing selected members.
- Click `Export Summary` → downloads or displays a mock export summary.
- Click `Confirm Finalize` / `Done` → marks squad proposal as finalized and shows success confirmation.
- Click remove beside a member before finalizing → removes the member and updates totals.

**States:**
- Empty: `No squad members selected. Return to Resource Queue to assign candidates.`
- Loading: summary card displays skeleton rows while selected squad data loads.
- Error: `Unable to finalize squad. Try again.`

---

## Screen: Team Config

**Purpose:** Configure or review the mock candidate pool and scoring assumptions used by the prototype.

**Layout:**
- Configuration header — title and description.
- Candidate data table — mock resources and their roles, skills, domain, tenure, and availability.
- Scoring settings panel — read-only or editable scoring weights depending on prototype scope.
- Save/reset controls — available only if editable configuration is implemented.

**Data displayed:**
- Candidate name, role, skill set, domain, allocation percentage, availability, and geographic location.
- Scoring weights: Skills 50%, Availability 30%, Role 20%
- Last updated timestamp: mock or session timestamp

**Interactions:**
- Search/filter candidates → narrows candidate table.
- Edit mock candidate values → updates prototype matching data where enabled.
- Reset config → restores default mock data.

**States:**
- Empty: `No mock candidates configured.`
- Loading: table skeleton rows.
- Error: `Unable to load team configuration.`

---

## Screen: Analytics

**Purpose:** Provide a lightweight view of recommendation and squad-composition outcomes.

**Layout:**
- Summary KPI cards — total candidates, average suitability, filled seats, velocity score.
- Chart area — suitability distribution and role coverage.
- Recent proposal list — latest finalized or draft proposals.

**Data displayed:**
- Total candidates considered: integer
- Average suitability: percentage
- Proposed squad filled seats: integer / required count
- Role coverage: role labels and counts
- Skill coverage: skill labels and match percentages

**Interactions:**
- Change filters → updates KPI and chart data.
- Click recent proposal → opens squad summary.
- Export analytics → creates mock report where supported.

**States:**
- Empty: `No analytics yet. Generate recommendations to populate this view.`
- Loading: KPI cards and charts show skeleton state.
- Error: `Unable to load analytics.`

---

# Component Rules

## Buttons

- Primary action buttons use deep navy background with white text.
- Secondary buttons use navy outline and white background.
- Success/final actions use green background with white text.
- Disabled buttons reduce opacity and must not respond to clicks.
- Focus state must be visible using a green outer glow or strong outline.

## Inputs

- Inputs use subtle gray borders, light surface fill, and clear labels.
- Required fields must display validation messages inline.
- Focus state uses primary navy border and secondary green glow.
- Placeholder text must be descriptive and not used as the only label.

## Cards

- Cards use white or off-white surfaces with 1px low-contrast border.
- High-importance cards may use a thin navy header or top border.
- Hover states use a very light navy tint.
- Card content must remain readable at high information density.

## Chips and Badges

- Skill chips use low-opacity green or slate treatment with removable `x` icon when editable.
- Availability badges use semantic color treatment:
    - Available Now: green
    - Next available date: gold/neutral
    - Notice period or constraint: red or warning treatment
- Overflow avatar chips display `+N`.

## Progress Bars

- Progress bars show score contribution visually.
- Primary navy is used for score fill.
- Track background uses low-contrast surface/container color.
- Numeric values must always be shown beside bars so meaning does not rely on color alone.

---

# Design System Application

## Brand and Visual Style

The interface should follow a Corporate Modern financial-sector style. It must feel structured, dependable, transparent, and efficient. The UI should use crisp light surfaces, deep navy text, and restrained green/gold status accents.

## Color Usage

- Primary / Deep Navy: `#00216e` for main actions, headers, active text, and key progress bars.
- Primary Container: `#0033a0` for elevated brand panels or selected states.
- Secondary / Spring Green: `#006d2f` and `#72fa92` for success states, availability, and finalize actions.
- Tertiary / Gold: `#db9f00` for attention states such as `Next Mon` or urgency accents.
- Error: `#ba1a1a` for validation errors and high-risk constraints.
- Surface: `#f8f9ff`, `#ffffff`, and light blue containers for page and card backgrounds.
- Outline: `#c4c5d5` or similar low-contrast border color for cards and inputs.

## Typography

- Headlines: Hanken Grotesk, semibold/bold.
- Body/data text: Inter, regular/medium.
- Labels, tags, project codes, and compact metadata: JetBrains Mono.
- Suitability values should be visually prominent and easy to scan.

## Spacing and Layout

- Use a 4px/8px spacing rhythm.
- Desktop uses a fixed, high-density layout with 12-column grid behavior.
- Use 16px internal card padding for dense work areas.
- Use 24px gutters between major content panels.
- Keep the sticky footer height compact enough that it does not block core candidate-card actions.

## Shapes and Elevation

- Default radius: 4px for inputs and compact components.
- Card radius: 8px.
- Buttons and chips: 4px to 8px radius.
- Avoid heavy shadows; rely on tonal layering and borders.
- Modals/dropdowns may use a subtle navy-tinted shadow.

---

# Responsive Behaviour

## Desktop

- Use two-column layout for Resource Queue.
- Candidate cards display in a two-column grid.
- Sidebar remains visible.
- Sticky footer remains fixed at bottom.

## Tablet

- Sidebar may collapse into icon-only mode.
- Demand panel stacks above recommendation queue or becomes collapsible.
- Candidate cards may display in a single column.

## Mobile

- Navigation moves to a drawer or bottom navigation.
- Demand form and recommendation queue stack vertically.
- Candidate card actions become full-width buttons.
- Sticky footer becomes a compact bottom action sheet.

---

# Accessibility Requirements

- All form controls must have visible labels.
- All interactive elements must be keyboard accessible.
- Focus states must be visible and consistent.
- Score bars must include numeric labels; color alone must not communicate meaning.
- Status badges must include text labels such as `Available Now` or `2 Week Notice`.
- Contrast must remain readable on light surfaces.
- Buttons must have accessible names matching their visible labels.

---

# Validation and Error Copy

## Demand Form Validation

- Missing Squad Intent: `Enter a squad intent.`
- Missing Project Code: `Enter a project code.`
- Missing Urgency: `Select an urgency level.`
- Missing Business Domain: `Select a business domain.`
- Missing Expected Duration: `Enter an expected duration.`
- Missing Required Competencies: `Add at least one required competency.`

## Assignment Validation

- Duplicate candidate: `Candidate is already in the proposed squad.`
- Candidate unavailable: `Candidate cannot be assigned because of availability constraints.`
- Finalize with no candidates: `Assign at least one candidate before finalizing.`

---

# Out of Scope

- Real HR system integration.
- Real-time calendar or availability integration.
- Authentication and role-based access control beyond visual placeholders.
- Persistent database-backed squad proposals unless implemented separately.
- Production export workflows.

---

# Acceptance Notes for Kiro Implementation

- The Resource Queue screen should match the supplied demo layout: left demand panel, right recommendation grid, and sticky proposed squad footer.
- The visible scoring model should use Skills 50%, Availability 30%, and Role 20% labels.
- Candidate recommendations should be generated from mock data and displayed quickly after demand submission.
- The UI must support expanding a candidate breakdown and assigning candidates without navigating away from the queue.
- The final prototype should clearly show how a delivery lead moves from demand capture to finalized squad proposal.
