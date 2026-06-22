# REQUIREMENTS — Feature 2: Matchmaking & Scoring Engine

## EARS Format

### REQ-008

> The system shall calculate the total suitability score using a deterministic weighted sum formula: `S_Total = (0.50 × S_Skill) + (0.30 × S_Avail) + (0.20 × S_Role)`.

### REQ-009

> Where multiple required skills are selected, the system shall calculate `S_Skill` as the average score across all required skills.

### REQ-010

> If a candidate profile does not contain the exact requested skill name string, then the system shall assign that skill a score of 0 points.

### REQ-011

> Where a candidate profile contains the exact requested skill name string and the skill level is greater than or equal to 4, the system shall assign that skill a score of 100 points.

### REQ-012

> Where a candidate profile contains the exact requested skill name string and the skill level is less than 4, the system shall assign that skill a score of 80 points.

### REQ-013

> Where a candidate's current allocation percentage is exactly 0%, the system shall assign an Availability Score of 100 points.

### REQ-014

> Where a candidate's current allocation percentage is between 1% and 50%, the system shall assign an Availability Score of 70 points.

### REQ-015

> Where a candidate's current allocation percentage is greater than 50%, the system shall assign an Availability Score of 20 points.

### REQ-016

> If a candidate's primary role matches the requested role exactly, then the system shall assign a Role Alignment Score of 100 points.

### REQ-017

> If a candidate's primary role does not match the requested role exactly, then the system shall assign a Role Alignment Score of 0 points.

### REQ-018

> The system shall use a rules-based scoring approach only and shall not use AI or machine learning.
