import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import type { GraphData } from '../types/graph';

interface Node extends d3.SimulationNodeDatum {
    id: string;
    name: string;
    segment: string;
    archetype: string[];
    color: string;
    description: string;
    market_size: string;
    business_model: string;
    outbound: string[];
    inbound: string[];
    x?: number;
    y?: number;
}

interface Link extends d3.SimulationLinkDatum<Node> {
    source: string | Node;
    target: string | Node;
    type?: string;
}

interface GraphProps {
    onNodeClick: (node: Node | null) => void;
    selectedNodeId: string | null;
    filterArchetype: string | null;
    searchTerm: string;
    graphData: GraphData;
    isEditMode: boolean;
    isConnectMode?: boolean; // New prop
    onDeleteNode: (id: string) => void;
    onAddNode?: (node: Partial<Node>) => void;
    onAddLink?: (sourceId: string, targetId: string) => void;
    onDeleteLink?: (sourceId: string, targetId: string) => void;
}

const Graph: React.FC<GraphProps> = ({
    onNodeClick,
    selectedNodeId,
    filterArchetype,
    searchTerm,
    graphData,
    isEditMode,
    isConnectMode = false, // Default to false
    onDeleteNode,
    onAddNode: _onAddNode,
    onAddLink,
    onDeleteLink
}) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
    const [connectionStart, setConnectionStart] = useState<Node | null>(null);
    const [contextMenu, setContextMenu] = useState<{ x: number, y: number, node: Node } | null>(null);

    // Refs to maintain state across renders without triggering re-renders
    const simulationRef = useRef<d3.Simulation<Node, Link> | null>(null);
    const nodesRef = useRef<Node[]>([]);
    const linksRef = useRef<Link[]>([]);

    useEffect(() => {
        const handleResize = () => {
            setDimensions({ width: window.innerWidth, height: window.innerHeight });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Close context menu on outside click
    useEffect(() => {
        const handleClick = () => setContextMenu(null);
        if (contextMenu) {
            document.addEventListener('click', handleClick);
            return () => document.removeEventListener('click', handleClick);
        }
    }, [contextMenu]);

    // Initialize D3 Simulation and SVG structure
    useEffect(() => {
        if (!svgRef.current) return;

        const svg = d3.select(svgRef.current);

        // Clear only if it's the first render or we want a hard reset
        if (svg.select("g").empty()) {
            // Zoom behavior
            const g = svg.append("g").attr("class", "graph-container");

            const zoom = d3.zoom<SVGSVGElement, unknown>()
                .scaleExtent([0.1, 4])
                .on("zoom", (event) => {
                    g.attr("transform", event.transform);
                });
            svg.call(zoom);

            // Define arrow markers and filters
            const defs = svg.append("defs");

            // Glow filter
            const filter = defs.append("filter")
                .attr("id", "glow")
                .attr("x", "-50%")
                .attr("y", "-50%")
                .attr("width", "200%")
                .attr("height", "200%");
            filter.append("feGaussianBlur")
                .attr("stdDeviation", "2.5")
                .attr("result", "coloredBlur");
            const feMerge = filter.append("feMerge");
            feMerge.append("feMergeNode").attr("in", "coloredBlur");
            feMerge.append("feMergeNode").attr("in", "SourceGraphic");

            // Arrow marker
            defs.append("marker")
                .attr("id", "arrow")
                .attr("viewBox", "0 -5 10 10")
                .attr("refX", 28)
                .attr("refY", 0)
                .attr("markerWidth", 6)
                .attr("markerHeight", 6)
                .attr("orient", "auto")
                .append("path")
                .attr("d", "M0,-5L10,0L0,5")
                .attr("fill", "#555");

            // Link group
            g.append("g").attr("class", "links");
            // Node group
            g.append("g").attr("class", "nodes");
            // Label group
            g.append("g").attr("class", "labels");
        }

        // Initialize simulation if not exists
        if (!simulationRef.current) {
            simulationRef.current = d3.forceSimulation<Node, Link>()
                .force("link", d3.forceLink<Node, Link>().id(d => d.id).distance(100))
                .force("charge", d3.forceManyBody().strength(-300))
                .force("center", d3.forceCenter(dimensions.width / 2, dimensions.height / 2))
                .force("collide", d3.forceCollide().radius(30));
        } else {
            // Update center force on resize
            simulationRef.current.force("center", d3.forceCenter(dimensions.width / 2, dimensions.height / 2));
            simulationRef.current.alpha(0.3).restart();
        }

    }, [dimensions]);

    // Update Graph Data
    useEffect(() => {
        if (!svgRef.current || !simulationRef.current) return;

        const svg = d3.select(svgRef.current);
        const g = svg.select(".graph-container");
        const linkGroup = g.select(".links");
        const nodeGroup = g.select(".nodes");
        const labelGroup = g.select(".labels");

        // 1. Merge new data with existing simulation state
        // This preserves x,y,vx,vy for existing nodes
        const oldNodesMap = new Map(nodesRef.current.map(n => [n.id, n]));

        let newNodes = graphData.nodes.map(n => {
            const oldNode = oldNodesMap.get(n.id);
            if (oldNode) {
                // Keep physics state, update data properties
                return { ...oldNode, ...n };
            }
            // New node
            return { ...n } as Node;
        });

        // Filter by archetype
        if (filterArchetype) {
            const validIds = new Set(newNodes.filter(n => n.archetype.includes(filterArchetype)).map(n => n.id));
            newNodes = newNodes.filter(n => validIds.has(n.id));
            // Filter links later based on valid nodes
        }

        // Update refs
        nodesRef.current = newNodes;

        // Links need to be re-mapped to the *new* node objects (or IDs)
        // D3 forceLink will replace IDs with object references
        const nodeMap = new Map(newNodes.map(n => [n.id, n]));

        let newLinks = graphData.links
            .filter(l => {
                const sourceId = typeof l.source === 'object' ? (l.source as any).id : l.source;
                const targetId = typeof l.target === 'object' ? (l.target as any).id : l.target;
                return nodeMap.has(sourceId) && nodeMap.has(targetId);
            })
            .map(l => ({ ...l })) as Link[];

        linksRef.current = newLinks;

        // 2. Update Simulation
        simulationRef.current.nodes(newNodes);
        (simulationRef.current.force("link") as d3.ForceLink<Node, Link>).links(newLinks);
        simulationRef.current.alpha(0.3).restart();

        // 3. Update DOM (Enter/Update/Exit)

        // --- Links ---
        const link = linkGroup.selectAll<SVGLineElement, Link>("line")
            .data(newLinks, d => {
                const s = typeof d.source === 'object' ? (d.source as Node).id : d.source;
                const t = typeof d.target === 'object' ? (d.target as Node).id : d.target;
                return `${s}-${t}`;
            });

        link.exit().remove();

        const linkEnter = link.enter().append("line")
            .attr("stroke", "#555")
            .attr("stroke-opacity", 0.3)
            .attr("stroke-width", 1)
            .attr("marker-end", "url(#arrow)");

        const linkMerge = linkEnter.merge(link)
            .style("cursor", isEditMode ? "pointer" : "default");

        // --- Nodes ---
        const node = nodeGroup.selectAll<SVGCircleElement, Node>("circle")
            .data(newNodes, d => d.id);

        node.exit().transition().duration(300).attr("r", 0).remove();

        const nodeEnter = node.enter().append("circle")
            .attr("r", 0) // Animate in
            .attr("fill", "#000")
            .style("filter", "url(#glow)")
            .call(d3.drag<SVGCircleElement, Node>()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended) as any);

        nodeEnter.transition().duration(300).attr("r", 6);

        const nodeMerge = nodeEnter.merge(node)
            .attr("stroke", d => {
                if (connectionStart && d.id === connectionStart.id) return "#FFD700";
                return d.color;
            })
            .attr("stroke-width", d => connectionStart && d.id === connectionStart.id ? 4 : 2)
            .style("cursor", isEditMode ? "pointer" : "pointer");

        // --- Labels ---
        const label = labelGroup.selectAll<SVGTextElement, Node>("text")
            .data(newNodes, d => d.id);

        label.exit().remove();

        const labelEnter = label.enter().append("text")
            .attr("dy", 20)
            .attr("text-anchor", "middle")
            .attr("font-size", "8px")
            .attr("fill", "#aaa")
            .style("pointer-events", "none")
            .style("text-shadow", "0 1px 2px rgba(0,0,0,0.8)")
            .text(d => d.name);

        const labelMerge = labelEnter.merge(label);

        // 4. Event Listeners (Re-attach to handle closure updates)
        nodeMerge.on("click", (event, d) => {
            event.stopPropagation();

            // Check for Connect Mode OR Shift Key
            const isConnecting = isConnectMode || event.shiftKey;

            if (isEditMode && isConnecting && onAddLink) {
                if (!connectionStart) {
                    setConnectionStart(d);
                } else if (connectionStart.id !== d.id) {
                    onAddLink(connectionStart.id, d.id);
                    setConnectionStart(null);
                }
            } else {
                onNodeClick(d);
                setConnectionStart(null);
            }
        });

        if (isEditMode) {
            nodeMerge.on("contextmenu", (event, d) => {
                event.preventDefault();
                event.stopPropagation();
                setContextMenu({ x: event.pageX, y: event.pageY, node: d });
            });

            if (onDeleteLink) {
                linkMerge.on("contextmenu", (event, l) => {
                    event.preventDefault();
                    event.stopPropagation();
                    const sourceId = (l.source as Node).id;
                    const targetId = (l.target as Node).id;
                    if (confirm(`Delete connection from ${(l.source as Node).name} to ${(l.target as Node).name}?`)) {
                        onDeleteLink(sourceId, targetId);
                    }
                });
            }
        } else {
            // Remove listeners if not in edit mode
            nodeMerge.on("contextmenu", null);
            linkMerge.on("contextmenu", null);
        }

        svg.on("click", (event) => {
            if (event.target === svgRef.current || event.target.tagName === 'g') {
                onNodeClick(null);
                setConnectionStart(null);
            }
        });

        // 5. Highlighting Logic
        if (selectedNodeId) {
            nodeMerge.attr("opacity", 0.1);
            linkMerge.attr("opacity", 0.1);
            labelMerge.attr("opacity", 0.1);

            const connectedIds = new Set<string>();
            connectedIds.add(selectedNodeId);

            newLinks.forEach(l => {
                const s = (l.source as Node).id;
                const t = (l.target as Node).id;
                if (s === selectedNodeId) connectedIds.add(t);
                if (t === selectedNodeId) connectedIds.add(s);
            });

            nodeMerge.filter(d => connectedIds.has(d.id))
                .attr("opacity", 1)
                .attr("r", d => d.id === selectedNodeId ? 30 : 20);

            linkMerge.filter(l => {
                const s = (l.source as Node).id;
                const t = (l.target as Node).id;
                return s === selectedNodeId || t === selectedNodeId;
            })
                .attr("opacity", 1)
                .attr("stroke", "#555")
                .attr("stroke-width", 2);

            labelMerge.filter(d => connectedIds.has(d.id)).attr("opacity", 1);
        } else if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            const matchedNodes = newNodes.filter(n => n.name.toLowerCase().includes(lowerTerm));
            const matchedIds = new Set(matchedNodes.map(n => n.id));

            if (matchedIds.size > 0) {
                nodeMerge.attr("opacity", d => matchedIds.has(d.id) ? 1 : 0.1);
                labelMerge.attr("opacity", d => matchedIds.has(d.id) ? 1 : 0.1);
                linkMerge.attr("opacity", 0.05);
            } else {
                // Reset if no match
                nodeMerge.attr("opacity", 1);
                labelMerge.attr("opacity", 1);
                linkMerge.attr("opacity", 1);
            }
        } else {
            // Reset
            nodeMerge.attr("opacity", 1).attr("r", 6);
            linkMerge.attr("opacity", 1).attr("stroke-width", 1);
            labelMerge.attr("opacity", 1);
        }

        // 6. Tick Function
        simulationRef.current.on("tick", () => {
            linkMerge
                .attr("x1", d => (d.source as Node).x!)
                .attr("y1", d => (d.source as Node).y!)
                .attr("x2", d => (d.target as Node).x!)
                .attr("y2", d => (d.target as Node).y!);

            nodeMerge
                .attr("cx", d => d.x!)
                .attr("cy", d => d.y!);

            labelMerge
                .attr("x", d => d.x!)
                .attr("y", d => d.y!);
        });

        function dragstarted(event: any, d: Node) {
            if (!event.active) simulationRef.current?.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(event: any, d: Node) {
            d.fx = event.x;
            d.fy = event.y;
        }

        function dragended(event: any, d: Node) {
            if (!event.active) simulationRef.current?.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

    }, [graphData, filterArchetype, selectedNodeId, searchTerm, isEditMode, connectionStart, onAddLink, onDeleteLink, onNodeClick, onDeleteNode]);

    return (
        <>
            <svg
                ref={svgRef}
                width={dimensions.width}
                height={dimensions.height}
                style={{
                    width: '100%',
                    height: '100vh',
                    display: 'block',
                    cursor: isEditMode ? 'crosshair' : 'grab'
                }}
            />

            {/* Context Menu */}
            {contextMenu && (
                <div
                    style={{
                        position: 'fixed',
                        top: contextMenu.y,
                        left: contextMenu.x,
                        zIndex: 5000,
                        backgroundColor: 'rgba(20, 20, 20, 0.95)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '8px',
                        padding: '8px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                        minWidth: '150px'
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={() => {
                            onNodeClick(contextMenu.node);
                            setContextMenu(null);
                        }}
                        style={{
                            width: '100%',
                            padding: '8px 12px',
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer',
                            textAlign: 'left',
                            borderRadius: '4px',
                            fontSize: '13px'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                    >
                        ✏️ Edit Node
                    </button>
                    <button
                        onClick={() => {
                            if (confirm(`Delete "${contextMenu.node.name}"?`)) {
                                onDeleteNode(contextMenu.node.id);
                                setContextMenu(null);
                            }
                        }}
                        style={{
                            width: '100%',
                            padding: '8px 12px',
                            background: 'none',
                            border: 'none',
                            color: '#ff6b6b',
                            cursor: 'pointer',
                            textAlign: 'left',
                            borderRadius: '4px',
                            fontSize: '13px'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,107,107,0.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                    >
                        🗑️ Delete Node
                    </button>
                </div>
            )}

            {/* Edit Mode Instructions */}
            {isEditMode && connectionStart && (
                <div style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 1500,
                    pointerEvents: 'none'
                }}>
                    <div className="glass-panel" style={{
                        padding: '16px 24px',
                        borderRadius: '12px',
                        textAlign: 'center',
                        border: '2px solid #FFD700',
                        animation: 'pulse 2s infinite'
                    }}>
                        <div style={{ fontSize: '14px', color: 'white', fontWeight: 600 }}>
                            ⚡ Shift+Click another node to create connection
                        </div>
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>
                            from: {connectionStart.name}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Graph;
