import React, { useState, useRef, useEffect } from 'react';
import type { GraphData } from '../types/graph';
import { askGraphQuestion, getApiKeyFromStorage, saveApiKeyToStorage, initializeGemini } from '../utils/aiUtils';

interface AIChatProps {
    isOpen: boolean;
    onClose: () => void;
    graphData: GraphData;
}

interface Message {
    role: 'user' | 'ai';
    content: string;
    timestamp: Date;
}

const AIChat: React.FC<AIChatProps> = ({ isOpen, onClose, graphData }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [apiKey, setApiKey] = useState('');
    const [hasApiKey, setHasApiKey] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const storedKey = getApiKeyFromStorage();
        if (storedKey) {
            setApiKey(storedKey);
            setHasApiKey(true);
            initializeGemini(storedKey);
        }
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSaveApiKey = () => {
        if (apiKey.trim()) {
            saveApiKeyToStorage(apiKey);
            setHasApiKey(true);
            setMessages([{
                role: 'ai',
                content: `API key saved! I'm ready to answer questions about "${graphData.name}". Try asking me about specific nodes, connections, or insights about the graph!`,
                timestamp: new Date()
            }]);
        }
    };

    const handleSendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            role: 'user',
            content: input,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const aiResponse = await askGraphQuestion(input, graphData);
            const aiMessage: Message = {
                role: 'ai',
                content: aiResponse,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error: any) {
            const errorMessage: Message = {
                role: 'ai',
                content: `Error: ${error.message}`,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (hasApiKey) {
                handleSendMessage();
            } else {
                handleSaveApiKey();
            }
        }
    };

    const suggestedQuestions = [
        "What are the main hubs in this graph?",
        "Which nodes have the most connections?",
        "Explain the different archetypes",
        "What insights can you provide about this ecosystem?"
    ];

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 4000,
            width: '400px',
            maxWidth: 'calc(100vw - 40px)'
        }}>
            <div className="glass-panel animate-fade-in" style={{
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                border: '1px solid rgba(138, 43, 226, 0.3)'
            }}>
                {/* Header */}
                <div style={{
                    padding: '20px',
                    background: 'linear-gradient(135deg, rgba(138, 43, 226, 0.2), rgba(75, 0, 130, 0.2))',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '18px', color: 'white', fontWeight: 600 }}>
                            🤖 AI Graph Assistant
                        </h3>
                        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                            Powered by Gemini
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '24px',
                            cursor: 'pointer',
                            color: 'rgba(255,255,255,0.5)',
                            padding: '0',
                            lineHeight: 1
                        }}
                    >
                        ×
                    </button>
                </div>

                {/* API Key Setup */}
                {!hasApiKey ? (
                    <div style={{ padding: '24px' }}>
                        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', marginBottom: '16px', lineHeight: '1.6' }}>
                            To use the AI assistant, you need a Gemini API key. Get one free at{' '}
                            <a
                                href="https://makersuite.google.com/app/apikey"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: '#8B5CF6', textDecoration: 'underline' }}
                            >
                                Google AI Studio
                            </a>
                        </p>
                        <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Enter your Gemini API key..."
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                background: 'rgba(0,0,0,0.3)',
                                color: 'white',
                                fontSize: '14px',
                                marginBottom: '12px'
                            }}
                        />
                        <button
                            onClick={handleSaveApiKey}
                            disabled={!apiKey.trim()}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                border: 'none',
                                background: apiKey.trim() ? 'linear-gradient(90deg, #8B5CF6, #6D28D9)' : 'rgba(255,255,255,0.1)',
                                color: 'white',
                                fontSize: '14px',
                                fontWeight: 600,
                                cursor: apiKey.trim() ? 'pointer' : 'not-allowed'
                            }}
                        >
                            Save API Key
                        </button>
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', marginTop: '12px' }}>
                            🔒 Your API key is stored locally and never sent to our servers
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Messages */}
                        <div style={{
                            height: '400px',
                            overflowY: 'auto',
                            padding: '20px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px'
                        }}>
                            {messages.length === 0 && (
                                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
                                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginBottom: '20px' }}>
                                        Ask me anything about your graph!
                                    </p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {suggestedQuestions.map((q, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setInput(q)}
                                                style={{
                                                    padding: '8px 12px',
                                                    borderRadius: '8px',
                                                    border: '1px solid rgba(138, 43, 226, 0.3)',
                                                    background: 'rgba(138, 43, 226, 0.1)',
                                                    color: 'rgba(255,255,255,0.8)',
                                                    fontSize: '12px',
                                                    cursor: 'pointer',
                                                    textAlign: 'left'
                                                }}
                                            >
                                                {q}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {messages.map((msg, i) => (
                                <div
                                    key={i}
                                    style={{
                                        alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                        maxWidth: '80%'
                                    }}
                                >
                                    <div style={{
                                        padding: '12px 16px',
                                        borderRadius: '12px',
                                        background: msg.role === 'user'
                                            ? 'linear-gradient(135deg, #8B5CF6, #6D28D9)'
                                            : 'rgba(255,255,255,0.05)',
                                        border: msg.role === 'ai' ? '1px solid rgba(255,255,255,0.1)' : 'none'
                                    }}>
                                        <p style={{
                                            margin: 0,
                                            color: 'white',
                                            fontSize: '13px',
                                            lineHeight: '1.6',
                                            whiteSpace: 'pre-wrap'
                                        }}>
                                            {msg.content}
                                        </p>
                                        <span style={{
                                            fontSize: '10px',
                                            color: 'rgba(255,255,255,0.4)',
                                            marginTop: '4px',
                                            display: 'block'
                                        }}>
                                            {msg.timestamp.toLocaleTimeString()}
                                        </span>
                                    </div>
                                </div>
                            ))}

                            {isLoading && (
                                <div style={{ alignSelf: 'flex-start', maxWidth: '80%' }}>
                                    <div style={{
                                        padding: '12px 16px',
                                        borderRadius: '12px',
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(255,255,255,0.1)'
                                    }}>
                                        <p style={{ margin: 0, color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>
                                            🤔 Thinking...
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div style={{
                            padding: '16px',
                            borderTop: '1px solid rgba(255,255,255,0.1)',
                            background: 'rgba(0,0,0,0.2)'
                        }}>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Ask about the graph..."
                                    disabled={isLoading}
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        background: 'rgba(0,0,0,0.3)',
                                        color: 'white',
                                        fontSize: '14px'
                                    }}
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={!input.trim() || isLoading}
                                    style={{
                                        padding: '12px 20px',
                                        borderRadius: '8px',
                                        border: 'none',
                                        background: input.trim() && !isLoading
                                            ? 'linear-gradient(90deg, #8B5CF6, #6D28D9)'
                                            : 'rgba(255,255,255,0.1)',
                                        color: 'white',
                                        fontSize: '18px',
                                        cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed'
                                    }}
                                >
                                    ↑
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AIChat;
