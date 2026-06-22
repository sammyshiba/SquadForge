# REQUIREMENTS — Feature 1: Demand & Search Workspace

## EARS Format

### REQ-001

> When a delivery lead opens the Demand Center, the system shall display a demand capture form with squad intent, project code, priority level, required role, required skills, expected duration, and business domain.

### REQ-002

> When a user submits the Demand Capture Form with a valid role and at least one required skill, the system shall execute the scoring algorithm against all candidate profiles in the mock dataset.

### REQ-003

> When search results are calculated, the system shall render the candidate list sorted from highest to lowest total suitability score within 1 second.

### REQ-004

> If a user modifies any input field after recommendations have been generated, then the system shall recalculate and re-sort the candidate list in real time.

### REQ-005

> If a user submits the form without a required role, then the system shall display an error message indicating that the required role is missing.

### REQ-006

> If a user submits the form without at least one required skill, then the system shall display an error message indicating that at least one skill is required.

### REQ-007

> The system shall display candidate metrics using mock data structures with zero external API calls to HR, calendar, identity, or enterprise platforms.
