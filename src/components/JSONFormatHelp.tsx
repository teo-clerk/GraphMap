import React from 'react';

interface JSONFormatHelpProps {
    isOpen: boolean;
    onClose: () => void;
}

const JSONFormatHelp: React.FC<JSONFormatHelpProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const exampleJSON = `{
  "id": "graph_123",
  "name": "My Graph",
  "description": "Graph description",
  "createdAt": "2024-01-15T10:00:00.000Z",
  "updatedAt": "2024-01-15T10:00:00.000Z",
  
  "archetypes": [
    {
      "id": "arch1",
      "name": "Category Name",
      "color": "#4A90E2",
      "description": "Category description"
    }
  ],
  
  "nodes": [
    {
      "id": "P001",
      "name": "Node Name",
      "segment": "Technology",
      "archetype": ["arch1"],
      "color": "#4A90E2",
      "description": "Node description",
      "market_size": "$10M",
      "business_model": "SaaS",
      "outbound": ["P002"],
      "inbound": []
    }
  ],
  
  "links": [
    {
      "source": "P001",
      "target": "P002",
      "type": "outbound"
    }
  ]
}`;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(5px)',
            zIndex: 3000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px'
        }} onClick={onClose}>
            <div
                className="glass-panel"
                style={{
                    width: '700px',
                    maxWidth: '100%',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    padding: '32px',
                    borderRadius: '24px'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <h2 style={{ margin: '0 0 16px 0', fontSize: '24px', color: '#fff' }}>
                    📋 JSON Import Format
                </h2>

                <div style={{
                    padding: '16px',
                    borderRadius: '12px',
                    background: 'rgba(74, 144, 226, 0.1)',
                    border: '1px solid rgba(74, 144, 226, 0.2)',
                    marginBottom: '20px'
                }}>
                    <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.6' }}>
                        <strong style={{ color: '#4A90E2' }}>💡 How to get a JSON file:</strong><br />
                        1. Export any graph using the 📤 button<br />
                        2. Use the template: <code style={{ background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '4px' }}>graph-template.json</code><br />
                        3. Modify it with your own data
                    </div>
                </div>

                <h3 style={{ margin: '20px 0 12px 0', fontSize: '18px', color: '#fff' }}>
                    Required Structure:
                </h3>

                <pre style={{
                    background: 'rgba(0,0,0,0.4)',
                    padding: '16px',
                    borderRadius: '8px',
                    overflowX: 'auto',
                    fontSize: '12px',
                    lineHeight: '1.5',
                    color: '#00ff88',
                    border: '1px solid rgba(255,255,255,0.1)'
                }}>
                    {exampleJSON}
                </pre>

                <h3 style={{ margin: '24px 0 12px 0', fontSize: '18px', color: '#fff' }}>
                    Field Descriptions:
                </h3>

                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.8' }}>
                    <p><strong style={{ color: '#4A90E2' }}>Graph Level:</strong></p>
                    <ul style={{ marginLeft: '20px' }}>
                        <li><code>id</code> - Unique identifier (auto-generated)</li>
                        <li><code>name</code> - Display name of your graph</li>
                        <li><code>description</code> - What the graph represents</li>
                        <li><code>createdAt/updatedAt</code> - ISO 8601 timestamps</li>
                    </ul>

                    <p><strong style={{ color: '#4A90E2' }}>Node Object:</strong></p>
                    <ul style={{ marginLeft: '20px' }}>
                        <li><code>id</code> - Unique ID (e.g., "P001", "P002")</li>
                        <li><code>name</code> - Display name (Required)</li>
                        <li><code>archetype</code> - Array of archetype IDs</li>
                        <li><code>outbound</code> - Array of target node IDs</li>
                        <li><code>inbound</code> - Array of source node IDs</li>
                    </ul>

                    <p><strong style={{ color: '#4A90E2' }}>Link Object:</strong></p>
                    <ul style={{ marginLeft: '20px' }}>
                        <li><code>source</code> - ID of source node</li>
                        <li><code>target</code> - ID of target node</li>
                    </ul>
                </div>

                <div style={{
                    padding: '16px',
                    borderRadius: '12px',
                    background: 'rgba(189, 16, 224, 0.1)',
                    border: '1px solid rgba(189, 16, 224, 0.2)',
                    marginTop: '20px',
                    marginBottom: '20px'
                }}>
                    <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.6' }}>
                        <strong style={{ color: '#BD10E0' }}>⚠️ Important:</strong><br />
                        • All node IDs must be unique<br />
                        • Archetype IDs referenced in nodes must exist in archetypes array<br />
                        • Source/target in links must match existing node IDs<br />
                        • Colors must be valid hex codes (#RRGGBB)
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        onClick={() => {
                            const link = document.createElement('a');
                            link.href = '/graph-template.json';
                            link.download = 'graph-template.json';
                            link.click();
                        }}
                        style={{
                            flex: 1,
                            padding: '12px',
                            borderRadius: '8px',
                            border: 'none',
                            background: 'linear-gradient(90deg, #4A90E2, #BD10E0)',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: 600
                        }}
                    >
                        📥 Download Template
                    </button>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '12px 24px',
                            borderRadius: '8px',
                            border: 'none',
                            background: 'rgba(255,255,255,0.1)',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JSONFormatHelp;
