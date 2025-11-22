import React, { useState } from 'react';

interface TutorialProps {
    isOpen: boolean;
    onClose: () => void;
}

const TUTORIAL_STEPS = [
    {
        title: 'Welcome to Graph Creator! 🎉',
        content: 'Create, edit, and share interactive network graphs. Map relationships between companies, people, concepts - anything you want to visualize!',
        emoji: '🌐'
    },
    {
        title: 'View vs Edit Mode ⚡',
        content: 'Toggle between **View Mode** (explore & interact) and **Edit Mode** (create & modify). Find the mode toggle button at the top of the screen.',
        emoji: '🔄'
    },
    {
        title: 'Creating Nodes ➕',
        content: 'In Edit Mode:\n1. Click the ➕ button in the toolbar\n2. Fill in node details (name, description, etc.)\n3. Select archetypes (categories)\n4. Click "Create Node"',
        emoji: '➕'
    },
    {
        title: 'Connecting Nodes 🔗',
        content: '**How to connect:** Hold **Shift** → Click first node (gold border) → Keep holding Shift → Click second node. A connection arrow will appear!',
        emoji: '🔗'
    },
    {
        title: 'Editing & Deleting ✏️',
        content: '**Right-click any node** for options:\n• ✏️ Edit Node - Modify details\n• 🗑️ Delete Node - Remove it\n\n**Right-click a connection line** to delete it.',
        emoji: '✏️'
    },
    {
        title: 'Custom Archetypes 🎨',
        content: 'Click the 🎨 button to create custom categories with:\n• Custom names\n• Color picker\n• Descriptions\n\nNodes can have multiple archetypes!',
        emoji: '🎨'
    },
    {
        title: 'Saving Your Work 💾',
        content: '**💾 Save to Browser** - Quick save to localStorage\n**📤 Save as JSON** - Download backup file\n**🔗 Share** - Generate link with QR code\n\nGraphs auto-save as you work!',
        emoji: '💾'
    },
    {
        title: 'JSON Import/Export 📋',
        content: '**Export Format:**\nClick 📤 to download. File includes:\n```\n{\n  "name": "Graph Name",\n  "nodes": [...],\n  "links": [...],\n  "archetypes": [...]\n}\n```\nSee graph-template.json for full example.',
        emoji: '📋'
    },
    {
        title: 'AI Assistant 🤖',
        content: 'Click the 🤖 button (bottom right) to:\n• Get a free Gemini API key\n• Ask questions about your graph\n• Get insights and analysis\n\nExample: "Which nodes have the most connections?"',
        emoji: '🤖'
    },
    {
        title: 'You\'re Ready! ✨',
        content: 'Tips:\n• **Search & Filter** - Use the search bar\n• **Zoom** - Mouse wheel\n• **Pan** - Click & drag background\n• **Drag Nodes** - Click & drag any node\n\nHappy graphing! 🚀',
        emoji: '✨'
    }
];

const Tutorial: React.FC<TutorialProps> = ({ isOpen, onClose }) => {
    const [currentStep, setCurrentStep] = useState(0);

    if (!isOpen) return null;

    const step = TUTORIAL_STEPS[currentStep];
    const isFirst = currentStep === 0;
    const isLast = currentStep === TUTORIAL_STEPS.length - 1;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(5px)',
            zIndex: 3000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px'
        }} onClick={onClose}>
            <div
                className="glass-panel animate-fade-in"
                style={{
                    width: '500px',
                    maxWidth: '100%',
                    padding: '40px',
                    borderRadius: '24px',
                    position: 'relative'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Progress dots */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '32px' }}>
                    {TUTORIAL_STEPS.map((_, i) => (
                        <div
                            key={i}
                            style={{
                                width: i === currentStep ? '32px' : '8px',
                                height: '8px',
                                borderRadius: '4px',
                                background: i === currentStep ? 'linear-gradient(90deg, #4A90E2, #BD10E0)' : 'rgba(255,255,255,0.2)',
                                transition: 'all 0.3s'
                            }}
                        />
                    ))}
                </div>

                {/* Content */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div style={{ fontSize: '64px', marginBottom: '16px' }}>{step.emoji}</div>
                    <h2 style={{ margin: '0 0 16px 0', fontSize: '24px', color: '#fff' }}>
                        {step.title}
                    </h2>
                    <p style={{
                        fontSize: '15px',
                        color: 'rgba(255,255,255,0.8)',
                        lineHeight: '1.6',
                        margin: 0
                    }}>
                        {step.content}
                    </p>
                </div>

                {/* Navigation */}
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                    <button
                        onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                        disabled={isFirst}
                        style={{
                            padding: '12px 24px',
                            borderRadius: '8px',
                            border: 'none',
                            background: isFirst ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)',
                            color: isFirst ? 'rgba(255,255,255,0.3)' : 'white',
                            cursor: isFirst ? 'not-allowed' : 'pointer',
                            fontSize: '14px'
                        }}
                    >
                        ← Back
                    </button>

                    <div style={{ flex: 1, textAlign: 'center', paddingTop: '12px', color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>
                        {currentStep + 1} / {TUTORIAL_STEPS.length}
                    </div>

                    {isLast ? (
                        <button
                            onClick={onClose}
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
                            Get Started! →
                        </button>
                    ) : (
                        <button
                            onClick={() => setCurrentStep(Math.min(TUTORIAL_STEPS.length - 1, currentStep + 1))}
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
                            Next →
                        </button>
                    )}
                </div>

                {/* Skip button */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
                        background: 'none',
                        border: 'none',
                        color: 'rgba(255,255,255,0.4)',
                        cursor: 'pointer',
                        fontSize: '12px',
                        textDecoration: 'underline'
                    }}
                >
                    Skip Tutorial
                </button>
            </div>
        </div>
    );
};

export default Tutorial;
