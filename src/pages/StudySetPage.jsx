import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import Button from '../components/Button';
import { StudySetContext } from '../context/StudySetContext';
import Flashcard from '../components/Flashcard';
import ProgressBar from '../components/ProgressBar';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const StudySetPageContainer = styled.div`
  min-height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-8) var(--space-4);
  animation: ${fadeIn} 0.6s ease-out;
  position: relative;
  
  @media (max-width: 768px) {
    padding: var(--space-4) var(--space-2);
  }
`;

const StudyHeader = styled.div`
  text-align: center;
  margin-bottom: var(--space-8);
  max-width: 800px;
  width: 100%;
`;

const StudyTitle = styled.h1`
  font-size: var(--font-size-3xl);
  font-weight: 700;
  margin-bottom: var(--space-4);
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: var(--font-size-2xl);
  }
`;

const CardWrapper = styled.div`
  perspective: 1000px;
  margin-bottom: var(--space-6);
  display: flex;
  justify-content: center;
  width: 100%;
`;

const Controls = styled.div`
  display: flex;
  gap: var(--space-4);
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: var(--space-6);
  
  @media (max-width: 640px) {
    gap: var(--space-2);
  }
`;

const NavigationControls = styled.div`
  display: flex;
  gap: var(--space-2);
  align-items: center;
`;

const KnowledgeControls = styled.div`
  display: flex;
  gap: var(--space-3);
  align-items: center;
  
  @media (max-width: 640px) {
    width: 100%;
    justify-content: center;
  }
`;

const CardCounter = styled.div`
  background: var(--card-background-color);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
  font-weight: 600;
  color: var(--text-color);
  font-size: var(--font-size-lg);
  min-width: 120px;
  text-align: center;
`;

const ActionSection = styled.div`
  margin-top: var(--space-8);
  display: flex;
  gap: var(--space-4);
  flex-wrap: wrap;
  justify-content: center;
  
  @media (max-width: 640px) {
    flex-direction: column;
    align-items: center;
  }
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: var(--space-4);
  margin: var(--space-6) 0;
  max-width: 600px;
  width: 100%;
`;

const StatCard = styled.div`
  background: var(--card-background-color);
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
  text-align: center;
  
  &.known {
    border-color: var(--success-color);
    background: linear-gradient(135deg, var(--card-background-color) 0%, rgba(34, 197, 94, 0.1) 100%);
  }
  
  &.unknown {
    border-color: var(--error-color);
    background: linear-gradient(135deg, var(--card-background-color) 0%, rgba(239, 68, 68, 0.1) 100%);
  }
`;

const StatNumber = styled.div`
  font-size: var(--font-size-2xl);
  font-weight: 700;
  margin-bottom: var(--space-1);
  
  &.known {
    color: var(--success-color);
  }
  
  &.unknown {
    color: var(--error-color);
  }
  
  &.remaining {
    color: var(--text-color);
  }
`;

const StatLabel = styled.div`
  font-size: var(--font-size-sm);
  color: var(--text-color-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: var(--space-4);
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid var(--border-color);
  border-top: 3px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const StudySetPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    getStudySetById, 
    setActiveSet, 
    activeSet, 
    getStudyProgress, 
    updateStudyProgress,
    clearStudyProgress
  } = useContext(StudySetContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState({});

  useEffect(() => {
    const set = getStudySetById(id);
    if (!set) {
      navigate('/');
      return;
    }
    setActiveSet(set);
    
    // Load saved progress for this study set
    const savedProgress = getStudyProgress(parseInt(id));
    setProgress(savedProgress);
  }, [id, getStudySetById, setActiveSet, navigate, getStudyProgress]);

  const goToNextCard = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % activeSet.cards.length);
  };

  const goToPrevCard = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? activeSet.cards.length - 1 : prevIndex - 1
    );
  };

  const markAsKnown = () => {
    const newProgress = { ...progress, [currentIndex]: 'known' };
    setProgress(newProgress);
    updateStudyProgress(parseInt(id), currentIndex, 'known');
    goToNextCard();
  };

  const markAsUnknown = () => {
    const newProgress = { ...progress, [currentIndex]: 'unknown' };
    setProgress(newProgress);
    updateStudyProgress(parseInt(id), currentIndex, 'unknown');
    goToNextCard();
  };

  const resetProgress = () => {
    if (window.confirm('Are you sure you want to reset your progress for this study set?')) {
      setProgress({});
      clearStudyProgress(parseInt(id));
    }
  };

  if (!activeSet) {
    return (
      <StudySetPageContainer>
        <LoadingContainer>
          <LoadingSpinner />
          <p>Loading study set...</p>
        </LoadingContainer>
      </StudySetPageContainer>
    );
  }

  const currentCard = activeSet.cards[currentIndex];
  const knownCards = Object.values(progress).filter(status => status === 'known').length;
  const unknownCards = Object.values(progress).filter(status => status === 'unknown').length;
  const progressPercentage = (Object.keys(progress).length / activeSet.cards.length) * 100;
  const remainingCards = activeSet.cards.length - Object.keys(progress).length;

  return (
    <StudySetPageContainer>
      <StudyHeader>
        <StudyTitle>{activeSet.title}</StudyTitle>
        <ProgressBar 
          progress={progressPercentage}
          current={Object.keys(progress).length}
          total={activeSet.cards.length}
          correct={knownCards}
          incorrect={unknownCards}
          label="Study Progress"
          showStats={true}
        />
      </StudyHeader>

      <CardWrapper>
        <Flashcard 
          term={currentCard.term} 
          definition={currentCard.definition}
          showLabels={true}
          showHint={true}
        />
      </CardWrapper>

      <StatsContainer>
        <StatCard className="known">
          <StatNumber className="known">{knownCards}</StatNumber>
          <StatLabel>Known</StatLabel>
        </StatCard>
        <StatCard className="unknown">
          <StatNumber className="unknown">{unknownCards}</StatNumber>
          <StatLabel>Learning</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber className="remaining">{remainingCards}</StatNumber>
          <StatLabel>Remaining</StatLabel>
        </StatCard>
      </StatsContainer>

      <Controls>
        <NavigationControls>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={goToPrevCard}
          >
            ← Previous
          </Button>
          <CardCounter>
            {currentIndex + 1} / {activeSet.cards.length}
          </CardCounter>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={goToNextCard}
          >
            Next →
          </Button>
        </NavigationControls>
        
        <KnowledgeControls>
          <Button 
            variant="danger" 
            onClick={markAsUnknown}
          >
            Need Practice
          </Button>
          <Button 
            variant="success" 
            onClick={markAsKnown}
          >
            Know It!
          </Button>
        </KnowledgeControls>
      </Controls>

      <ActionSection>
        <Button 
          variant="primary" 
          size="lg"
          onClick={() => {
            try {
              navigate(`/test/${id}`);
            } catch (error) {
              console.error('Navigate failed:', error);
              window.location.href = `/test/${id}`;
            }
          }}
        >
          Take Test
        </Button>
        <Button 
          variant="success"
          size="lg"
          onClick={() => {
            try {
              navigate(`/studyguide/${id}`);
            } catch (error) {
              console.error('Navigate failed:', error);
              window.location.href = `/studyguide/${id}`;
            }
          }}
        >
          📖 AI Study Guide
        </Button>
        <Button 
          variant="ghost"
          onClick={() => {
            try {
              navigate('/');
            } catch (error) {
              console.error('Navigate failed:', error);
              window.location.href = '/';
            }
          }}
        >
          Back to Home
        </Button>
        {Object.keys(progress).length > 0 && (
          <Button 
            variant="danger"
            size="sm"
            onClick={resetProgress}
          >
            Reset Progress
          </Button>
        )}
      </ActionSection>
    </StudySetPageContainer>
  );
};

export default StudySetPage;
