export interface DemandCriteria {
  squadIntent: string;
  projectCode: string;
  requiredRole: string;
  requiredSkills: string[];
  urgency: string;
  durationWeeks: number;
  businessDomain: string;
}

export interface DemandFormFields {
  squadIntent: string;
  projectCode: string;
  requiredRole: string;
  requiredSkills: string[];
  urgency: string;
  durationWeeks: string;
  businessDomain: string;
}

export interface SkillProfile {
  id: string;
  skill: string;
  proficiencyLevel: number;
  employeeId: string;
}

export interface Employee {
  id: string;
  email: string;
  fullName: string;
  primaryRole: string;
  currentAllocationPercentage: number;
  availabilityDate: string;
  geographicLocation: string;
  skills: SkillProfile[];
}

export interface ScoredCandidate {
  rank: number;
  employeeId: string;
  fullName: string;
  primaryRole: string;
  currentAllocationPercentage: number;
  availabilityDate: string;
  skills: SkillProfile[];
  sSkill: number;
  sAvail: number;
  sRole: number;
  sTotal: number;
  reason: string;
}

export interface DemandRequest {
  id: string;
  squadIntent: string;
  businessDomain: string;
  projectCode: string;
  requiredRole: string;
  requiredSkills: string;
  urgency: string;
  durationWeeks: number;
  createdAt: string;
  updatedAt: string;
}

export interface FieldErrors {
  [key: string]: string | undefined;
}

export interface SquadMemberResponse {
  employeeId: string;
  name: string;
  primaryRole: string;
  sTotal: number;
}

export interface SquadExportData {
  projectCode: string;
  businessDomain: string;
  squadIntent: string;
  squadName: string;
  filledSeats: number;
  members: SquadMemberResponse[];
}
