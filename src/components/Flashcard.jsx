import React, { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';

const flipAnimation = keyframes`
  0% {
    transform: rotateY(0deg);
  }
  50% {
    transform: rotateY(-90deg) scale(0.95);
  }
  100% {
    transform: rotateY(-180deg);
  }
`;

const CardContainer = styled.div`
  width: clamp(320px, 90vw, 700px);
  height: clamp(300px, 50vh, 450px);
  position: relative;
  cursor: pointer;
  perspective: 1000px;
  user-select: none;
  
  &:hover {
    transform: scale(1.02);
  }
  
  transition: transform var(--transition-normal);
`;

const CardInner = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform: ${(props) => (props.$isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)')};
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  
  ${(props) => props.$isFlipped && css`
    box-shadow: var(--shadow-xl), var(--shadow-glow);
  `}
`;

const CardFace = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: var(--space-8);
  background: linear-gradient(135deg, var(--card-background-color) 0%, var(--card-background-hover) 100%);
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-color);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(66, 85, 255, 0.1) 0%, transparent 50%);
    border-radius: var(--radius-xl);
    opacity: 0;
    transition: opacity var(--transition-normal);
  }
  
  &:hover::before {
    opacity: 1;
  }
`;

const CardFront = styled(CardFace)`
  background: linear-gradient(135deg, #1f1f3d 0%, #2a2a5a 100%);
`;

const CardBack = styled(CardFace)`
  transform: rotateY(180deg);
  background: linear-gradient(135deg, #2a2a5a 0%, #1f1f3d 100%);
`;

const CardContent = styled.div`
  font-size: clamp(1.25rem, 4vw, 2rem);
  font-weight: 600;
  line-height: 1.4;
  color: var(--text-color);
  position: relative;
  z-index: 1;
  max-width: 100%;
  word-wrap: break-word;
  hyphens: auto;
`;

const CardLabel = styled.div`
  position: absolute;
  top: var(--space-4);
  left: var(--space-4);
  background: rgba(66, 85, 255, 0.2);
  color: var(--primary-color);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  z-index: 2;
`;

const FlipHint = styled.div`
  position: absolute;
  bottom: var(--space-4);
  right: var(--space-4);
  color: var(--text-color-muted);
  font-size: var(--font-size-sm);
  opacity: 0.7;
  display: flex;
  align-items: center;
  gap: var(--space-2);
  z-index: 2;
  
  &::before {
    content: '↻';
    font-size: var(--font-size-lg);
  }
`;

const Flashcard = ({ term, definition, showLabels = true, showHint = true }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <CardContainer onClick={handleFlip} className="hover-lift">
      <CardInner $isFlipped={isFlipped}>
        <CardFront>
          {showLabels && <CardLabel>Term</CardLabel>}
          <CardContent>{term}</CardContent>
          {showHint && <FlipHint>Click to flip</FlipHint>}
        </CardFront>
        <CardBack>
          {showLabels && <CardLabel>Definition</CardLabel>}
          <CardContent>{definition}</CardContent>
          {showHint && <FlipHint>Click to flip</FlipHint>}
        </CardBack>
      </CardInner>
    </CardContainer>
  );
};

export default Flashcard;
