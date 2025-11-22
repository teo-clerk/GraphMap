import React from 'react';

interface NotificationProps {
    type: 'success' | 'error';
    message: string;
}

const Notification: React.FC<NotificationProps> = ({ type, message }) => {
    return (
        <div style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            zIndex: 4000,
            animation: 'slideInUp 0.3s ease-out'
        }}>
            <div className="glass-panel" style={{
                padding: '16px 24px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                minWidth: '300px',
                borderLeft: `4px solid ${type === 'success' ? '#00ff64' : '#ff6b6b'}`,
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
            }}>
                <span style={{ fontSize: '24px' }}>
                    {type === 'success' ? '✓' : '✗'}
                </span>
                <span style={{
                    flex: 1,
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: 500
                }}>
                    {message}
                </span>
            </div>
        </div>
    );
};

export default Notification;
