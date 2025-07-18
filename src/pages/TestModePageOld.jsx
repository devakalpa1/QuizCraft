import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { StudySetContext } from '../context/StudySetContext';
import Button from '../components/Button';
import ProgressBar from '../components/ProgressBar';
import aiService from '../services/aiService';

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const celebration = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

const TestModePageContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: var(--space-8) var(--space-4);
  min-height: calc(100vh - 80px);
  animation: fadeIn 0.6s ease-out;
`;

const TestHeader = styled.div`
  text-align: center;
  margin-bottom: var(--space-8);
`;

const TestTitle = styled.h1`
  font-size: var(--font-size-3xl);
  font-weight: 700;
  margin-bottom: var(--space-4);
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const QuestionContainer = styled.div`
  background: var(--card-background-color);
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-color);
  padding: var(--space-8);
  margin-bottom: var(--space-6);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  animation: ${slideIn} 0.5s ease-out;
`;

const QuestionNumber = styled.div`
  background: var(--primary-gradient);
  color: white;
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: 600;
  display: inline-block;
  margin-bottom: var(--space-4);
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const QuestionText = styled.h2`
  font-size: var(--font-size-2xl);
  font-weight: 600;
  text-align: center;
  color: var(--text-color);
  line-height: 1.4;
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: var(--font-size-xl);
  }
`;

const OptionsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-4);
  margin-bottom: var(--space-6);
`;

const OptionButton = styled.button`
  background: var(--card-background-color);
  color: var(--text-color);
  border: 2px solid var(--border-color);
  padding: var(--space-5);
  border-radius: var(--radius-lg);
  cursor: pointer;
  font-size: var(--font-size-lg);
  text-align: left;
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--primary-gradient);
    opacity: 0;
    transition: opacity var(--transition-normal);
    z-index: 0;
  }
  
  &:hover:not(.disabled) {
    border-color: var(--primary-color);
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
    
    &::before {
      opacity: 0.1;
    }
  }

  &.selected {
    border-color: var(--primary-color);
    background: rgba(66, 85, 255, 0.1);
    
    &::before {
      opacity: 0.2;
    }
  }

  &.correct {
    border-color: var(--success-color);
    background: rgba(34, 197, 94, 0.1);
    animation: ${celebration} 0.5s ease-out;
    
    &::after {
      content: '✓';
      position: absolute;
      right: var(--space-4);
      top: 50%;
      transform: translateY(-50%);
      color: var(--success-color);
      font-size: var(--font-size-xl);
      font-weight: bold;
    }
  }

  &.incorrect {
    border-color: var(--error-color);
    background: rgba(239, 68, 68, 0.1);
    
    &::after {
      content: '✗';
      position: absolute;
      right: var(--space-4);
      top: 50%;
      transform: translateY(-50%);
      color: var(--error-color);
      font-size: var(--font-size-xl);
      font-weight: bold;
    }
  }
  
  &.disabled {
    cursor: not-allowed;
  }
  
  span {
    position: relative;
    z-index: 1;
  }
`;

const ActionContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: var(--space-4);
  
  @media (max-width: 640px) {
    flex-direction: column;
    align-items: center;
  }
`;

const ScoreContainer = styled.div`
  text-align: center;
  background: var(--card-background-color);
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-color);
  padding: var(--space-12);
  animation: ${celebration} 0.8s ease-out;
`;

const ScoreTitle = styled.h2`
  font-size: var(--font-size-4xl);
  font-weight: 700;
  margin-bottom: var(--space-4);
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const ScoreDisplay = styled.div`
  font-size: var(--font-size-6xl);
  font-weight: 800;
  margin-bottom: var(--space-6);
  color: var(--text-color);
`;

const ScorePercentage = styled.div`
  font-size: var(--font-size-3xl);
  font-weight: 600;
  margin-bottom: var(--space-8);
  color: ${props => {
    if (props.$percentage >= 90) return 'var(--success-color)';
    if (props.$percentage >= 70) return 'var(--warning-color)';
    return 'var(--error-color)';
  }};
`;

const ScoreMessage = styled.p`
  font-size: var(--font-size-xl);
  color: var(--text-color-secondary);
  margin-bottom: var(--space-8);
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
`;

const ScoreActions = styled.div`
  display: flex;
  justify-content: center;
  gap: var(--space-4);
  flex-wrap: wrap;
  
  @media (max-width: 640px) {
    flex-direction: column;
    align-items: center;
  }
`;

const TestModePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getStudySetById, recordStudySession, getStudyProgress } = useContext(StudySetContext);
  const [activeSet, setActiveSet] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [options, setOptions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [testStartTime] = useState(Date.now());
  const [isGeneratingOptions, setIsGeneratingOptions] = useState(false);
  const [isAiAvailable, setIsAiAvailable] = useState(false);
  const [aiError, setAiError] = useState('');

  useEffect(() => {
    const set = getStudySetById(id);
    if (!set) {
      navigate('/');
      return;
    }
    setActiveSet(set);
    
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

  useEffect(() => {
    if (activeSet) {
      generateOptions();
    }
  }, [activeSet, currentQuestionIndex]);

  const generateIntelligentDistractors = async (currentCard, relatedCards) => {
    if (!isAiAvailable) {
      // Fallback to basic method if AI is not available
      return relatedCards
        .filter(card => card !== currentCard)
        .map(card => card.definition)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
    }

    try {
      const prompt = `
        Generate 3 plausible but incorrect answers for this flashcard question. The distractors should be:
        1. Related to the topic but clearly wrong
        2. Challenging enough to test real understanding
        3. Not obviously incorrect
        4. Similar in length and style to the correct answer
        
        Question: ${currentCard.term}
        Correct Answer: ${currentCard.definition}
        
        Related flashcards for context:
        ${relatedCards.slice(0, 5).map(card => `- ${card.term}: ${card.definition}`).join('\n')}
        
        Return only a JSON array of 3 distractor strings:
        ["distractor 1", "distractor 2", "distractor 3"]
      `;

      const result = await aiService.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        const distractors = JSON.parse(text);
        if (Array.isArray(distractors) && distractors.length === 3) {
          return distractors;
        }
      } catch (parseError) {
        console.warn('Failed to parse AI response, using fallback');
      }
    } catch (error) {
      console.warn('AI distractor generation failed, using fallback:', error);
    }

    // Fallback: use related flashcard definitions + some modifications
    const relatedDefinitions = relatedCards
      .filter(card => card !== currentCard)
      .map(card => card.definition)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    return relatedDefinitions;
  };

  const generateOptions = async () => {
    if (!activeSet || activeSet.cards.length === 0) return;
    
    setIsGeneratingOptions(true);
    setAiError('');
    
    try {
      const currentCard = activeSet.cards[currentQuestionIndex];
      
      // Get related flashcards (prefer ones that might be conceptually similar)
      const otherCards = activeSet.cards.filter((_, index) => index !== currentQuestionIndex);
      
      // Generate intelligent distractors
      const distractors = await generateIntelligentDistractors(currentCard, otherCards);
      
      // Combine correct answer with distractors and shuffle
      const allOptions = [currentCard.definition, ...distractors]
        .sort(() => 0.5 - Math.random());
      
      setOptions(allOptions);
    } catch (error) {
      console.error('Error generating options:', error);
      setAiError('Failed to generate test options. Using fallback method.');
      
      // Fallback to simple method
      const currentCard = activeSet.cards[currentQuestionIndex];
      const wrongAnswers = activeSet.cards
        .filter((_, index) => index !== currentQuestionIndex)
        .map((card) => card.definition);
      
      const shuffledWrongAnswers = wrongAnswers.sort(() => 0.5 - Math.random()).slice(0, 3);
      const allOptions = [currentCard.definition, ...shuffledWrongAnswers].sort(() => 0.5 - Math.random());
      setOptions(allOptions);
    } finally {
      setIsGeneratingOptions(false);
    }
  };

  const handleAnswerOptionClick = (option) => {
    if (!isSubmitted && !isGeneratingOptions) {
      setSelectedAnswer(option);
    }
  };

  const handleSubmit = () => {
    if (selectedAnswer && !isGeneratingOptions) {
      setIsSubmitted(true);
      if (selectedAnswer === activeSet.cards[currentQuestionIndex].definition) {
        setScore(score + 1);
      }
    }
  };

  const handleNextQuestion = () => {
    const nextQuestion = currentQuestionIndex + 1;
    if (nextQuestion < activeSet.cards.length) {
      setCurrentQuestionIndex(nextQuestion);
      setSelectedAnswer(null);
      setIsSubmitted(false);
      setAiError('');
    } else {
      setShowScore(true);
      
      // Record test completion
      const finalScore = score + (selectedAnswer === activeSet.cards[currentQuestionIndex].definition ? 1 : 0);
      const percentage = Math.round((finalScore / activeSet.cards.length) * 100);
      const duration = Math.round((Date.now() - testStartTime) / 1000);
      
      recordStudySession(activeSet.id, percentage, duration);
    }
  };

  const getScoreMessage = (percentage) => {
    if (percentage >= 90) {
      return "Outstanding! You've mastered this material! 🎉";
    } else if (percentage >= 80) {
      return "Great job! You have a strong understanding of the material.";
    } else if (percentage >= 70) {
      return "Good work! A bit more practice and you'll have it down.";
    } else if (percentage >= 60) {
      return "You're getting there! Review the material and try again.";
    } else {
      return "Keep studying! Practice makes perfect.";
    }
  };

  if (!activeSet) {
    return (
      <TestModePageContainer>
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <p>Loading test...</p>
        </div>
      </TestModePageContainer>
    );
  }

  const percentage = Math.round((score / activeSet.cards.length) * 100);

  return (
    <TestModePageContainer>
      {showScore ? (
        <ScoreContainer>
          <ScoreTitle>Test Complete!</ScoreTitle>
          <ScoreDisplay>{score} / {activeSet.cards.length}</ScoreDisplay>
          <ScorePercentage $percentage={percentage}>
            {percentage}%
          </ScorePercentage>
          <ScoreMessage>
            {getScoreMessage(percentage)}
          </ScoreMessage>
          <ScoreActions>
            <Button 
              variant="primary" 
              size="lg"
              onClick={() => {
                try {
                  navigate(`/studyset/${id}`);
                } catch (error) {
                  console.error('Navigate failed:', error);
                  window.location.href = `/studyset/${id}`;
                }
              }}
            >
              Review Flashcards
            </Button>
            <Button 
              variant="secondary" 
              size="lg"
              onClick={() => window.location.reload()}
            >
              Retake Test
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
          </ScoreActions>
        </ScoreContainer>
      ) : (
        <>
          <TestHeader>
            <TestTitle>{activeSet.title} - Test Mode</TestTitle>
            <ProgressBar 
              progress={(currentQuestionIndex / activeSet.cards.length) * 100}
              current={currentQuestionIndex + 1}
              total={activeSet.cards.length}
              correct={score}
              incorrect={currentQuestionIndex + 1 - score - (isSubmitted ? 1 : 0)}
              label="Test Progress"
              showStats={false}
            />
            {!isAiAvailable && (
              <div style={{ 
                marginTop: 'var(--space-3)', 
                padding: 'var(--space-2)', 
                background: 'rgba(255, 193, 7, 0.1)', 
                border: '1px solid #ffc107', 
                borderRadius: 'var(--radius-md)', 
                fontSize: 'var(--font-size-sm)',
                textAlign: 'center'
              }}>
                ⚠️ AI features unavailable - using basic question generation
              </div>
            )}
            {isAiAvailable && (
              <div style={{ 
                marginTop: 'var(--space-3)', 
                padding: 'var(--space-2)', 
                background: 'rgba(34, 197, 94, 0.1)', 
                border: '1px solid var(--success-color)', 
                borderRadius: 'var(--radius-md)', 
                fontSize: 'var(--font-size-sm)',
                textAlign: 'center'
              }}>
                ✨ AI-enhanced test with intelligent distractors
              </div>
            )}
          </TestHeader>

          <QuestionContainer>
            <QuestionNumber>
              Question {currentQuestionIndex + 1} of {activeSet.cards.length}
            </QuestionNumber>
            <QuestionText>{activeSet.cards[currentQuestionIndex].term}</QuestionText>
            {isGeneratingOptions && (
              <div style={{ textAlign: 'center', marginTop: 'var(--space-4)', color: 'var(--text-color-secondary)' }}>
                <div style={{ 
                  display: 'inline-block',
                  width: '20px', 
                  height: '20px', 
                  border: '2px solid var(--border-color)', 
                  borderTop: '2px solid var(--primary-color)', 
                  borderRadius: '50%', 
                  animation: 'spin 1s linear infinite',
                  marginRight: 'var(--space-2)'
                }}></div>
                Generating intelligent answer options...
              </div>
            )}
          </QuestionContainer>

          {aiError && (
            <div style={{ 
              margin: '0 auto var(--space-4)', 
              maxWidth: '600px',
              padding: 'var(--space-3)', 
              background: 'rgba(239, 68, 68, 0.1)', 
              border: '1px solid var(--error-color)', 
              borderRadius: 'var(--radius-md)', 
              color: 'var(--error-color)',
              fontSize: 'var(--font-size-sm)',
              textAlign: 'center'
            }}>
              {aiError}
            </div>
          )}

          <OptionsContainer>
            {options.map((option, index) => (
              <OptionButton
                key={index}
                onClick={() => handleAnswerOptionClick(option)}
                className={`
                  ${selectedAnswer === option ? 'selected' : ''}
                  ${isSubmitted && option === activeSet.cards[currentQuestionIndex].definition ? 'correct' : ''}
                  ${isSubmitted && selectedAnswer === option && option !== activeSet.cards[currentQuestionIndex].definition ? 'incorrect' : ''}
                  ${isSubmitted || isGeneratingOptions ? 'disabled' : ''}
                `}
                disabled={isGeneratingOptions}
              >
                <span>{option}</span>
              </OptionButton>
            ))}
          </OptionsContainer>

          <ActionContainer>
            {isSubmitted ? (
              <Button 
                variant="primary" 
                size="lg"
                onClick={handleNextQuestion}
                disabled={isGeneratingOptions}
              >
                {currentQuestionIndex + 1 === activeSet.cards.length ? 'See Results' : 'Next Question →'}
              </Button>
            ) : (
              <Button 
                variant="primary" 
                size="lg"
                onClick={handleSubmit}
                disabled={!selectedAnswer || isGeneratingOptions}
              >
                Submit Answer
              </Button>
            )}
          </ActionContainer>
        </>
      )}
    </TestModePageContainer>
  );
};

export default TestModePage;
