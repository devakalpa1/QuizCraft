import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeInOut = keyframes`
  0% { opacity: 0; transform: translateY(20px); }
  10%, 90% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-20px); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const IndicatorContainer = styled.div`
  position: fixed;
  bottom: var(--space-4);
  right: var(--space-4);
  z-index: 1000;
  padding: var(--space-2) var(--space-4);
  background: var(--success-color);
  color: white;
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: var(--space-2);
  box-shadow: var(--shadow-lg);
  animation: ${fadeInOut} 2s ease-in-out;
  
  &.saving {
    background: var(--primary-color);
    animation: ${pulse} 1s ease-in-out infinite;
  }
`;

const SaveIcon = styled.span`
  font-size: var(--font-size-base);
`;

const SaveIndicator = ({ message = "Progress saved!", show = false, saving = false }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!visible && !saving) return null;

  return (
    <IndicatorContainer className={saving ? 'saving' : ''}>
      <SaveIcon>{saving ? '⏳' : '✅'}</SaveIcon>
      {saving ? 'Saving...' : message}
    </IndicatorContainer>
  );
};

export default SaveIndicator;
