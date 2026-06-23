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
