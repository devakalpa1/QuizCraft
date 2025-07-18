import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import Button from '../components/Button';
import { StudySetContext } from '../context/StudySetContext';
import aiService from '../services/aiService';

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

const StudyGuideContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: var(--space-8) var(--space-4);
  animation: ${fadeIn} 0.6s ease-out;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: var(--space-8);
`;

const Title = styled.h1`
  font-size: var(--font-size-4xl);
  font-weight: 700;
  margin-bottom: var(--space-4);
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  font-size: var(--font-size-lg);
  color: var(--text-color-secondary);
  margin-bottom: var(--space-6);
`;

const GenerateSection = styled.div`
  background: var(--card-background-color);
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-color);
  padding: var(--space-8);
  margin-bottom: var(--space-8);
  text-align: center;
`;

const StudyGuideContent = styled.div`
  background: var(--card-background-color);
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-color);
  padding: var(--space-8);
  margin-bottom: var(--space-6);
`;

const Section = styled.div`
  margin-bottom: var(--space-8);
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h2`
  font-size: var(--font-size-2xl);
  font-weight: 600;
  margin-bottom: var(--space-4);
  color: var(--text-color);
  display: flex;
  align-items: center;
  gap: var(--space-2);
`;

const SectionContent = styled.div`
  color: var(--text-color-secondary);
  line-height: 1.6;
  font-size: var(--font-size-base);
`;

const KeyPointsList = styled.div`
  display: grid;
  gap: var(--space-4);
`;

const KeyPoint = styled.div`
  background: var(--surface-color);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  border-left: 4px solid var(--primary-color);
`;

const KeyPointTitle = styled.h3`
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: var(--space-2);
  color: var(--text-color);
`;

const KeyPointText = styled.p`
  color: var(--text-color-secondary);
  margin-bottom: var(--space-2);
  line-height: 1.5;
`;

const MemoryTip = styled.div`
  background: rgba(66, 85, 255, 0.1);
  border-radius: var(--radius-md);
  padding: var(--space-2) var(--space-3);
  font-size: var(--font-size-sm);
  color: var(--primary-color);
  font-weight: 500;
  
  &::before {
    content: '💡 ';
  }
`;

const PracticeQuestion = styled.div`
  background: var(--background-secondary);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  margin-bottom: var(--space-3);
  border: 1px solid var(--border-color);
`;

const QuestionText = styled.h4`
  font-size: var(--font-size-base);
  font-weight: 600;
  margin-bottom: var(--space-2);
  color: var(--text-color);
`;

const AnswerText = styled.p`
  color: var(--text-color-secondary);
  line-height: 1.5;
  margin-top: var(--space-2);
  padding-top: var(--space-2);
  border-top: 1px solid var(--border-color);
`;

const TipsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const TipItem = styled.li`
  background: var(--surface-color);
  border-radius: var(--radius-md);
  padding: var(--space-3);
  margin-bottom: var(--space-2);
  border-left: 3px solid var(--success-color);
  
  &::before {
    content: '✓ ';
    color: var(--success-color);
    font-weight: bold;
  }
`;

const MistakesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const MistakeItem = styled.li`
  background: var(--surface-color);
  border-radius: var(--radius-md);
  padding: var(--space-3);
  margin-bottom: var(--space-2);
  border-left: 3px solid var(--error-color);
  
  &::before {
    content: '⚠️ ';
    color: var(--error-color);
    font-weight: bold;
  }
`;

const Connection = styled.div`
  background: var(--surface-color);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  margin-bottom: var(--space-3);
  border: 1px solid var(--border-color);
`;

const ConnectionConcepts = styled.div`
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: var(--space-2);
`;

const ConnectionRelation = styled.div`
  color: var(--text-color-secondary);
  line-height: 1.5;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
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

const ErrorMessage = styled.div`
  background: rgba(239, 68, 68, 0.1);
  color: var(--error-color);
  border: 1px solid var(--error-color);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  text-align: center;
  margin: var(--space-4) 0;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: var(--space-4);
  justify-content: center;
  flex-wrap: wrap;
  margin-top: var(--space-8);
`;

const StudyGuidePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getStudySetById, getStudyProgress } = useContext(StudySetContext);
  const [studySet, setStudySet] = useState(null);
  const [studyGuide, setStudyGuide] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [isAiAvailable, setIsAiAvailable] = useState(false);

  useEffect(() => {
    const set = getStudySetById(id);
    if (!set) {
      navigate('/');
      return;
    }
    setStudySet(set);

    // Check AI availability
    const checkAI = async () => {
      try {
        await aiService.initialize();
        setIsAiAvailable(aiService.isAvailable());
      } catch (error) {
        console.error('AI service initialization failed:', error);
        setIsAiAvailable(false);
      }
    };
    checkAI();
  }, [id, getStudySetById, navigate]);

  const generateStudyGuide = async () => {
    if (!isAiAvailable) {
      setError('AI service is not available. Please check your API key configuration.');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const userProgress = getStudyProgress(parseInt(id));
      const guide = await aiService.generateStudyGuide(studySet, userProgress);
      setStudyGuide(guide);
    } catch (error) {
      console.error('Error generating study guide:', error);
      setError('Failed to generate study guide. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!studySet) {
    return (
      <StudyGuideContainer>
        <LoadingContainer>
          <LoadingSpinner />
          <p>Loading study set...</p>
        </LoadingContainer>
      </StudyGuideContainer>
    );
  }

  return (
    <StudyGuideContainer>
      <Header>
        <Title>Study Guide: {studySet.title}</Title>
        <Subtitle>
          AI-generated comprehensive study guide with key concepts, practice questions, and learning strategies
        </Subtitle>
      </Header>

      {!studyGuide && (
        <GenerateSection>
          <h2 style={{ marginBottom: 'var(--space-4)', color: 'var(--text-color)' }}>
            Generate AI Study Guide
          </h2>
          <p style={{ marginBottom: 'var(--space-6)', color: 'var(--text-color-secondary)' }}>
            Create a comprehensive study guide tailored to your flashcard set. 
            The AI will analyze your cards and create detailed explanations, practice questions, and study tips.
          </p>
          
          {!isAiAvailable ? (
            <ErrorMessage>
              AI service is not available. Please configure your Gemini API key in the .env file.
            </ErrorMessage>
          ) : (
            <Button
              variant="primary"
              size="lg"
              onClick={generateStudyGuide}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <LoadingSpinner style={{ width: '20px', height: '20px', marginRight: 'var(--space-2)' }} />
                  Generating Study Guide...
                </>
              ) : (
                '✨ Generate Study Guide'
              )}
            </Button>
          )}
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </GenerateSection>
      )}

      {studyGuide && (
        <StudyGuideContent>
          <Section>
            <SectionTitle>
              <span>📖</span>
              Overview
            </SectionTitle>
            <SectionContent>
              {studyGuide.overview}
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>
              <span>🎯</span>
              Key Concepts
            </SectionTitle>
            <KeyPointsList>
              {studyGuide.keyPoints?.map((point, index) => (
                <KeyPoint key={index}>
                  <KeyPointTitle>{point.concept}</KeyPointTitle>
                  <KeyPointText>{point.explanation}</KeyPointText>
                  {point.memoryTip && (
                    <MemoryTip>{point.memoryTip}</MemoryTip>
                  )}
                </KeyPoint>
              ))}
            </KeyPointsList>
          </Section>

          <Section>
            <SectionTitle>
              <span>❓</span>
              Practice Questions
            </SectionTitle>
            {studyGuide.practiceQuestions?.map((qa, index) => (
              <PracticeQuestion key={index}>
                <QuestionText>Q: {qa.question}</QuestionText>
                <AnswerText>A: {qa.answer}</AnswerText>
              </PracticeQuestion>
            ))}
          </Section>

          <Section>
            <SectionTitle>
              <span>💡</span>
              Study Tips
            </SectionTitle>
            <TipsList>
              {studyGuide.studyTips?.map((tip, index) => (
                <TipItem key={index}>{tip}</TipItem>
              ))}
            </TipsList>
          </Section>

          <Section>
            <SectionTitle>
              <span>⚠️</span>
              Common Mistakes to Avoid
            </SectionTitle>
            <MistakesList>
              {studyGuide.commonMistakes?.map((mistake, index) => (
                <MistakeItem key={index}>{mistake}</MistakeItem>
              ))}
            </MistakesList>
          </Section>

          <Section>
            <SectionTitle>
              <span>🔗</span>
              Concept Connections
            </SectionTitle>
            {studyGuide.conceptConnections?.map((connection, index) => (
              <Connection key={index}>
                <ConnectionConcepts>
                  {connection.concepts.join(' ↔ ')}
                </ConnectionConcepts>
                <ConnectionRelation>
                  {connection.relationship}
                </ConnectionRelation>
              </Connection>
            ))}
          </Section>
        </StudyGuideContent>
      )}

      <ActionButtons>
        <Button 
          variant="secondary"
          onClick={() => navigate(`/studyset/${id}`)}
        >
          Back to Study Set
        </Button>
        <Button 
          variant="ghost"
          onClick={() => navigate('/')}
        >
          Home
        </Button>
        {studyGuide && (
          <Button 
            variant="primary"
            onClick={generateStudyGuide}
            disabled={isGenerating}
          >
            🔄 Regenerate Guide
          </Button>
        )}
      </ActionButtons>
    </StudyGuideContainer>
  );
};

export default StudyGuidePage;
