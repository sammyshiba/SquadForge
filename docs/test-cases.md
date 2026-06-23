# Test Cases

## TC-001: Backend Health Check Returns OK

* GIVEN the backend server is running
* WHEN a client sends `GET /api/health`
* THEN the system returns HTTP 200
* AND the response contains `status`, `timestamp`, and `uptime`

## TC-002: Root Health Check Returns OK

* GIVEN the backend server is running
* WHEN a client sends `GET /health`
* THEN the system returns HTTP 200
* AND the response contains a health status and timestamp

## TC-003: API Info Returns Metadata

* GIVEN the backend server is running
* WHEN a client sends `GET /api/info`
* THEN the system returns HTTP 200
* AND the response contains API `name`, `version`, and `environment`

## TC-004: Echo Endpoint Returns Submitted Payload

* GIVEN the backend server is running
* WHEN a client sends `POST /api/echo` with payload `{ "message": "test" }`
* THEN the system returns HTTP 200
* AND the response contains the same payload
* AND the response contains a `receivedAt` timestamp

## TC-005: Echo Endpoint Rejects Invalid Input

* GIVEN the backend server is running
* WHEN a client sends `POST /api/echo` with an invalid or missing payload
* THEN the system returns HTTP 400
* AND the error response is structured

---

## TC-006: Demand Center Form Is Displayed

* GIVEN the user opens the Demand Center
* WHEN the page loads successfully
* THEN the system displays the demand capture form
* AND the form includes required role, skills, project urgency, expected duration, business domain, and project code fields

## TC-007: Successful Demand Creation

* GIVEN a delivery lead is on the demand capture form
* WHEN they submit a valid demand with `squadIntent="Retail App Refactor"`, `projectCode="ZAF-2024-081"`, `priorityLevel="Urgent"`, `requiredRole="Frontend Engineer"`, `requiredSkills=["React"]`, `expectedDurationWeeks=6`, and `businessDomain="Retail Banking"`
* THEN the system creates the demand successfully
* AND returns HTTP 201
* AND returns a `demand_id`
* AND returns status `SCORING_TRIGGERED`

## TC-008: Reject Demand Without Required Role

* GIVEN a delivery lead is on the demand capture form
* WHEN they submit a demand without `requiredRole`
* THEN the system returns HTTP 400
* AND the error message indicates that the required role is missing

## TC-009: Reject Demand Without Skills

* GIVEN a delivery lead is on the demand capture form
* WHEN they submit a demand with an empty `requiredSkills` array
* THEN the system returns HTTP 400
* AND the error message indicates that at least one skill is required

## TC-010: Reject Demand Without Project Code

* GIVEN a delivery lead is on the demand capture form
* WHEN they submit a demand without `projectCode`
* THEN the system returns HTTP 400
* AND the error message indicates that project code is required

## TC-011: Reject Demand Without Expected Duration

* GIVEN a delivery lead is on the demand capture form
* WHEN they submit a demand without `expectedDurationWeeks`
* THEN the system returns HTTP 400
* AND the demand is not stored

## TC-012: Reject Demand With Invalid Duration

* GIVEN a delivery lead is on the demand capture form
* WHEN they submit a demand with `expectedDurationWeeks=0`
* THEN the system returns HTTP 400
* AND the error message indicates that expected duration must be valid

## TC-013: Store Active Demand Criteria During Session

* GIVEN a delivery lead has entered demand criteria
* WHEN the user remains in the current session
* THEN the system stores the active demand criteria
* AND the entered values remain available for scoring and squad building

## TC-014: Recalculate Results When Demand Fields Change

* GIVEN ranked candidates are displayed for an active demand
* WHEN the user modifies the required role, skills, urgency, or duration
* THEN the system recalculates candidate scores
* AND updates the displayed ranking in real time

## TC-015: Display Ranked Candidates Within One Second

* GIVEN a valid demand has been submitted
* WHEN scoring is completed
* THEN the system displays ranked candidates within 1 second
* AND each candidate has a total suitability score

---

## TC-016: Retrieve Ranked Candidate Recommendations

* GIVEN a valid demand exists with `demand_id="D001"`
* WHEN the client sends `GET /workspace/D001/candidates`
* THEN the system returns HTTP 200
* AND the response contains `demand_id`
* AND the response contains a ranked `candidates` list

## TC-017: Candidate Result Contains Required Profile Data

* GIVEN ranked candidates are available for a demand
* WHEN the system returns the candidate list
* THEN each candidate includes `candidateId`, `name`, `primaryRole`, `sTotal`, `availabilityLabel`, and `currentAllocationPercentage`
* AND `sTotal` is displayed as a percentage

## TC-018: Demand Not Found When Retrieving Candidates

* GIVEN no demand exists with `demand_id="UNKNOWN"`
* WHEN the client sends `GET /workspace/UNKNOWN/candidates`
* THEN the system returns HTTP 404
* AND the error message indicates that the demand was not found

## TC-019: Deterministic Scoring Formula Is Applied

* GIVEN a candidate has `S_Skill=100`, `S_Availability=70`, and `S_Role=100`
* WHEN the scoring engine calculates the total suitability score
* THEN the system calculates `S_Total = (0.50 × 100) + (0.30 × 70) + (0.20 × 100)`
* AND the final score is `91`

## TC-020: Multiple Required Skills Use Average Skill Score

* GIVEN a demand requires `["React", "Node.js"]`
* AND a candidate has a maximum score for React and a reduced score for Node.js
* WHEN the scoring engine calculates `S_Skill`
* THEN the system averages the individual skill scores
* AND uses the average in the total suitability score

## TC-021: Missing Candidate Skill Scores Zero

* GIVEN a demand requires `["React"]`
* AND a candidate does not have React in their skill profile
* WHEN the scoring engine calculates the skill score
* THEN the system assigns `0` for that skill
* AND includes the zero score in the total suitability calculation

## TC-022: Skill Level 4 or 5 Receives Maximum Skill Score

* GIVEN a demand requires `["React"]`
* AND a candidate has React proficiency level `4`
* WHEN the scoring engine calculates the skill score
* THEN the system assigns the maximum score for React
* AND the scoring explanation reflects a strong skill match

## TC-023: Skill Level Below 4 Receives Reduced Skill Score

* GIVEN a demand requires `["React"]`
* AND a candidate has React proficiency level `3`
* WHEN the scoring engine calculates the skill score
* THEN the system assigns a reduced score for React
* AND the scoring explanation reflects a partial skill match

## TC-024: Zero Percent Allocation Receives Full Availability Score

* GIVEN a candidate has `currentAllocationPercentage=0`
* WHEN the scoring engine calculates availability
* THEN the system assigns `S_Availability=100`
* AND displays the candidate as available

## TC-025: Allocation Between 1 and 50 Percent Receives Medium Availability Score

* GIVEN a candidate has `currentAllocationPercentage=40`
* WHEN the scoring engine calculates availability
* THEN the system assigns `S_Availability=70`
* AND displays a moderate availability status

## TC-026: Allocation Greater Than 50 Percent Receives Low Availability Score

* GIVEN a candidate has `currentAllocationPercentage=75`
* WHEN the scoring engine calculates availability
* THEN the system assigns `S_Availability=20`
* AND displays availability constraints

## TC-027: Exact Role Match Receives Full Role Score

* GIVEN a demand requires `Frontend Engineer`
* AND a candidate has primary role `Frontend Engineer`
* WHEN the scoring engine calculates role alignment
* THEN the system assigns the maximum role alignment score
* AND includes the role score in the total suitability score

## TC-028: Non-Matching Role Receives Partial Role Score

* GIVEN a demand requires `Frontend Engineer`
* AND a candidate has primary role `Backend Engineer`
* WHEN the scoring engine calculates role alignment
* THEN the system assigns a partial role alignment score
* AND the candidate may still appear if other scores are strong

## TC-029: Scoring Uses Rules-Based Logic Only

* GIVEN the scoring engine is executed for any demand
* WHEN candidates are ranked
* THEN the system uses deterministic rules-based scoring
* AND does not use AI, ML, or random ranking logic

---

## TC-030: Retrieve Candidate Breakdown

* GIVEN a valid demand exists
* AND candidate `EMP-001` appears in the ranked results
* WHEN the client sends `GET /workspace/D001/candidates/EMP-001/breakdown`
* THEN the system returns HTTP 200
* AND the response contains `sSkill`, `sAvailability`, `sRole`, `sTotal`, and `reason`

## TC-031: Candidate Breakdown Shows Raw Scoring Values

* GIVEN a candidate breakdown is open
* WHEN the user views the breakdown details
* THEN the system displays the raw Skill Match, Availability, and Role Alignment scores
* AND the displayed total score matches the weighted formula

## TC-032: Candidate Breakdown Provides Rule-Based Explanation

* GIVEN a candidate has strong skills, moderate availability, and exact role match
* WHEN the user opens the candidate breakdown
* THEN the system displays a rule-based explanation
* AND the explanation mentions the relevant scoring factors

## TC-033: Candidate Breakdown Not Found

* GIVEN demand `D001` exists
* AND candidate `EMP-999` does not exist for that demand
* WHEN the client sends `GET /workspace/D001/candidates/EMP-999/breakdown`
* THEN the system returns HTTP 404
* AND the error message indicates that the candidate breakdown was not found

---

## TC-034: Create Proposed Squad Workspace

* GIVEN a valid demand exists with `demand_id="D001"`
* WHEN the client sends `POST /squad` with `demand_id="D001"`
* THEN the system creates a proposed squad workspace
* AND returns HTTP 201
* AND returns a `squad_id`
* AND returns `filledSeats=0`

## TC-035: Reject Squad Creation For Missing Demand

* GIVEN no demand exists with `demand_id="UNKNOWN"`
* WHEN the client sends `POST /squad` with `demand_id="UNKNOWN"`
* THEN the system returns HTTP 404
* AND no squad workspace is created

## TC-036: Assign Candidate To Squad

* GIVEN a proposed squad exists with `squad_id="SQ1"`
* AND candidate `EMP-001` is available in the ranked candidates list
* WHEN the user assigns candidate `EMP-001` to the squad
* THEN the system adds the candidate to the proposed squad
* AND returns HTTP 200
* AND updates `filledSeats` to `1`

## TC-037: Prevent Duplicate Candidate Assignment

* GIVEN candidate `EMP-001` is already assigned to squad `SQ1`
* WHEN the user attempts to assign `EMP-001` to the same squad again
* THEN the system prevents the duplicate assignment
* AND returns HTTP 400
* AND displays an error message

## TC-038: Assigned Candidate Appears In Sticky Footer Tray

* GIVEN a candidate has been assigned to the proposed squad
* WHEN the squad builder workspace is active
* THEN the system displays the candidate in the sticky footer tray
* AND the filled seat count is updated

## TC-039: Remove Candidate From Squad

* GIVEN candidate `EMP-001` is assigned to squad `SQ1`
* WHEN the user removes candidate `EMP-001`
* THEN the system removes the candidate from the squad
* AND returns HTTP 200
* AND updates the filled seat count

## TC-040: Remove Candidate Not Found

* GIVEN squad `SQ1` exists
* AND candidate `EMP-999` is not assigned to the squad
* WHEN the client sends `DELETE /squad/SQ1/members/EMP-999`
* THEN the system returns HTTP 404
* AND the squad member list remains unchanged

## TC-041: Enable Actions When Candidates Are Selected

* GIVEN at least one candidate is assigned to the squad
* WHEN the squad builder is displayed
* THEN the system enables finalize, reset, and export actions
* AND the actions are visible to the user

## TC-042: Finalize Squad Successfully

* GIVEN squad `SQ1` has at least one assigned candidate
* WHEN the user finalizes the squad
* THEN the system returns HTTP 200
* AND updates the squad status to `FINALIZED`
* AND displays a confirmation summary of selected members

## TC-043: Reject Finalizing Empty Squad

* GIVEN squad `SQ1` has no assigned candidates
* WHEN the user attempts to finalize the squad
* THEN the system returns HTTP 400
* AND the error message indicates that an empty squad cannot be finalized

## TC-044: Reset Squad Workspace

* GIVEN squad `SQ1` has one or more assigned candidates
* WHEN the user resets the squad
* THEN the system removes all assigned candidates from the workspace
* AND returns HTTP 200
* AND updates `filledSeats` to `0`

## TC-045: Reset Missing Squad

* GIVEN no squad exists with `squad_id="UNKNOWN"`
* WHEN the client sends `POST /squad/UNKNOWN/reset`
* THEN the system returns HTTP 404
* AND no workspace is modified

---

## TC-046: Structured Error Response Is Returned

* GIVEN an API error occurs during a request
* WHEN the server handles the error
* THEN the system returns a structured error response
* AND the server does not crash

## TC-047: JSON Request Parsing Is Supported

* GIVEN the client sends a valid JSON request body
* WHEN the request reaches the backend
* THEN the system parses the JSON body correctly
* AND the endpoint processes the request

## TC-048: CORS Is Supported

* GIVEN the frontend client sends an API request
* WHEN the request reaches the backend
* THEN the server allows permitted cross-origin requests
* AND the frontend can receive the API response

## TC-049: Mock Data Is Used For Candidate Scoring

* GIVEN the system is running in the prototype environment
* WHEN candidate scoring is executed
* THEN the system uses mock candidate data only
* AND no external HR or capacity system is called

## TC-050: Candidate Ranking Is Reproducible

* GIVEN the same demand and same mock candidate data are used
* WHEN scoring is executed multiple times
* THEN the system returns the same candidate scores
* AND the ranking order remains consistent



# Additional UI/UX Test Cases

## TC-051: Application Shell Renders Core Layout

* GIVEN the user opens SquadForge
* WHEN the application loads successfully
* THEN the fixed top header is displayed
* AND the left sidebar is displayed
* AND the main content area is displayed
* AND the sticky footer region is reserved for squad actions

## TC-052: Application Shell Displays Branding

* GIVEN the application shell is loaded
* WHEN the user views the sidebar
* THEN the app name `SquadForge` is displayed
* AND the sidebar section label `SF Resource Optimization` is displayed

## TC-053: Sidebar Displays Primary Navigation Items

* GIVEN the application shell is loaded
* WHEN the user views the sidebar
* THEN the sidebar displays `Demand Center`, `Resource Queue`, `Team Config`, `Analytics`, `Support`, and `Documentation`
* AND each navigation item is clickable

## TC-054: Active Navigation Item Is Highlighted

* GIVEN the user is on the `Demand Center` screen
* WHEN the sidebar is displayed
* THEN `Demand Center` is visually highlighted
* AND the highlight uses the secondary green selected-state treatment

## TC-055: Navigation Changes Active Screen

* GIVEN the user is on the `Demand Center` screen
* WHEN they click `Resource Queue`
* THEN the main content changes to the Resource Queue screen
* AND `Resource Queue` becomes the active highlighted navigation item

## TC-056: Global Search Placeholder Is Displayed

* GIVEN the application shell is loaded
* WHEN the user views the top header
* THEN the global search input is visible
* AND the placeholder text is `Search resources...`

## TC-057: Global Search Filters Supported Resources

* GIVEN candidate or resource data is visible
* WHEN the user types a search term into global search
* THEN visible candidates or resources are filtered where supported
* AND unrelated records are hidden from the current view

## TC-058: Header Action Popovers Open

* GIVEN the application shell is loaded
* WHEN the user clicks the settings icon, notification icon, or user avatar
* THEN the system opens the relevant menu, popover, or placeholder state
* AND the shell remains visible

## TC-059: Shell Remains Visible During Loading And Error States

* GIVEN the main content area is loading or has failed
* WHEN the shell is displayed
* THEN the top header and sidebar remain visible
* AND the main content area shows either skeleton placeholders or a recoverable error message

---

## TC-060: Demand Center Displays Page Header

* GIVEN the user opens the Demand Center
* WHEN the screen loads
* THEN the page header is displayed
* AND a short instruction text is displayed

## TC-061: Demand Center Displays Demand Form Card

* GIVEN the user opens the Demand Center
* WHEN the screen loads
* THEN the demand form card is displayed
* AND the card uses a white or off-white surface with a subtle border

## TC-062: Demand Form Displays Required Inputs

* GIVEN the Demand Center is loaded
* WHEN the user views the demand form
* THEN the form displays Squad Intent, Urgency, Project Code, Business Domain, Expected Duration, and Required Competencies fields
* AND each field has a visible label

## TC-063: Squad Intent Updates Session Criteria

* GIVEN the user is on the Demand Center
* WHEN they type `Retail Banking App Refactor` into the Squad Intent field
* THEN the demand criteria in session state is updated
* AND the entered value remains visible in the form

## TC-064: Project Code Accepts Valid Format

* GIVEN the user is on the Demand Center
* WHEN they enter project code `ZAF-2024-081`
* THEN the system accepts the project code
* AND no validation error is shown

## TC-065: Project Code Shows Validation Error When Missing

* GIVEN the user is on the Demand Center
* WHEN they submit the form without a project code
* THEN the system displays `Enter a project code.`
* AND recommendations are not generated

## TC-066: Missing Squad Intent Shows Validation Error

* GIVEN the user is on the Demand Center
* WHEN they submit the form without Squad Intent
* THEN the system displays `Enter a squad intent.`
* AND recommendations are not generated

## TC-067: Missing Urgency Shows Validation Error

* GIVEN the user is on the Demand Center
* WHEN they submit the form without selecting urgency
* THEN the system displays `Select an urgency level.`
* AND recommendations are not generated

## TC-068: Missing Business Domain Shows Validation Error

* GIVEN the user is on the Demand Center
* WHEN they submit the form without selecting business domain
* THEN the system displays `Select a business domain.`
* AND recommendations are not generated

## TC-069: Missing Expected Duration Shows Validation Error

* GIVEN the user is on the Demand Center
* WHEN they submit the form without expected duration
* THEN the system displays `Enter an expected duration.`
* AND recommendations are not generated

## TC-070: Missing Required Competencies Shows Validation Error

* GIVEN the user is on the Demand Center
* WHEN they submit the form without required competencies
* THEN the system displays `Add at least one required competency.`
* AND recommendations are not generated

## TC-071: Add Skill Opens Skill Selector

* GIVEN the user is on the Demand Center
* WHEN they click `+ Add Skill`
* THEN the system opens a skill autocomplete or selectable list
* AND the user can select a competency

## TC-072: Selected Skill Appears As Chip

* GIVEN the skill selector is open
* WHEN the user selects `React.js`
* THEN `React.js` appears as a removable skill chip
* AND the demand criteria is updated

## TC-073: Remove Skill Chip Updates Demand Criteria

* GIVEN `React.js` is selected as a required competency
* WHEN the user clicks the `x` icon on the `React.js` chip
* THEN the chip is removed
* AND the demand criteria no longer includes `React.js`

## TC-074: Weighted Suitability Logic Panel Is Displayed

* GIVEN the Demand Center is loaded
* WHEN the user views the demand form
* THEN the Weighted Suitability Logic panel is displayed
* AND it shows `Skills 50%`, `Availability 30%`, and `Role 20%`

## TC-075: Workspace Status Card Displays Live Sync

* GIVEN the Demand Center is loaded
* WHEN the user views the workspace status card
* THEN the system displays a short workspace status message
* AND the sync status badge displays `Live Sync`

## TC-076: Generate Recommendations Shows Loading State

* GIVEN the user has entered valid demand details
* WHEN they click `Generate Recommendations`
* THEN the button shows a loading state
* AND the recommendation area displays skeleton cards

## TC-077: Generate Recommendations Displays Form-Level Error

* GIVEN the user has entered incomplete or invalid demand details
* WHEN recommendation generation fails
* THEN the system displays `Unable to generate recommendations. Check demand details and try again.`
* AND invalid fields display inline validation messages

---

## TC-078: Resource Queue Displays Two-Column Desktop Layout

* GIVEN recommendations have been generated
* WHEN the user opens the Resource Queue on desktop
* THEN the screen displays a left demand/scoring panel
* AND the screen displays a right recommendation queue
* AND candidate cards are shown in a two-column grid

## TC-079: Resource Queue Displays Active Demand Criteria

* GIVEN recommendations have been generated for a demand
* WHEN the Resource Queue is displayed
* THEN the left panel shows squad intent, urgency, project code, business domain, duration, and required competencies
* AND the displayed criteria matches the submitted demand

## TC-080: Recommendation Queue Header Displays Controls

* GIVEN the Resource Queue is loaded
* WHEN the user views the right panel header
* THEN the title `Recommendation Queue` is displayed
* AND filter and rank controls are visible

## TC-081: Filter Control Opens Candidate Filters

* GIVEN the Resource Queue is loaded
* WHEN the user clicks `Filter`
* THEN the system opens filter controls
* AND the filter controls support role, availability, skills, domain, or suitability range where implemented

## TC-082: Rank Control Changes Sort Order

* GIVEN candidate recommendations are visible
* WHEN the user changes the rank option to availability, skill match, role fit, or suitability
* THEN the recommendation queue updates its order
* AND the displayed cards reflect the selected ranking mode

## TC-083: Empty Recommendation Queue Message Is Displayed

* GIVEN no recommendations have been generated yet
* WHEN the user opens the Resource Queue
* THEN the system displays `No recommendations yet. Capture demand details and generate recommendations.`
* AND no candidate cards are shown

## TC-084: Recommendation Queue Loading State Displays Skeleton Cards

* GIVEN recommendation data is loading
* WHEN the Resource Queue is displayed
* THEN candidate cards show skeleton avatar, score, bars, and action placeholders
* AND card action buttons are disabled

## TC-085: Recommendation Queue Error State Displays Retry

* GIVEN recommendation data fails to load
* WHEN the Resource Queue is displayed
* THEN the system displays `Unable to load recommendation queue. Try again.`
* AND a retry action is available

---

## TC-086: Candidate Card Displays Core Candidate Data

* GIVEN candidate recommendations are available
* WHEN a candidate card is rendered
* THEN it displays avatar or initials, candidate name, role, availability status, and suitability score
* AND the suitability score is formatted as a percentage from 0 to 100%

## TC-087: Candidate Card Displays Score Breakdown Preview

* GIVEN candidate recommendations are available
* WHEN a candidate card is rendered
* THEN the card displays Skills Match, Availability, and Role Fit rows
* AND each row shows a numeric contribution such as `48/50`, `21/30`, or `20/20`

## TC-088: Candidate Card Displays Progress Bars With Numeric Labels

* GIVEN a candidate card is rendered
* WHEN the user views the score preview
* THEN progress bars are displayed for scoring components
* AND numeric values are shown beside the bars so meaning does not rely on color alone

## TC-089: Candidate Card Hover State Is Applied

* GIVEN a candidate card is visible
* WHEN the user hovers over the card
* THEN a subtle navy-tinted hover state is applied
* AND the card content remains readable

## TC-090: Candidate Card Actions Have Visible Focus State

* GIVEN a candidate card is visible
* WHEN the user tabs to `Expand Breakdown` or `Assign to Squad`
* THEN the focused action displays a visible focus state
* AND the action remains keyboard accessible

## TC-091: Candidate Data Unavailable Fallback

* GIVEN a candidate record cannot be rendered
* WHEN the candidate card loads
* THEN the card displays `Candidate data unavailable.`
* AND the rest of the recommendation queue remains usable

---

## TC-092: Expand Candidate Breakdown

* GIVEN a candidate card is visible
* WHEN the user clicks `Expand Breakdown`
* THEN the system opens the detailed scoring breakdown
* AND the candidate card or drawer shows score calculation details

## TC-093: Collapse Candidate Breakdown

* GIVEN a candidate breakdown is open
* WHEN the user clicks `Collapse Breakdown` or clicks the active breakdown link again
* THEN the system hides the detailed calculation
* AND the candidate card returns to its collapsed state

## TC-094: Candidate Breakdown Shows Total Suitability

* GIVEN a candidate breakdown is open
* WHEN the user views the breakdown
* THEN the total suitability score is displayed as a percentage
* AND it matches the candidate card score

## TC-095: Candidate Breakdown Shows Component Contributions

* GIVEN a candidate breakdown is open
* WHEN the user views the score calculation section
* THEN Skills Match, Availability, and Role Fit contributions are displayed
* AND each contribution includes numeric values and progress bars

## TC-096: Candidate Breakdown Shows Matched Skills

* GIVEN a candidate has matched skills
* WHEN the user opens the candidate breakdown
* THEN matched skills are displayed as skill chips
* AND the chips are readable and visually distinct

## TC-097: Candidate Breakdown Shows Missing Or Weaker Skills

* GIVEN a candidate is missing or weak in one or more required competencies
* WHEN the user opens the candidate breakdown
* THEN the missing or weaker skills are displayed where available
* AND the recommendation reason reflects the weaker match

## TC-098: Candidate Breakdown Shows Rule-Based Reason

* GIVEN a candidate has a calculated suitability score
* WHEN the user opens the candidate breakdown
* THEN the system displays a short rule-based recommendation reason
* AND the reason explains skills, availability, and role fit

## TC-099: Candidate Breakdown Shows Calculation Formula

* GIVEN a candidate breakdown is open
* WHEN the user views the calculation section
* THEN the formula `Total = Skills + Availability + Role` is displayed
* AND the formula matches the visible score components

## TC-100: Assign Candidate From Expanded Breakdown

* GIVEN a candidate breakdown is open
* WHEN the user clicks `Assign to Squad`
* THEN the candidate is added to the proposed squad
* AND the breakdown remains open unless the implementation intentionally closes it

## TC-101: Breakdown Empty State Is Displayed

* GIVEN no breakdown is available for a candidate
* WHEN the user attempts to view the breakdown
* THEN the system displays `No breakdown available for this candidate.`
* AND the user can return to the recommendation queue

## TC-102: Breakdown Loading State Is Displayed

* GIVEN breakdown data is loading
* WHEN the breakdown panel opens
* THEN score rows show skeleton bars
* AND placeholder reason text is displayed

## TC-103: Breakdown Error State Is Displayed

* GIVEN breakdown data fails to load
* WHEN the breakdown panel opens
* THEN the system displays `Unable to load score breakdown.`
* AND a retry action is available

---

## TC-104: Assign Candidate Updates Proposed Squad Footer

* GIVEN a candidate is visible in the recommendation queue
* WHEN the user clicks `Assign to Squad`
* THEN the candidate is added to the Proposed Delivery Squad footer
* AND the selected count and avatar stack update

## TC-105: Proposed Squad Footer Displays Title And Count

* GIVEN one or more candidates are selected
* WHEN the sticky footer is displayed
* THEN the title `Proposed Delivery Squad` is visible
* AND the selected count is displayed in the format `3 of 5 seats filled (60%)`

## TC-106: Footer Displays Selected Candidate Avatars

* GIVEN multiple candidates are selected
* WHEN the footer is displayed
* THEN selected candidate avatars or initials are shown
* AND overflow candidates are represented using `+N`

## TC-107: Footer Displays Squad Velocity Score

* GIVEN candidates are selected
* WHEN the footer is displayed
* THEN the Squad Velocity Score is visible
* AND a trend indicator is displayed where supported

## TC-108: Duplicate Assignment Shows Warning

* GIVEN candidate `EMP-001` is already selected
* WHEN the user clicks `Assign to Squad` for `EMP-001` again
* THEN the footer remains unchanged
* AND the system displays `Candidate is already in the proposed squad.`

## TC-109: Candidate Unavailable Assignment Is Prevented

* GIVEN a candidate cannot be assigned because of availability constraints
* WHEN the user clicks `Assign to Squad`
* THEN the system prevents the assignment
* AND displays `Candidate cannot be assigned because of availability constraints.`

## TC-110: Remove Candidate From Footer Chip

* GIVEN a candidate is selected in the Proposed Delivery Squad footer
* WHEN the user removes the candidate from the footer chip
* THEN the candidate is removed from the proposal
* AND the seat count and avatar stack update

## TC-111: Reset Proposal Clears Selected Candidates

* GIVEN one or more candidates are selected
* WHEN the user clicks `Reset Proposal`
* THEN the system clears all selected candidates
* AND the footer returns to an empty or no-selection state

## TC-112: Empty Footer Disables Finalize

* GIVEN no candidates are selected
* WHEN the footer is visible
* THEN the system displays `No candidates selected yet.` or hides the footer
* AND the `Finalize Squad` button is disabled

## TC-113: Footer Loading State Disables Actions

* GIVEN a finalization or update request is pending
* WHEN the footer is displayed
* THEN footer actions are disabled
* AND the user cannot submit duplicate actions

## TC-114: Footer Error State Is Displayed

* GIVEN the proposed squad update fails
* WHEN the footer is displayed
* THEN the system displays `Unable to update proposed squad. Try again.`
* AND the current selected candidates remain visible

---

## TC-115: Finalize Opens Squad Summary Screen

* GIVEN one or more candidates are selected
* WHEN the user clicks `Finalize Squad`
* THEN the system opens the Squad Summary screen
* AND selected candidates are preserved

## TC-116: Finalize Without Candidates Shows Validation

* GIVEN no candidates are selected
* WHEN the user attempts to finalize the squad
* THEN the system displays `Assign at least one candidate before finalizing.`
* AND the squad is not finalized

## TC-117: Squad Summary Displays Project Information

* GIVEN the Squad Summary screen is open
* WHEN the user views the summary card
* THEN the project code, business domain, squad intent, urgency, and required competencies are displayed
* AND the values match the active demand

## TC-118: Squad Summary Displays Member Table

* GIVEN selected candidates exist
* WHEN the Squad Summary screen is open
* THEN the selected members are displayed in a table
* AND each row includes member name, role, suitability score, availability status, and score components where space allows

## TC-119: Back Returns To Resource Queue Without Losing Selection

* GIVEN the user is on the Squad Summary screen
* WHEN they click `Back`
* THEN the system returns to the Resource Queue
* AND selected candidates remain in the Proposed Delivery Squad footer

## TC-120: Remove Member Before Finalizing Updates Summary

* GIVEN the user is on the Squad Summary screen
* WHEN they remove a member before finalizing
* THEN the member is removed from the summary table
* AND the final squad count and percentage update

## TC-121: Confirm Finalize Marks Squad As Finalized

* GIVEN the Squad Summary screen shows at least one selected member
* WHEN the user clicks `Confirm Finalize` or `Done`
* THEN the squad proposal is marked as finalized
* AND the system displays a success confirmation

## TC-122: Export Summary Triggers Mock Export

* GIVEN the Squad Summary screen is open
* WHEN the user clicks `Export Summary`
* THEN the system downloads or displays a mock export summary
* AND the current squad details are included in the export output

## TC-123: Squad Summary Empty State

* GIVEN no squad members are selected
* WHEN the Squad Summary screen is opened
* THEN the system displays `No squad members selected. Return to Resource Queue to assign candidates.`
* AND finalization is not allowed

## TC-124: Squad Summary Error State

* GIVEN selected squad data fails to load
* WHEN the Squad Summary screen is displayed
* THEN the system displays `Unable to finalize squad. Try again.`
* AND the user can return to the Resource Queue

---

## TC-125: Team Config Displays Mock Candidate Table

* GIVEN the user opens Team Config
* WHEN the screen loads successfully
* THEN the system displays a candidate data table
* AND the table includes candidate name, role, skill set, domain, allocation percentage, availability, and geographic location

## TC-126: Team Config Displays Scoring Weights

* GIVEN the user opens Team Config
* WHEN the configuration screen loads
* THEN the scoring settings panel displays Skills 50%, Availability 30%, and Role 20%
* AND the values match the visible scoring model used in recommendations

## TC-127: Team Config Search Filters Candidate Table

* GIVEN mock candidates are displayed in Team Config
* WHEN the user searches or filters candidates
* THEN the table narrows to matching candidates
* AND non-matching rows are hidden

## TC-128: Team Config Empty State

* GIVEN no mock candidates are configured
* WHEN the user opens Team Config
* THEN the system displays `No mock candidates configured.`
* AND no candidate rows are shown

## TC-129: Team Config Error State

* GIVEN mock configuration data fails to load
* WHEN the user opens Team Config
* THEN the system displays `Unable to load team configuration.`
* AND the user remains within the application shell

---

## TC-130: Analytics Displays KPI Cards

* GIVEN recommendations or proposals exist
* WHEN the user opens Analytics
* THEN the system displays KPI cards for total candidates, average suitability, filled seats, and velocity score
* AND each KPI has a readable value

## TC-131: Analytics Displays Charts

* GIVEN recommendation data exists
* WHEN the Analytics screen loads
* THEN the system displays suitability distribution and role coverage charts
* AND chart data matches the current recommendation/proposal dataset

## TC-132: Analytics Filters Update KPI And Chart Data

* GIVEN Analytics data is visible
* WHEN the user changes filters
* THEN KPI cards and charts update
* AND the updated values reflect the selected filter criteria

## TC-133: Analytics Recent Proposal Opens Summary

* GIVEN recent proposals are displayed
* WHEN the user clicks a recent proposal
* THEN the system opens the related squad summary
* AND the proposal details are displayed

## TC-134: Analytics Empty State

* GIVEN no recommendations have been generated
* WHEN the user opens Analytics
* THEN the system displays `No analytics yet. Generate recommendations to populate this view.`
* AND KPI and chart areas remain empty

## TC-135: Analytics Error State

* GIVEN analytics data fails to load
* WHEN the user opens Analytics
* THEN the system displays `Unable to load analytics.`
* AND the application shell remains visible

---

## TC-136: Desktop Layout Matches Specification

* GIVEN the user opens SquadForge on a desktop viewport
* WHEN the Resource Queue is displayed
* THEN the sidebar remains visible
* AND the Resource Queue uses a two-column layout
* AND candidate cards display in a two-column grid
* AND the sticky footer remains fixed at the bottom

## TC-137: Tablet Layout Collapses Sidebar

* GIVEN the user opens SquadForge on a tablet viewport
* WHEN the Resource Queue is displayed
* THEN the sidebar collapses into icon-only mode or an equivalent compact layout
* AND candidate cards display in a single column where needed

## TC-138: Mobile Layout Uses Stacked Content

* GIVEN the user opens SquadForge on a mobile viewport
* WHEN the Demand Center or Resource Queue is displayed
* THEN demand form and recommendation queue content stack vertically
* AND navigation moves to a drawer or bottom navigation

## TC-139: Mobile Candidate Actions Are Full Width

* GIVEN the user views a candidate card on mobile
* WHEN the card is displayed
* THEN card actions are full-width buttons
* AND the buttons remain easy to tap

## TC-140: Mobile Footer Becomes Bottom Action Sheet

* GIVEN candidates are selected on mobile
* WHEN the proposed squad footer is displayed
* THEN it appears as a compact bottom action sheet
* AND it does not block essential candidate card actions

---

## TC-141: All Form Controls Have Visible Labels

* GIVEN the user views any form in SquadForge
* WHEN the form controls are displayed
* THEN each control has a visible label
* AND placeholder text is not used as the only label

## TC-142: Interactive Elements Are Keyboard Accessible

* GIVEN the user navigates using the keyboard
* WHEN they tab through buttons, links, chips, filters, menus, and form controls
* THEN each interactive element can receive focus
* AND each element can be activated using keyboard input where appropriate

## TC-143: Focus States Are Visible

* GIVEN an interactive element receives keyboard focus
* WHEN the focus state is shown
* THEN the focus indicator is visible and consistent
* AND the focus state uses a strong outline or green outer glow

## TC-144: Score Bars Do Not Depend On Color Alone

* GIVEN a score bar is displayed
* WHEN the user views the score component
* THEN the numeric value is displayed beside the bar
* AND the score can be understood without relying only on color

## TC-145: Status Badges Include Text Labels

* GIVEN an availability badge is displayed
* WHEN the user views the candidate card or breakdown
* THEN the badge includes a text label such as `Available Now`, `Next Mon`, or `2 Week Notice`
* AND the badge is not communicated by color alone

## TC-146: Buttons Have Accessible Names

* GIVEN a button is displayed
* WHEN assistive technology reads the button
* THEN the accessible name matches the visible label
* AND the button purpose is clear

## TC-147: Disabled Buttons Do Not Respond To Clicks

* GIVEN a button is disabled
* WHEN the user clicks the button
* THEN no action is performed
* AND the disabled visual state remains visible

## TC-148: Primary Buttons Use Correct Visual Treatment

* GIVEN a primary action button is displayed
* WHEN the user views the screen
* THEN the button uses deep navy background with white text
* AND the button label is readable

## TC-149: Success Buttons Use Correct Visual Treatment

* GIVEN a finalize or success action is displayed
* WHEN the user views the action
* THEN the button uses green background with white text
* AND the action is visually distinct from secondary actions

## TC-150: Cards Use Correct Visual Treatment

* GIVEN a candidate card or form card is displayed
* WHEN the user views the card
* THEN the card uses a white or off-white surface
* AND the card has a low-contrast border and readable content

## TC-151: Skill Chips Use Removable State When Editable

* GIVEN an editable skill chip is displayed
* WHEN the user views the chip
* THEN it shows a removable `x` icon
* AND clicking the icon removes the skill where editing is allowed

## TC-152: Overflow Avatar Chip Displays Count

* GIVEN more selected candidates exist than can fit in the avatar stack
* WHEN the footer displays selected candidates
* THEN overflow candidates are represented using `+N`
* AND the visible count is accurate

## TC-153: Sticky Footer Does Not Block Core Actions

* GIVEN the Resource Queue is displayed with the sticky footer visible
* WHEN the user scrolls through candidate cards
* THEN the footer remains compact
* AND it does not block candidate card actions such as `Expand Breakdown` or `Assign to Squad`
