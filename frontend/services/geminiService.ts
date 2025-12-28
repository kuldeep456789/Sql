import { api } from './api';

export const getSqlHint = async (context: any, query: string) => {
    try {
        const response = await api.post('/hint', {
            context,
            query
        });
        return response.hint;
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "Hint unavailable.";
    }
};
