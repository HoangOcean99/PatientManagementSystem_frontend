import React from 'react';

const LoadingSpinner = ({ size = "18px", color = "currentColor", className = "" }) => {
    return (
        <div className={className} style={{ display: 'inline-flex', alignItems: 'center' }}>
            <style>
                {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
            </style>
            <div
                style={{
                    width: size,
                    height: size,
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderTopColor: color,
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                    display: 'inline-block'
                }}
            ></div>
        </div>
    );
};

export default LoadingSpinner;