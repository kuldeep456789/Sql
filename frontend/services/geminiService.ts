import { Assignment } from "../types";
import { api } from './api';


export const getSqlHint = async (assignment: Assignment, currentQuery: string): Promise<string> => {
  try {
    const response = await api.post('/hint', {
      assignmentContext: {
        title: assignment.title,
        description: assignment.description,
        requirements: assignment.requirements,
        schemas: assignment.schemas
      },
      currentQuery
    });

    return response.hint || "Hint not available.";
  } catch (error) {
    console.error("Hint Error:", error);
    return "The tutor is currently offline. Please try again later.";
  }
};

