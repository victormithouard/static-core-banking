/**
 * Shared Gemini API Client
 * Handles communication with the backend proxy for Gemini requests.
 */

async function callGemini(prompt) {
    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("API Error:", errorData);
            return "I encountered an error analyzing the data: " + (errorData.error || response.statusText);
        }

        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";
    } catch (error) {
        console.error("Client Error:", error);
        return "Analysis unavailable. (API Error)";
    }
}
