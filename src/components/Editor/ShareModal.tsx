import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import type { GraphData } from '../../types/graph';
import { shareUtils } from '../../utils/shareUtils';

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    graph: GraphData | null;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, graph }) => {
    const [shareUrl, setShareUrl] = useState('');
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [copied, setCopied] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        if (isOpen && graph) {
            generateShareLink();
        }
    }, [isOpen, graph]);

    const generateShareLink = async () => {
        if (!graph) return;

        setIsGenerating(true);
        try {
            const url = shareUtils.generateShareUrl(graph);
            setShareUrl(url);

            // Generate QR code
            const qr = await QRCode.toDataURL(url, {
                width: 300,
                margin: 2,
                color: {
                    dark: '#000',
                    light: '#fff'
                }
            });
            setQrCodeUrl(qr);
        } catch (error) {
            console.error('Failed to generate share link:', error);
            alert('Failed to generate share link. Graph might be too large.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCopy = async () => {
        const success = await shareUtils.copyToClipboard(shareUrl);
        if (success) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (!isOpen) return null;

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
                    padding: '32px',
                    borderRadius: '24px'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <h2 style={{ margin: '0 0 24px 0', fontSize: '24px', color: '#fff' }}>
                    Share Graph
                </h2>

                {isGenerating ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.6)' }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
                        <div>Generating share link...</div>
                    </div>
                ) : (
                    <>
                        {qrCodeUrl && (
                            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                                <img src={qrCodeUrl} alt="QR Code" style={{
                                    maxWidth: '200px',
                                    borderRadius: '12px',
                                    border: '4px solid rgba(255,255,255,0.1)'
                                }} />
                                <div style={{ marginTop: '12px', color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>
                                    Scan to view graph
                                </div>
                            </div>
                        )}

                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>
                                Share Link
                            </label>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input
                                    type="text"
                                    value={shareUrl}
                                    readOnly
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        background: 'rgba(0,0,0,0.3)',
                                        color: 'white',
                                        fontSize: '12px',
                                        fontFamily: 'monospace'
                                    }}
                                    onClick={(e) => (e.target as HTMLInputElement).select()}
                                />
                                <button
                                    onClick={handleCopy}
                                    style={{
                                        padding: '12px 20px',
                                        borderRadius: '8px',
                                        border: 'none',
                                        background: copied ? 'rgba(0,255,100,0.2)' : 'linear-gradient(90deg, #4A90E2, #BD10E0)',
                                        color: 'white',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: 600,
                                        minWidth: '100px'
                                    }}
                                >
                                    {copied ? '✓ Copied!' : '📋 Copy'}
                                </button>
                            </div>
                        </div>

                        <div style={{
                            padding: '16px',
                            borderRadius: '12px',
                            background: 'rgba(74, 144, 226, 0.1)',
                            border: '1px solid rgba(74, 144, 226, 0.2)',
                            marginBottom: '24px'
                        }}>
                            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6' }}>
                                <strong style={{ color: '#4A90E2' }}>💡 Tip:</strong> This link contains your entire graph data.
                                Anyone with this link can view (and edit if they have the tool) your graph. The data is stored in the URL itself - no server needed!
                            </div>
                        </div>

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
                    </>
                )}
            </div>
        </div>
    );
};

export default ShareModal;
