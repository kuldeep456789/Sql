
export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Column {
  name: string;
  type: string;
}

export interface TableSchema {
  tableName: string;
  columns: Column[];
  sampleData: Record<string, any>[];
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  requirements: string[];
  schemas: TableSchema[];
  expectedOutput?: Record<string, any>[];
  initialQuery?: string;
}

export interface QueryResult {
  data: Record<string, any>[];
  columns: string[];
  executionTime: number;
  error?: string;
}

export interface ActivityHistory {
  date: string;
  count: number;
}

export interface UserStats {
  solvedCount: number;
  xp: number;
  rank: string;
  streak: number;
  history: ActivityHistory[];
  progress: number;
}
