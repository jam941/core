'use client';

import React, { useState } from 'react';

const ResumeButton: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsLoading(true);
      window.open('/assets/resume.pdf', '_blank');
    } catch (error) {
      console.error('Error downloading resume:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isLoading}
      style={{
        display: 'inline-block',
        padding: '10px 20px',
        backgroundColor: '#3B82F6',
        color: 'white',
        borderRadius: '8px',
        border: 'none',
        fontWeight: 600,
        cursor: isLoading ? 'default' : 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        opacity: isLoading ? 0.7 : 1
      }}
    >
      {isLoading ? 'Generating...' : 'Download Resume'}
    </button>
  );
};

export default ResumeButton;
