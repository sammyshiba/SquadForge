import type { DemandCriteria, DemandRequest, Employee, ScoredCandidate, SquadMemberResponse, SquadExportData } from '../types';

const BASE_URL = '/api';

export interface SquadListItem {
  id: string;
  squadName: string;
  demandId: string;
  status: string;
  filledSeats: number;
  projectCode: string;
  businessDomain: string;
  squadIntent: string;
  members: { employeeId: string; name: string; primaryRole: string }[];
  createdAt: string;
  updatedAt: string;
}

export const fetchSquads = async (): Promise<SquadListItem[]> => {
  const response = await fetch(`${BASE_URL}/squads`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Failed to fetch squads.');
  }

  const result = await response.json();
  return result.data;
};

export const submitDemand = async (
  criteria: DemandCriteria,
): Promise<{ demandId: string; demand: DemandRequest }> => {
  const response = await fetch(`${BASE_URL}/demands`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(criteria),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Failed to submit demand.');
  }

  const result = await response.json();
  return { demandId: result.data.id, demand: result.data };
};

export const scoreCandidates = async (demandId: string): Promise<ScoredCandidate[]> => {
  const response = await fetch(`${BASE_URL}/score`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ demandId }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Failed to score candidates.');
  }

  const result = await response.json();
  return result.data.ranked;
};

export const fetchEmployees = async (): Promise<Employee[]> => {
  const response = await fetch(`${BASE_URL}/employees`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Failed to fetch employees.');
  }

  const result = await response.json();
  return result.data;
};

export const createSquad = async (demandId: string, squadName: string): Promise<{ id: string; filledSeats: number }> => {
  const response = await fetch(`${BASE_URL}/squads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ demandId, squadName }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Failed to create squad.');
  }

  const result = await response.json();
  return { id: result.data.id, filledSeats: result.data.filledSeats };
};

export const assignMember = async (squadId: string, employeeId: string): Promise<{ filledSeats: number }> => {
  const response = await fetch(`${BASE_URL}/squads/${squadId}/members`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ employeeId }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Failed to assign member.');
  }

  const result = await response.json();
  return { filledSeats: result.data.filledSeats };
};

export const removeMember = async (squadId: string, employeeId: string): Promise<void> => {
  const response = await fetch(`${BASE_URL}/squads/${squadId}/members/${employeeId}`, {
    method: 'DELETE',
  });

  if (!response.ok && response.status !== 204) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Failed to remove member.');
  }
};

export const finalizeSquad = async (squadId: string): Promise<{ status: string; members: SquadMemberResponse[] }> => {
  const response = await fetch(`${BASE_URL}/squads/${squadId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'FINALIZED' }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Failed to finalize squad.');
  }

  const result = await response.json();
  return { status: result.data.status, members: result.data.members };
};

export const resetSquad = async (squadId: string): Promise<{ filledSeats: number }> => {
  const response = await fetch(`${BASE_URL}/squads/${squadId}/reset`, {
    method: 'POST',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Failed to reset squad.');
  }

  const result = await response.json();
  return { filledSeats: result.data.filledSeats };
};

export const exportSquad = async (squadId: string): Promise<SquadExportData> => {
  const response = await fetch(`${BASE_URL}/squads/${squadId}/export`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Failed to export squad.');
  }

  const result = await response.json();
  return result.data;
};
