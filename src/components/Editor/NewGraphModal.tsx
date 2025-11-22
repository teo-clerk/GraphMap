import React, { useState, useEffect, useRef } from 'react';

interface NewGraphModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (name: string) => void;
}

const NewGraphModal: React.FC<NewGraphModalProps> = ({
    isOpen,
    onClose,
    onCreate
}) => {
    const [name, setName] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setName('');
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onCreate(name.trim());
            onClose();
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
                    width: '400px',
                    padding: '24px',
                    borderRadius: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px'
                }}
                onClick={e => e.stopPropagation()}
            >
                <h2 style={{ margin: 0, color: 'white', fontSize: '24px' }}>🆕 New Graph</h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <label style={{ display: 'block', color: '#aaa', marginBottom: '8px', fontSize: '14px' }}>
                            Graph Name
                        </label>
                        <input
                            ref={inputRef}
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., My Awesome Network"
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                background: 'rgba(0,0,0,0.2)',
                                color: 'white',
                                fontSize: '16px',
                                outline: 'none'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                padding: '8px 16px',
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
                            disabled={!name.trim()}
                            style={{
                                padding: '8px 24px',
                                borderRadius: '8px',
                                border: 'none',
                                background: name.trim() ? 'linear-gradient(90deg, #F5A623, #E85D75)' : 'rgba(255,255,255,0.1)',
                                color: name.trim() ? 'white' : 'rgba(255,255,255,0.3)',
                                cursor: name.trim() ? 'pointer' : 'not-allowed',
                                fontWeight: 600,
                                fontSize: '14px'
                            }}
                        >
                            Create Graph
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewGraphModal;
