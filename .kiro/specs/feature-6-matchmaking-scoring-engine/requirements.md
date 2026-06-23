# REQUIREMENTS — Feature 6: Matchmaking & Scoring Engine

## EARS Format

### REQ-6.1 (Ubiquitous)

> The system shall calculate suitability using deterministic rules-based weighted scoring.

### REQ-6.2 (Ubiquitous)

> The system shall calculate the total suitability score using the formula: S_Total = (0.50 × S_Skill) + (0.30 × S_Availability) + (0.20 × S_Role).

### REQ-6.3 (Optional)

> Where multiple skills are requested, the system shall calculate the Skill Match Score as an average of individual skill matches.

### REQ-6.4 (Unwanted behaviour)

> If a skill is missing, then the system shall assign a score of 0 for that skill.

### REQ-6.5 (Optional)

> Where a candidate has a skill level of 4 or 5, the system shall assign a maximum score for that skill.

### REQ-6.6 (Optional)

> Where a candidate has a skill level below 4, the system shall assign a reduced score for that skill.

### REQ-6.7 (Optional)

> Where a candidate's allocation is 0%, the system shall assign an Availability Score of 100.

### REQ-6.8 (Optional)

> Where a candidate's allocation is between 1% and 50%, the system shall assign an Availability Score of 70.

### REQ-6.9 (Optional)

> Where a candidate's allocation is greater than 50%, the system shall assign an Availability Score of 20.

### REQ-6.10 (Ubiquitous)

> The system shall determine role alignment based on exact matches.

### REQ-6.11 (Ubiquitous)

> The system shall factor project duration and urgency into candidate availability and suitability scoring.

### REQ-6.12 (Ubiquitous)

> The system shall use rules-based scoring only.
