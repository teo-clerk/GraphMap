import React, { useState } from 'react';
import type { Archetype } from '../../types/graph';

interface ArchetypeManagerProps {
    isOpen: boolean;
    onClose: () => void;
    archetypes: Archetype[];
    onAddArchetype: (archetype: Omit<Archetype, 'id'>) => void;
    onUpdateArchetype: (id: string, updates: Partial<Archetype>) => void;
    onDeleteArchetype: (id: string) => void;
}

const ArchetypeManager: React.FC<ArchetypeManagerProps> = ({
    isOpen,
    onClose,
    archetypes,
    onAddArchetype,
    onUpdateArchetype,
    onDeleteArchetype
}) => {
    const [isAdding, setIsAdding] = useState(false);
    const [newArchetype, setNewArchetype] = useState({
        name: '',
        color: '#' + Math.floor(Math.random() * 16777215).toString(16),
        description: ''
    });

    if (!isOpen) return null;

    const handleAdd = () => {
        if (!newArchetype.name.trim()) {
            alert('Archetype name is required');
            return;
        }
        onAddArchetype(newArchetype);
        setNewArchetype({ name: '', color: '#' + Math.floor(Math.random() * 16777215).toString(16), description: '' });
        setIsAdding(false);
    };

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
                    width: '600px',
                    maxWidth: '100%',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    padding: '32px',
                    borderRadius: '24px'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <h2 style={{ margin: '0 0 24px 0', fontSize: '24px', color: '#fff' }}>
                    Manage Archetypes
                </h2>

                <div style={{ marginBottom: '24px' }}>
                    {archetypes.map(arch => (
                        <div key={arch.id} style={{
                            padding: '16px',
                            borderRadius: '12px',
                            background: 'rgba(255,255,255,0.05)',
                            marginBottom: '12px',
                            border: `2px solid ${arch.color}33`
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                        <input
                                            type="color"
                                            value={arch.color}
                                            onChange={(e) => onUpdateArchetype(arch.id, { color: e.target.value })}
                                            style={{ width: '40px', height: '40px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
                                        />
                                        <input
                                            type="text"
                                            value={arch.name}
                                            onChange={(e) => onUpdateArchetype(arch.id, { name: e.target.value })}
                                            style={{
                                                flex: 1,
                                                padding: '8px 12px',
                                                borderRadius: '8px',
                                                border: 'none',
                                                background: 'rgba(0,0,0,0.3)',
                                                color: 'white',
                                                fontSize: '14px',
                                                fontWeight: 600
                                            }}
                                        />
                                    </div>
                                    <textarea
                                        value={arch.description}
                                        onChange={(e) => onUpdateArchetype(arch.id, { description: e.target.value })}
                                        placeholder="Description..."
                                        rows={2}
                                        style={{
                                            width: '100%',
                                            padding: '8px 12px',
                                            borderRadius: '8px',
                                            border: 'none',
                                            background: 'rgba(0,0,0,0.2)',
                                            color: 'rgba(255,255,255,0.8)',
                                            fontSize: '12px',
                                            resize: 'none'
                                        }}
                                    />
                                </div>
                                <button
                                    onClick={() => {
                                        if (confirm('Delete this archetype? Nodes using it will be updated.')) {
                                            onDeleteArchetype(arch.id);
                                        }
                                    }}
                                    style={{
                                        marginLeft: '12px',
                                        padding: '8px',
                                        borderRadius: '8px',
                                        border: 'none',
                                        background: 'rgba(255,0,0,0.2)',
                                        color: '#ff6b6b',
                                        cursor: 'pointer',
                                        fontSize: '18px'
                                    }}
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {isAdding ? (
                    <div style={{
                        padding: '16px',
                        borderRadius: '12px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '2px solid rgba(255,255,255,0.1)',
                        marginBottom: '16px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                            <input
                                type="color"
                                value={newArchetype.color}
                                onChange={(e) => setNewArchetype({ ...newArchetype, color: e.target.value })}
                                style={{ width: '40px', height: '40px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
                            />
                            <input
                                type="text"
                                value={newArchetype.name}
                                onChange={(e) => setNewArchetype({ ...newArchetype, name: e.target.value })}
                                placeholder="Archetype name..."
                                style={{
                                    flex: 1,
                                    padding: '8px 12px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: 'rgba(0,0,0,0.3)',
                                    color: 'white',
                                    fontSize: '14px'
                                }}
                            />
                        </div>
                        <textarea
                            value={newArchetype.description}
                            onChange={(e) => setNewArchetype({ ...newArchetype, description: e.target.value })}
                            placeholder="Description..."
                            rows={2}
                            style={{
                                width: '100%',
                                padding: '8px 12px',
                                borderRadius: '8px',
                                border: 'none',
                                background: 'rgba(0,0,0,0.2)',
                                color: 'white',
                                fontSize: '12px',
                                marginBottom: '12px',
                                resize: 'none'
                            }}
                        />
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                                onClick={handleAdd}
                                style={{
                                    flex: 1,
                                    padding: '8px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: 'linear-gradient(90deg, #4A90E2, #BD10E0)',
                                    color: 'white',
                                    cursor: 'pointer',
                                    fontSize: '13px',
                                    fontWeight: 600
                                }}
                            >
                                Add Archetype
                            </button>
                            <button
                                onClick={() => setIsAdding(false)}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: 'rgba(255,255,255,0.1)',
                                    color: 'white',
                                    cursor: 'pointer',
                                    fontSize: '13px'
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => setIsAdding(true)}
                        style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '2px dashed rgba(255,255,255,0.2)',
                            background: 'rgba(255,255,255,0.05)',
                            color: 'rgba(255,255,255,0.6)',
                            cursor: 'pointer',
                            fontSize: '14px',
                            marginBottom: '16px'
                        }}
                    >
                        ➕ Add New Archetype
                    </button>
                )}

                <button
                    onClick={onClose}
                    style={{
                        width: '100%',
                        padding: '12px',
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
    );
};

export default ArchetypeManager;
