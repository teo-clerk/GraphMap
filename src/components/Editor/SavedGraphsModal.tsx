import React, { useEffect, useState } from 'react';
import { graphStorage } from '../../utils/graphStorage';
import type { GraphMetadata } from '../../types/graph';

interface SavedGraphsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoadGraph: (id: string) => void;
    currentGraphId: string;
}

const SavedGraphsModal: React.FC<SavedGraphsModalProps> = ({
    isOpen,
    onClose,
    onLoadGraph,
    currentGraphId
}) => {
    const [graphs, setGraphs] = useState<GraphMetadata[]>([]);

    useEffect(() => {
        if (isOpen) {
            loadGraphs();
        }
    }, [isOpen]);

    const loadGraphs = () => {
        const allGraphs = graphStorage.getAllGraphMetadata();
        // Sort by updated at desc
        allGraphs.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        setGraphs(allGraphs);
    };

    const handleDelete = (e: React.MouseEvent, id: string, name: string) => {
        e.stopPropagation();
        // Remove confirm dialog as it might be blocked or causing issues
        try {
            graphStorage.deleteGraph(id);
            loadGraphs();
        } catch (error) {
            console.error('Failed to delete graph', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(5px)',
            zIndex: 3000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }} onClick={onClose}>
            <div
                className="glass-panel"
                style={{
                    width: '600px',
                    maxHeight: '80vh',
                    padding: '24px',
                    borderRadius: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    overflow: 'hidden'
                }}
                onClick={e => e.stopPropagation()}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ margin: 0, color: 'white', fontSize: '24px' }}>📂 Saved Graphs</h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'rgba(255,255,255,0.5)',
                            fontSize: '24px',
                            cursor: 'pointer'
                        }}
                    >
                        ×
                    </button>
                </div>

                <div style={{
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    paddingRight: '8px'
                }}>
                    {graphs.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '40px',
                            color: 'rgba(255,255,255,0.5)',
                            fontStyle: 'italic'
                        }}>
                            No saved graphs found. Create a new one to get started!
                        </div>
                    ) : (
                        graphs.map(graph => (
                            <div
                                key={graph.id}
                                onClick={() => {
                                    onLoadGraph(graph.id);
                                    onClose();
                                }}
                                style={{
                                    padding: '16px',
                                    borderRadius: '12px',
                                    background: graph.id === currentGraphId ? 'rgba(245, 166, 35, 0.1)' : 'rgba(255,255,255,0.05)',
                                    border: graph.id === currentGraphId ? '1px solid rgba(245, 166, 35, 0.3)' : '1px solid rgba(255,255,255,0.1)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.background = graph.id === currentGraphId ? 'rgba(245, 166, 35, 0.1)' : 'rgba(255,255,255,0.05)';
                                }}
                            >
                                <div>
                                    <div style={{
                                        color: graph.id === currentGraphId ? '#F5A623' : 'white',
                                        fontWeight: 600,
                                        fontSize: '16px',
                                        marginBottom: '4px'
                                    }}>
                                        {graph.name}
                                        {graph.id === currentGraphId && <span style={{
                                            fontSize: '12px',
                                            marginLeft: '8px',
                                            background: '#F5A623',
                                            color: 'black',
                                            padding: '2px 6px',
                                            borderRadius: '4px'
                                        }}>Current</span>}
                                    </div>
                                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>
                                        {new Date(graph.updatedAt).toLocaleDateString()} • {graph.nodeCount} nodes • {graph.linkCount} links
                                    </div>
                                </div>

                                <button
                                    onClick={(e) => handleDelete(e, graph.id, graph.name)}
                                    style={{
                                        background: 'rgba(255, 107, 107, 0.1)',
                                        border: '1px solid rgba(255, 107, 107, 0.2)',
                                        color: '#FF6B6B',
                                        padding: '8px',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.background = 'rgba(255, 107, 107, 0.2)';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.background = 'rgba(255, 107, 107, 0.1)';
                                    }}
                                    title="Delete Graph"
                                >
                                    🗑️
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default SavedGraphsModal;
