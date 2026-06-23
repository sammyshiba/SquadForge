import { createContext, useContext, useReducer } from 'react';

import type { ReactNode } from 'react';
import type { DemandCriteria, ScoredCandidate } from '../types';

interface SquadMember {
  employeeId: string;
  fullName: string;
  primaryRole: string;
  sTotal: number;
}

interface SquadState {
  demandId: string | null;
  demandCriteria: DemandCriteria | null;
  candidateList: ScoredCandidate[];
  isLoading: boolean;
  squad: SquadMember[];
  squadId: string | null;
  filledSeats: number;
  squadStatus: 'draft' | 'finalized';
}

type SquadAction =
  | { type: 'SET_DEMAND'; payload: { demandId: string; criteria: DemandCriteria } }
  | { type: 'SET_CANDIDATES'; payload: ScoredCandidate[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'RESET' }
  | { type: 'SET_SQUAD_ID'; payload: string }
  | { type: 'ADD_TO_SQUAD'; payload: SquadMember }
  | { type: 'REMOVE_FROM_SQUAD'; payload: string }
  | { type: 'RESET_SQUAD' }
  | { type: 'FINALIZE_SQUAD' };

const initialState: SquadState = {
  demandId: null,
  demandCriteria: null,
  candidateList: [],
  isLoading: false,
  squad: [],
  squadId: null,
  filledSeats: 0,
  squadStatus: 'draft',
};

const squadReducer = (state: SquadState, action: SquadAction): SquadState => {
  switch (action.type) {
    case 'SET_DEMAND':
      return {
        ...state,
        demandId: action.payload.demandId,
        demandCriteria: action.payload.criteria,
      };
    case 'SET_CANDIDATES':
      return { ...state, candidateList: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'RESET':
      return initialState;
    case 'SET_SQUAD_ID':
      return { ...state, squadId: action.payload };
    case 'ADD_TO_SQUAD': {
      if (state.squad.find((m) => m.employeeId === action.payload.employeeId)) {
        return state;
      }
      const newSquad = [...state.squad, action.payload];
      return { ...state, squad: newSquad, filledSeats: newSquad.length };
    }
    case 'REMOVE_FROM_SQUAD': {
      const filtered = state.squad.filter((m) => m.employeeId !== action.payload);
      return { ...state, squad: filtered, filledSeats: filtered.length };
    }
    case 'RESET_SQUAD':
      return { ...state, squad: [], filledSeats: 0, squadStatus: 'draft' };
    case 'FINALIZE_SQUAD':
      return { ...state, squadStatus: 'finalized' };
    default:
      return state;
  }
};

interface SquadContextValue {
  state: SquadState;
  dispatch: React.Dispatch<SquadAction>;
}

const SquadContext = createContext<SquadContextValue | null>(null);

interface SquadProviderProps {
  children: ReactNode;
}

export const SquadProvider = ({ children }: SquadProviderProps): JSX.Element => {
  const [state, dispatch] = useReducer(squadReducer, initialState);

  return (
    <SquadContext.Provider value={{ state, dispatch }}>
      {children}
    </SquadContext.Provider>
  );
};

export const useSquadContext = (): SquadContextValue => {
  const context = useContext(SquadContext);
  if (!context) {
    throw new Error('useSquadContext must be used within a SquadProvider');
  }
  return context;
};
