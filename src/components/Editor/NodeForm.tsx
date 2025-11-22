import React, { useState } from 'react';
import type { Node, Archetype } from '../../types/graph';

interface NodeFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (node: Omit<Node, 'id' | 'inbound' | 'outbound'>) => void;
    archetypes: Archetype[];
    editNode?: Node | null;
}

const NodeForm: React.FC<NodeFormProps> = ({ isOpen, onClose, onSubmit, archetypes, editNode }) => {
    const [formData, setFormData] = useState({
        name: editNode?.name || '',
        segment: editNode?.segment || '',
        description: editNode?.description || '',
        market_size: editNode?.market_size || '',
        business_model: editNode?.business_model || '',
        archetype: editNode?.archetype || [],
        color: editNode?.color || '#4A90E2'
    });

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            alert('Node name is required');
            return;
        }

        onSubmit({
            ...formData,
            x: editNode?.x,
            y: editNode?.y
        });

        onClose();
    };

    const toggleArchetype = (archId: string) => {
        setFormData(prev => ({
            ...prev,
            archetype: prev.archetype.includes(archId)
                ? prev.archetype.filter(a => a !== archId)
                : [...prev.archetype, archId]
        }));
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
                    width: '500px',
                    maxWidth: '100%',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    padding: '32px',
                    borderRadius: '24px',
                    position: 'relative'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <h2 style={{ margin: '0 0 24px 0', fontSize: '24px', color: '#fff' }}>
                    {editNode ? 'Edit Node' : 'Create New Node'}
                </h2>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>
                            Name *
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g., Airbnb, Uber, etc."
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                background: 'rgba(0,0,0,0.3)',
                                color: 'white',
                                fontSize: '14px'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>
                            Segment
                        </label>
                        <input
                            type="text"
                            value={formData.segment}
                            onChange={(e) => setFormData({ ...formData, segment: e.target.value })}
                            placeholder="e.g., Accommodation, Transport, etc."
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                background: 'rgba(0,0,0,0.3)',
                                color: 'white',
                                fontSize: '14px'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Brief description of this node..."
                            rows={3}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                background: 'rgba(0,0,0,0.3)',
                                color: 'white',
                                fontSize: '14px',
                                resize: 'vertical'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>
                            Market Size / Revenue
                        </label>
                        <input
                            type="text"
                            value={formData.market_size}
                            onChange={(e) => setFormData({ ...formData, market_size: e.target.value })}
                            placeholder="e.g., $5B, €2.3B, etc."
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                background: 'rgba(0,0,0,0.3)',
                                color: 'white',
                                fontSize: '14px'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>
                            Business Model
                        </label>
                        <textarea
                            value={formData.business_model}
                            onChange={(e) => setFormData({ ...formData, business_model: e.target.value })}
                            placeholder="How does this entity make money?"
                            rows={2}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                background: 'rgba(0,0,0,0.3)',
                                color: 'white',
                                fontSize: '14px',
                                resize: 'vertical'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', marginBottom: '12px', color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>
                            Archetypes
                        </label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {archetypes.map(arch => (
                                <button
                                    key={arch.id}
                                    type="button"
                                    onClick={() => toggleArchetype(arch.id)}
                                    style={{
                                        padding: '8px 14px',
                                        borderRadius: '20px',
                                        border: `2px solid ${arch.color}`,
                                        background: formData.archetype.includes(arch.id) ? arch.color + '44' : 'rgba(0,0,0,0.3)',
                                        color: formData.archetype.includes(arch.id) ? '#fff' : 'rgba(255,255,255,0.6)',
                                        fontSize: '12px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        fontWeight: formData.archetype.includes(arch.id) ? 600 : 400
                                    }}
                                >
                                    {arch.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                        <button
                            type="button"
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
                            Cancel
                        </button>
                        <button
                            type="submit"
                            style={{
                                padding: '12px 24px',
                                borderRadius: '8px',
                                border: 'none',
                                background: 'linear-gradient(90deg, #4A90E2, #BD10E0)',
                                color: 'white',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: 600
                            }}
                        >
                            {editNode ? 'Update Node' : 'Create Node'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NodeForm;
