import React from 'react';
import styled, { keyframes } from 'styled-components';

const progressAnimation = keyframes`
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
`;

const Container = styled.div`
  width: 100%;
  margin: var(--space-6) 0;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 12px;
  background: var(--background-secondary);
  border-radius: var(--radius-full);
  overflow: hidden;
  position: relative;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ProgressFill = styled.div`
  height: 100%;
  background: var(--primary-gradient);
  border-radius: var(--radius-full);
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  width: ${props => props.$progress}%;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    animation: shimmer 2s infinite;
  }
`;

const ProgressText = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--space-2);
  font-size: var(--font-size-sm);
  color: var(--text-color-secondary);
`;

const ProgressLabel = styled.span`
  font-weight: 500;
  color: var(--text-color);
`;

const ProgressStats = styled.div`
  display: flex;
  gap: var(--space-4);
  font-size: var(--font-size-sm);
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-1);
  color: var(--text-color-secondary);
  
  &.correct {
    color: var(--success-color);
  }
  
  &.incorrect {
    color: var(--error-color);
  }
`;

const ProgressBar = ({ 
  progress, 
  current, 
  total, 
  correct = 0, 
  incorrect = 0, 
  label = "Progress",
  showStats = false 
}) => {
  return (
    <Container>
      <ProgressBarContainer>
        <ProgressFill $progress={progress} />
      </ProgressBarContainer>
      <ProgressText>
        <ProgressLabel>{label}</ProgressLabel>
        <div>{current} / {total}</div>
      </ProgressText>
      {showStats && (correct > 0 || incorrect > 0) && (
        <ProgressStats>
          <StatItem className="correct">
            ✓ {correct}
          </StatItem>
          <StatItem className="incorrect">
            ✗ {incorrect}
          </StatItem>
        </ProgressStats>
      )}
    </Container>
  );
};

export default ProgressBar;
