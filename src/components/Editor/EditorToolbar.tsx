import React from 'react';

interface EditorToolbarProps {
    isEditMode: boolean;
    isConnectMode: boolean;
    onToggleMode: () => void;
    onToggleConnectMode: () => void;
    onAddNode: () => void;
    onImport: () => void;
    onExport: () => void;
    onShare: () => void;
    onTutorial: () => void;
    onSave: () => void;
    onNewGraph: () => void;
    onLoadGraph: () => void; // New prop
    onManageArchetypes: () => void;
    isSaving: boolean;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({
    isEditMode,
    isConnectMode,
    onToggleMode,
    onToggleConnectMode,
    onAddNode,
    onImport,
    onExport,
    onShare,
    onTutorial,
    onSave,
    onNewGraph,
    onLoadGraph,
    onManageArchetypes,
    isSaving
}) => {
    return (
        <div style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2000,
            display: 'flex',
            gap: '12px',
            alignItems: 'center'
        }}>
            {/* Mode Toggle */}
            <div className="glass-panel" style={{
                padding: '8px 16px',
                borderRadius: '12px',
                display: 'flex',
                gap: '8px',
                alignItems: 'center'
            }}>
                <button
                    onClick={onToggleMode}
                    style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        border: 'none',
                        background: isEditMode ? 'linear-gradient(90deg, #F5A623, #E85D75)' : 'rgba(255,255,255,0.1)',
                        color: 'white',
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontSize: '13px',
                        transition: 'all 0.2s'
                    }}
                >
                    {isEditMode ? '✏️ Edit Mode' : '👁️ View Mode'}
                </button>
            </div>

            {/* Actions */}
            {isEditMode && (
                <div className="glass-panel" style={{
                    padding: '8px',
                    borderRadius: '12px',
                    display: 'flex',
                    gap: '4px'
                }}>
                    <ToolbarButton onClick={onAddNode} tooltip="Add Node">
                        ➕
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={onToggleConnectMode}
                        tooltip={isConnectMode ? "Exit Connect Mode" : "Connect Nodes (Shift+Click)"}
                        active={isConnectMode}
                    >
                        🔗
                    </ToolbarButton>
                    <ToolbarButton onClick={onManageArchetypes} tooltip="Manage Archetypes">
                        🎨
                    </ToolbarButton>
                    <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)', margin: '4px 8px' }} />
                    <ToolbarButton onClick={onSave} tooltip="Save to Browser" disabled={isSaving}>
                        {isSaving ? '⏳' : '💾'}
                    </ToolbarButton>
                    <ToolbarButton onClick={onLoadGraph} tooltip="Load Saved Graph">
                        📂
                    </ToolbarButton>
                    <ToolbarButton onClick={onNewGraph} tooltip="New Graph (Saves Current)">
                        🆕
                    </ToolbarButton>
                    <ToolbarButton onClick={onImport} tooltip="Import JSON (Coming Soon)">
                        📥
                    </ToolbarButton>
                    <ToolbarButton onClick={onExport} tooltip="Save as JSON File">
                        📤
                    </ToolbarButton>
                </div>
            )}

            {/* Utilities */}
            <div className="glass-panel" style={{
                padding: '8px',
                borderRadius: '12px',
                display: 'flex',
                gap: '4px'
            }}>
                <ToolbarButton onClick={onShare} tooltip="Share Graph">
                    🔗
                </ToolbarButton>
                <ToolbarButton onClick={onTutorial} tooltip="Tutorial">
                    ❓
                </ToolbarButton>
            </div>
        </div>
    );
};

const ToolbarButton: React.FC<{
    onClick: () => void;
    tooltip: string;
    children: React.ReactNode;
    disabled?: boolean;
    active?: boolean;
}> = ({ onClick, tooltip, children, disabled, active }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            title={tooltip}
            style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: active ? '1px solid #F5A623' : 'none',
                background: active ? 'rgba(245, 166, 35, 0.2)' : (disabled ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)'),
                color: disabled ? 'rgba(255,255,255,0.3)' : (active ? '#F5A623' : 'white'),
                cursor: disabled ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => !disabled && !active && (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
            onMouseLeave={(e) => !disabled && !active && (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
        >
            {children}
        </button>
    );
};

export default EditorToolbar;
