import { GoogleGenerativeAI } from '@google/generative-ai';
import type { GraphData } from '../types/graph';

// Initialize the Gemini API
let genAI: GoogleGenerativeAI | null = null;

export const initializeGemini = (apiKey: string) => {
    genAI = new GoogleGenerativeAI(apiKey);
};

export const askGraphQuestion = async (
    question: string,
    graphData: GraphData
): Promise<string> => {
    if (!genAI) {
        throw new Error('Gemini API not initialized. Please provide an API key.');
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Prepare graph context for the AI
    const graphContext = `
You are an AI assistant helping users understand their graph visualizations.

Current Graph Information:
- Graph Name: ${graphData.name}
- Description: ${graphData.description}
- Total Nodes: ${graphData.nodes.length}
- Total Connections: ${graphData.links.length}
- Archetypes: ${graphData.archetypes.map(a => `${a.name} (${a.description})`).join(', ')}

Nodes in the graph:
${graphData.nodes.slice(0, 50).map(node => `
- ${node.name} (${node.segment})
  Archetypes: ${node.archetype.join(', ')}
  Description: ${node.description}
  Market Size: ${node.market_size}
  Connections: ${node.outbound.length} outbound, ${node.inbound.length} inbound
`).join('\n')}

${graphData.nodes.length > 50 ? `... and ${graphData.nodes.length - 50} more nodes` : ''}

Connection patterns:
${graphData.links.slice(0, 20).map((link: any) => {
        const source = graphData.nodes.find(n => n.id === (typeof link.source === 'string' ? link.source : link.source.id));
        const target = graphData.nodes.find(n => n.id === (typeof link.target === 'string' ? link.target : link.target.id));
        return `- ${source?.name || 'Unknown'} → ${target?.name || 'Unknown'}`;
    }).join('\n')}

Provide helpful, insightful answers about this graph. Be concise but informative. When asked about specific nodes or connections, reference the actual data above.
`;

    const prompt = `${graphContext}\n\nUser Question: ${question}\n\nAnswer:`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Gemini API error:', error);
        throw new Error('Failed to get AI response. Please check your API key and try again.');
    }
};

export const getApiKeyFromStorage = (): string | null => {
    return localStorage.getItem('gemini_api_key');
};

export const saveApiKeyToStorage = (apiKey: string): void => {
    localStorage.setItem('gemini_api_key', apiKey);
    initializeGemini(apiKey);
};

export const clearApiKey = (): void => {
    localStorage.removeItem('gemini_api_key');
    genAI = null;
};
