
import { QueryResult, TableSchema } from '../types';

export const executeQuery = (query: string, schemas: TableSchema[]): QueryResult => {
  const startTime = performance.now();
  const lowerQuery = query.toLowerCase().trim();

  if (!lowerQuery.startsWith('select')) {
    return {
      data: [],
      columns: [],
      executionTime: performance.now() - startTime,
      error: 'Error: Only SELECT queries are permitted in this sandbox environment.'
    };
  }

  const tablesInQuery = schemas.filter(s => lowerQuery.includes(s.tableName.toLowerCase()));
  if (tablesInQuery.length === 0) {
    return {
      data: [],
      columns: [],
      executionTime: performance.now() - startTime,
      error: 'Error: Table not found in the current schema.'
    };
  }

  try {
    const primaryTable = tablesInQuery[0];
    let results = [...primaryTable.sampleData];

    if (lowerQuery.includes("'london'") || lowerQuery.includes('"london"')) {
      results = results.filter(r => r.city === 'London');
    }

    if (lowerQuery.includes('active')) {
      results = results.filter(r => r.status === 'active');
    }

    const columns = results.length > 0 ? Object.keys(results[0]) : primaryTable.columns.map(c => c.name);

    return {
      data: results,
      columns: columns,
      executionTime: performance.now() - startTime
    };
  } catch (err) {
    return {
      data: [],
      columns: [],
      executionTime: performance.now() - startTime,
      error: 'Syntax Error: Could not parse query near "' + query.substring(0, 10) + '..."'
    };
  }
};
