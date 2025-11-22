// Core graph data types

export interface Archetype {
    id: string;
    name: string;
    color: string;
    description: string;
}

export interface Node {
    id: string;
    name: string;
    segment: string;
    archetype: string[]; // Array of archetype IDs
    color: string;
    description: string;
    market_size: string;
    business_model: string;
    outbound: string[];
    inbound: string[];
    x?: number;
    y?: number;
}

export interface Link {
    source: string | Node;
    target: string | Node;
    type?: string;
}

export interface GraphData {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    archetypes: Archetype[];
    nodes: Node[];
    links: Link[];
}

export interface GraphMetadata {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    nodeCount: number;
    linkCount: number;
}
