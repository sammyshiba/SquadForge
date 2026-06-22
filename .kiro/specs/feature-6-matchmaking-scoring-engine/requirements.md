# REQUIREMENTS — Feature 6: Matchmaking & Scoring Engine

## EARS Format

### REQ-6.1 (Ubiquitous)

> The system shall calculate suitability using weighted scoring: `S_Total = (0.50 × S_Skill) + (0.30 × S_Avail) + (0.20 × S_Role)`.

### REQ-6.2 (Ubiquitous)

> The system shall calculate skill scores as an average across all required skills.

### REQ-6.3 (Unwanted behaviour)

> Missing skills shall result in 0 score.

### REQ-6.4 (Ubiquitous)

> High skill levels (≥ 4) shall result in maximum score (100).

### REQ-6.5 (Ubiquitous)

> Lower skill levels (< 4) shall result in reduced score (80).

### REQ-6.6 (Ubiquitous)

> Availability shall be calculated from allocation percentage: 0% → 100, 1-50% → 70, >50% → 20.

### REQ-6.7 (Ubiquitous)

> Role alignment shall depend on exact matches: match → 100, no match → 0.

### REQ-6.8 (Ubiquitous)

> The system shall use rules-based scoring only. No AI or machine learning.
