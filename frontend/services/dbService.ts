
import { QueryResult, TableSchema } from '../types';

/**
 * A highly simplified SQL execution engine for demo purposes.
 * In a real-world app, this would call a backend or use sql.js (WASM).
 * Here, we simulate the results to provide an interactive UX.
 */
export const executeQuery = (query: string, schemas: TableSchema[]): QueryResult => {
  const startTime = performance.now();
  const lowerQuery = query.toLowerCase().trim();

  // Basic validation/sanitization simulation
  if (!lowerQuery.startsWith('select')) {
    return {
      data: [],
      columns: [],
      executionTime: performance.now() - startTime,
      error: 'Error: Only SELECT queries are permitted in this sandbox environment.'
    };
  }

  // Check for table existence
  const tablesInQuery = schemas.filter(s => lowerQuery.includes(s.tableName.toLowerCase()));
  if (tablesInQuery.length === 0) {
    return {
      data: [],
      columns: [],
      executionTime: performance.now() - startTime,
      error: 'Error: Table not found in the current schema.'
    };
  }

  // Simulation Logic: 
  // For the sake of a frontend assignment, we will return the sample data of the primary table
  // but filtered slightly if specific common keywords are found.
  try {
    const primaryTable = tablesInQuery[0];
    let results = [...primaryTable.sampleData];

    // Simple WHERE simulation for keywords in the query
    if (lowerQuery.includes("'london'") || lowerQuery.includes('"london"')) {
      results = results.filter(r => r.city === 'London');
    }

    if (lowerQuery.includes('active')) {
      results = results.filter(r => r.status === 'active');
    }

    // Determine columns from first result or schema
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
