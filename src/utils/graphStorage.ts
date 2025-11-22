import type { GraphData, GraphMetadata } from '../types/graph';

const STORAGE_KEY = 'graph-creator-graphs';
const CURRENT_GRAPH_KEY = 'graph-creator-current';

export const graphStorage = {
    // Save a graph to localStorage
    saveGraph: (graph: GraphData): void => {
        try {
            const graphs = graphStorage.getAllGraphs();
            const existingIndex = graphs.findIndex(g => g.id === graph.id);

            if (existingIndex >= 0) {
                graphs[existingIndex] = graph;
            } else {
                graphs.push(graph);
            }

            localStorage.setItem(STORAGE_KEY, JSON.stringify(graphs));
        } catch (error) {
            console.error('Failed to save graph:', error);
            throw new Error('Failed to save graph to storage');
        }
    },

    // Get all graphs (metadata only)
    getAllGraphMetadata: (): GraphMetadata[] => {
        try {
            const graphs = graphStorage.getAllGraphs();
            return graphs.map(g => ({
                id: g.id,
                name: g.name,
                description: g.description,
                createdAt: g.createdAt,
                updatedAt: g.updatedAt,
                nodeCount: g.nodes.length,
                linkCount: g.links.length
            }));
        } catch (error) {
            console.error('Failed to get graphs:', error);
            return [];
        }
    },

    // Get all graphs (full data)
    getAllGraphs: (): GraphData[] => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Failed to parse graphs:', error);
            return [];
        }
    },

    // Get a specific graph by ID
    getGraph: (id: string): GraphData | null => {
        try {
            const graphs = graphStorage.getAllGraphs();
            return graphs.find(g => g.id === id) || null;
        } catch (error) {
            console.error('Failed to get graph:', error);
            return null;
        }
    },

    // Delete a graph
    deleteGraph: (id: string): void => {
        try {
            const graphs = graphStorage.getAllGraphs();
            const filtered = graphs.filter(g => g.id !== id);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));

            // Clear current if it's the deleted one
            const current = graphStorage.getCurrentGraphId();
            if (current === id) {
                localStorage.removeItem(CURRENT_GRAPH_KEY);
            }
        } catch (error) {
            console.error('Failed to delete graph:', error);
            throw new Error('Failed to delete graph');
        }
    },

    // Set current graph ID
    setCurrentGraphId: (id: string): void => {
        localStorage.setItem(CURRENT_GRAPH_KEY, id);
    },

    // Get current graph ID
    getCurrentGraphId: (): string | null => {
        return localStorage.getItem(CURRENT_GRAPH_KEY);
    },

    // Clear all graphs (dangerous!)
    clearAll: (): void => {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(CURRENT_GRAPH_KEY);
    },

    // Generate a unique ID
    generateId: (): string => {
        return `graph_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
};
