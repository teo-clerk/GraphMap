import { useState } from 'react';
import Graph from './components/Graph';
import InfoPanel from './components/InfoPanel';
import Controls from './components/Controls';
import HelpModal from './components/HelpModal';
import EditorToolbar from './components/Editor/EditorToolbar';
import NodeForm from './components/Editor/NodeForm';
import ArchetypeManager from './components/Editor/ArchetypeManager';
import ShareModal from './components/Editor/ShareModal';
import SavedGraphsModal from './components/Editor/SavedGraphsModal';
import NewGraphModal from './components/Editor/NewGraphModal';
import Tutorial from './components/Tutorial';
import Notification from './components/Notification';
import AIChat from './components/AIChat';
import JSONFormatHelp from './components/JSONFormatHelp';
import { useGraphEditor } from './hooks/useGraphEditor';
import './App.css';

function App() {
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [filterArchetype, setFilterArchetype] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isNodeFormOpen, setIsNodeFormOpen] = useState(false);
  const [isArchManagerOpen, setIsArchManagerOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSavedGraphsOpen, setIsSavedGraphsOpen] = useState(false);
  const [isNewGraphModalOpen, setIsNewGraphModalOpen] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isJSONHelpOpen, setIsJSONHelpOpen] = useState(false);
  const [isConnectMode, setIsConnectMode] = useState(false);

  const {
    isEditMode,
    currentGraph,
    isSaving,
    notification,
    setIsEditMode,
    saveGraph,
    createNewGraph,
    loadGraph,
    addNode,
    updateNode: _updateNode,
    deleteNode,
    addLink,
    deleteLink,
    addArchetype,
    updateArchetype,
    deleteArchetype,
    loadTravelEcosystemTemplate: _loadTravelEcosystemTemplate,
    updateGraphMetadata: _updateGraphMetadata
  } = useGraphEditor();

  const handleNodeClick = (node: any) => {
    setSelectedNode(node);
  };

  const handleNewGraphClick = () => {
    setIsNewGraphModalOpen(true);
  };

  const handleCreateNewGraph = async (name: string) => {
    if (currentGraph && (currentGraph.nodes.length > 0 || currentGraph.links.length > 0)) {
      // Auto-save before creating new
      await saveGraph();
    }
    createNewGraph(name);
  };

  const handleSaveAndExport = () => {
    if (!currentGraph) return;

    // Save to localStorage first
    saveGraph();

    // Then export JSON file
    const dataStr = JSON.stringify(currentGraph, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentGraph.name.replace(/\s+/g, '_').toLowerCase()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    // Show JSON format help
    setIsJSONHelpOpen(true);
  };

  if (!currentGraph) {
    return (
      <div className="App" style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        color: 'white',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div className="App">
      <EditorToolbar
        isEditMode={isEditMode}
        isConnectMode={isConnectMode}
        onToggleMode={() => setIsEditMode(!isEditMode)}
        onToggleConnectMode={() => setIsConnectMode(!isConnectMode)}
        onAddNode={() => setIsNodeFormOpen(true)}
        onImport={handleImport}
        onExport={handleSaveAndExport}
        onShare={() => setIsShareModalOpen(true)}
        onTutorial={() => setIsTutorialOpen(true)}
        onSave={saveGraph}
        onNewGraph={handleNewGraphClick}
        onLoadGraph={() => setIsSavedGraphsOpen(true)}
        onManageArchetypes={() => setIsArchManagerOpen(true)}
        isSaving={isSaving}
      />

      <Controls
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterArchetype={filterArchetype}
        onFilterChange={setFilterArchetype}
        onOpenHelp={() => setIsHelpOpen(true)}
      />

      <Graph
        key={currentGraph.id}
        onNodeClick={handleNodeClick}
        selectedNodeId={selectedNode ? selectedNode.id : null}
        filterArchetype={filterArchetype}
        searchTerm={searchTerm}
        graphData={currentGraph}
        isEditMode={isEditMode}
        isConnectMode={isConnectMode}
        onDeleteNode={deleteNode}
        onAddLink={addLink}
        onDeleteLink={deleteLink}
      />

      <InfoPanel
        node={selectedNode}
        allNodes={currentGraph.nodes}
        onClose={() => setSelectedNode(null)}
      />

      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      <NodeForm
        isOpen={isNodeFormOpen}
        onClose={() => setIsNodeFormOpen(false)}
        onSubmit={(node) => {
          addNode(node);
          setIsNodeFormOpen(false);
        }}
        archetypes={currentGraph.archetypes}
      />

      <ArchetypeManager
        isOpen={isArchManagerOpen}
        onClose={() => setIsArchManagerOpen(false)}
        archetypes={currentGraph.archetypes}
        onAddArchetype={addArchetype}
        onUpdateArchetype={updateArchetype}
        onDeleteArchetype={deleteArchetype}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        graph={currentGraph}
      />

      <SavedGraphsModal
        isOpen={isSavedGraphsOpen}
        onClose={() => setIsSavedGraphsOpen(false)}
        onLoadGraph={loadGraph}
        currentGraphId={currentGraph.id}
      />

      <NewGraphModal
        isOpen={isNewGraphModalOpen}
        onClose={() => setIsNewGraphModalOpen(false)}
        onCreate={handleCreateNewGraph}
      />

      <Tutorial
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
      />

      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
        />
      )}

      <AIChat
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
        graphData={currentGraph}
      />

      <JSONFormatHelp
        isOpen={isJSONHelpOpen}
        onClose={() => setIsJSONHelpOpen(false)}
      />

      {/* AI Assistant Floating Button */}
      {!isAIChatOpen && (
        <button
          onClick={() => setIsAIChatOpen(true)}
          style={{
            position: 'fixed',
            bottom: '80px',
            right: '20px',
            zIndex: 3000,
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            border: 'none',
            background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)',
            color: 'white',
            fontSize: '24px',
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(139, 92, 246, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 12px 32px rgba(139, 92, 246, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(139, 92, 246, 0.4)';
          }}
          title="AI Graph Assistant"
        >
          🤖
        </button>
      )}

      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        color: 'rgba(255,255,255,0.3)',
        fontSize: '12px',
        fontFamily: 'monospace'
      }}>
        {currentGraph.name} • {currentGraph.nodes.length} nodes • {currentGraph.links.length} links
      </div>
    </div>
  );
}

export default App;
