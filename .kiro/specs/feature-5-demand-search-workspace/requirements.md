# REQUIREMENTS — Feature 5: Demand & Search Workspace

## EARS Format

### REQ-5.1 (Event-driven)

> When a user opens the Demand Center, the system shall display a demand capture form.

### REQ-5.2 (Ubiquitous)

> The demand capture form shall include fields for required role, skills, project urgency, expected duration, business domain, and project code.

### REQ-5.3 (Event-driven)

> When valid demand is submitted, the system shall execute scoring against mock candidates.

### REQ-5.4 (Event-driven)

> When results are calculated, the system shall display ranked candidates within 1 second.

### REQ-5.5 (Event-driven)

> When input fields are modified, the system shall recalculate and update results in real time.

### REQ-5.6 (Unwanted behaviour)

> If required role is missing, then the system shall display a validation message.

### REQ-5.7 (Unwanted behaviour)

> If no skills are provided, then the system shall display a validation message.

### REQ-5.8 (Unwanted behaviour)

> If the project code is missing, then the system shall display a validation message.

### REQ-5.9 (Ubiquitous)

> The system shall store active demand criteria during the user session.

### REQ-5.10 (Ubiquitous)

> The system shall use mock data only with no external integrations.
