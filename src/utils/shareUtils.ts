import type { GraphData } from '../types/graph';
import pako from 'pako';

export const shareUtils = {
    // Compress and encode graph data to URL-safe string
    encodeGraphToUrl: (graph: GraphData): string => {
        try {
            const json = JSON.stringify(graph);
            const compressed = pako.deflate(json);
            const base64 = btoa(String.fromCharCode.apply(null, Array.from(compressed)));
            const urlSafe = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
            return urlSafe;
        } catch (error) {
            console.error('Failed to encode graph:', error);
            throw new Error('Failed to encode graph for sharing');
        }
    },

    // Decode graph data from URL-safe string
    decodeGraphFromUrl: (encoded: string): GraphData | null => {
        try {
            // Restore base64 padding
            const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
            const padding = (4 - (base64.length % 4)) % 4;
            const padded = base64 + '='.repeat(padding);

            // Decode base64
            const binaryString = atob(padded);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }

            // Decompress
            const decompressed = pako.inflate(bytes, { to: 'string' });
            const graph: GraphData = JSON.parse(decompressed);

            return graph;
        } catch (error) {
            console.error('Failed to decode graph:', error);
            return null;
        }
    },

    // Generate shareable URL
    generateShareUrl: (graph: GraphData): string => {
        const encoded = shareUtils.encodeGraphToUrl(graph);
        const baseUrl = window.location.origin + window.location.pathname;
        return `${baseUrl}#graph=${encoded}`;
    },

    // Get graph from current URL hash
    getGraphFromUrl: (): GraphData | null => {
        try {
            const hash = window.location.hash;
            if (!hash.startsWith('#graph=')) {
                return null;
            }

            const encoded = hash.substring(7); // Remove '#graph='
            return shareUtils.decodeGraphFromUrl(encoded);
        } catch (error) {
            console.error('Failed to get graph from URL:', error);
            return null;
        }
    },

    // Copy text to clipboard
    copyToClipboard: async (text: string): Promise<boolean> => {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (error) {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            const success = document.execCommand('copy');
            document.body.removeChild(textarea);
            return success;
        }
    }
};
