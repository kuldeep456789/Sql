import { QueryResult, TableSchema } from '../types';
import { api } from './api';


export const executeQuery = async (query: string, schemas: TableSchema[]): Promise<QueryResult> => {
  const startTime = performance.now();
  try {
    const result = await api.post('/execute', { sql: query });

    // Transform backend result to frontend QueryResult format
    // Backend returns { rows: [], rowCount: number }
    // Frontend expects { data: [], columns: [], executionTime: number }

    const data = result.rows || [];
    const columns = data.length > 0 ? Object.keys(data[0]) : [];

    return {
      data,
      columns,
      executionTime: performance.now() - startTime
    };
  } catch (err: any) {
    return {
      data: [],
      columns: [],
      executionTime: performance.now() - startTime,
      error: err.message || 'Execution Error'
    };
  }
};

