import { useState, useEffect, useCallback } from 'react';
import type { GraphData, Node, Link, Archetype } from '../types/graph';
import { graphStorage } from '../utils/graphStorage';
import { shareUtils } from '../utils/shareUtils';
import defaultData from '../data.json';

export const useGraphEditor = () => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentGraph, setCurrentGraph] = useState<GraphData | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    // Initialize - Load from URL or localStorage or create new
    useEffect(() => {
        // Try to load from URL first
        const urlGraph = shareUtils.getGraphFromUrl();
        if (urlGraph) {
            setCurrentGraph(urlGraph);
            showNotification('success', 'Graph loaded from share link');
            return;
        }

        // Try to load current graph from localStorage
        const currentId = graphStorage.getCurrentGraphId();
        if (currentId) {
            const saved = graphStorage.getGraph(currentId);
            if (saved) {
                setCurrentGraph(saved);
                return;
            }
        }

        // Load default data (travel ecosystem) as a new graph
        loadTravelEcosystemTemplate();
    }, []);

    const loadTravelEcosystemTemplate = useCallback(() => {
        const travelGraph: GraphData = {
            id: graphStorage.generateId(),
            name: 'Travel & Tourism Ecosystem',
            description: 'Interactive map of the global travel and tourism industry',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            archetypes: [
                { id: 'arch1', name: 'Infrastructure Integrators', color: '#1F8C7D', description: 'Builds and manages the core physical and digital rails of travel.' },
                { id: 'arch2', name: 'Vertical Specialists', color: '#E85D75', description: 'Focuses on deep expertise in specific travel niches.' },
                { id: 'arch3', name: 'Experience Designers', color: '#F5A623', description: 'Creates unique, end-to-end travel moments and journeys.' },
                { id: 'arch4', name: 'Facilitators & Enablers', color: '#4A90E2', description: 'Provides the financial, technical, and logistical tools to make travel happen.' },
                { id: 'arch5', name: 'Community Builders', color: '#BD10E0', description: 'Connects travelers, fosters engagement, and drives demand through social proof.' },
                { id: 'arch6', name: 'Regulators & Standards Setters', color: '#7ED321', description: 'Sets the rules, safety standards, and policies for the industry.' },
                { id: 'arch7', name: 'Market Aggregators', color: '#B8E986', description: 'Brings supply and demand together at scale.' }
            ],
            nodes: (defaultData.nodes as any[]).map((n: any) => ({ ...n })),
            links: (defaultData.links as any[]).map((l: any) => ({ ...l }))
        };
        setCurrentGraph(travelGraph);
    }, []);

    const showNotification = useCallback((type: 'success' | 'error', message: string) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 3000);
    }, []);

    // Save current graph
    const saveGraph = useCallback(async () => {
        if (!currentGraph) return;

        setIsSaving(true);
        try {
            const updated = {
                ...currentGraph,
                updatedAt: new Date().toISOString()
            };
            graphStorage.saveGraph(updated);
            graphStorage.setCurrentGraphId(updated.id);
            setCurrentGraph(updated);
            showNotification('success', 'Graph saved successfully');
        } catch (error) {
            showNotification('error', 'Failed to save graph');
        } finally {
            setIsSaving(false);
        }
    }, [currentGraph, showNotification]);

    // Create new graph
    const createNewGraph = useCallback((name: string = 'Untitled Graph') => {
        const newGraph: GraphData = {
            id: graphStorage.generateId(),
            name: name,
            description: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            archetypes: [],
            nodes: [],
            links: []
        };

        // Save immediately to storage so it persists
        graphStorage.saveGraph(newGraph);
        graphStorage.setCurrentGraphId(newGraph.id);

        setCurrentGraph(newGraph);
        setIsEditMode(true);
        showNotification('success', `New graph "${name}" created`);
    }, [showNotification]);

    // Load a graph by ID
    const loadGraph = useCallback((id: string) => {
        const graph = graphStorage.getGraph(id);
        if (graph) {
            setCurrentGraph(graph);
            graphStorage.setCurrentGraphId(id);
            showNotification('success', 'Graph loaded');
        } else {
            showNotification('error', 'Graph not found');
        }
    }, [showNotification]);

    // Update graph metadata
    const updateGraphMetadata = useCallback((updates: Partial<Pick<GraphData, 'name' | 'description'>>) => {
        if (!currentGraph) return;
        setCurrentGraph({ ...currentGraph, ...updates });
    }, [currentGraph]);

    // Node operations
    const addNode = useCallback((node: Omit<Node, 'id' | 'inbound' | 'outbound'>) => {
        if (!currentGraph) return;

        const newNode: Node = {
            ...node,
            id: `P${String(currentGraph.nodes.length + 1).padStart(3, '0')}`,
            outbound: [],
            inbound: []
        };

        setCurrentGraph({
            ...currentGraph,
            nodes: [...currentGraph.nodes, newNode]
        });
        showNotification('success', `Node "${newNode.name}" added`);
    }, [currentGraph, showNotification]);

    const updateNode = useCallback((id: string, updates: Partial<Node>) => {
        if (!currentGraph) return;

        setCurrentGraph({
            ...currentGraph,
            nodes: currentGraph.nodes.map(n => n.id === id ? { ...n, ...updates } : n)
        });
        showNotification('success', 'Node updated');
    }, [currentGraph, showNotification]);

    const deleteNode = useCallback((id: string) => {
        if (!currentGraph) return;

        setCurrentGraph({
            ...currentGraph,
            nodes: currentGraph.nodes.filter(n => n.id !== id),
            links: currentGraph.links.filter(l =>
                (typeof l.source === 'string' ? l.source : l.source.id) !== id &&
                (typeof l.target === 'string' ? l.target : l.target.id) !== id
            )
        });
        showNotification('success', 'Node deleted');
    }, [currentGraph, showNotification]);

    // Link operations
    const addLink = useCallback((sourceId: string, targetId: string) => {
        if (!currentGraph) return;

        // Check if link already exists
        const exists = currentGraph.links.some(l =>
            (typeof l.source === 'string' ? l.source : l.source.id) === sourceId &&
            (typeof l.target === 'string' ? l.target : l.target.id) === targetId
        );

        if (exists) {
            showNotification('error', 'Connection already exists');
            return;
        }

        const newLink: Link = {
            source: sourceId,
            target: targetId,
            type: 'outbound'
        };

        setCurrentGraph({
            ...currentGraph,
            links: [...currentGraph.links, newLink],
            nodes: currentGraph.nodes.map(n => {
                if (n.id === sourceId) return { ...n, outbound: [...n.outbound, targetId] };
                if (n.id === targetId) return { ...n, inbound: [...n.inbound, sourceId] };
                return n;
            })
        });
        showNotification('success', 'Connection created');
    }, [currentGraph, showNotification]);

    const deleteLink = useCallback((sourceId: string, targetId: string) => {
        if (!currentGraph) return;

        setCurrentGraph({
            ...currentGraph,
            links: currentGraph.links.filter(l =>
                !((typeof l.source === 'string' ? l.source : l.source.id) === sourceId &&
                    (typeof l.target === 'string' ? l.target : l.target.id) === targetId)
            ),
            nodes: currentGraph.nodes.map(n => {
                if (n.id === sourceId) return { ...n, outbound: n.outbound.filter(id => id !== targetId) };
                if (n.id === targetId) return { ...n, inbound: n.inbound.filter(id => id !== sourceId) };
                return n;
            })
        });
        showNotification('success', 'Connection deleted');
    }, [currentGraph, showNotification]);

    // Archetype operations
    const addArchetype = useCallback((archetype: Omit<Archetype, 'id'>) => {
        if (!currentGraph) return;

        const newArchetype: Archetype = {
            ...archetype,
            id: `arch${currentGraph.archetypes.length + 1}`
        };

        setCurrentGraph({
            ...currentGraph,
            archetypes: [...currentGraph.archetypes, newArchetype]
        });
        showNotification('success', `Archetype "${newArchetype.name}" added`);
    }, [currentGraph, showNotification]);

    const updateArchetype = useCallback((id: string, updates: Partial<Archetype>) => {
        if (!currentGraph) return;

        setCurrentGraph({
            ...currentGraph,
            archetypes: currentGraph.archetypes.map(a => a.id === id ? { ...a, ...updates } : a)
        });
        showNotification('success', 'Archetype updated');
    }, [currentGraph, showNotification]);

    const deleteArchetype = useCallback((id: string) => {
        if (!currentGraph) return;

        // Remove archetype from all nodes
        setCurrentGraph({
            ...currentGraph,
            archetypes: currentGraph.archetypes.filter(a => a.id !== id),
            nodes: currentGraph.nodes.map(n => ({
                ...n,
                archetype: n.archetype.filter(a => a !== id)
            }))
        });
        showNotification('success', 'Archetype deleted');
    }, [currentGraph, showNotification]);

    return {
        // State
        isEditMode,
        currentGraph,
        isSaving,
        notification,

        // Mode control
        setIsEditMode,

        // Graph operations
        saveGraph,
        createNewGraph,
        loadGraph,
        loadTravelEcosystemTemplate,
        updateGraphMetadata,

        // Node operations
        addNode,
        updateNode,
        deleteNode,

        // Link operations
        addLink,
        deleteLink,

        // Archetype operations
        addArchetype,
        updateArchetype,
        deleteArchetype,

        // Utility
        showNotification
    };
};
