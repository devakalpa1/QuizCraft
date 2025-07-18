import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { StudySetContext } from '../context/StudySetContext';
import Button from '../components/Button';

const CreateSetPageContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: var(--space-8) var(--space-4);
  animation: fadeIn 0.6s ease-out;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: var(--space-8);
`;

const PageTitle = styled.h1`
  font-size: var(--font-size-4xl);
  font-weight: 700;
  margin-bottom: var(--space-4);
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const PageDescription = styled.p`
  font-size: var(--font-size-lg);
  color: var(--text-color-secondary);
  max-width: 600px;
  margin: 0 auto;
`;

const FormSection = styled.div`
  background: var(--card-background-color);
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-color);
  padding: var(--space-8);
  margin-bottom: var(--space-6);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  
  @media (max-width: 768px) {
    padding: var(--space-6);
  }
`;

const InputGroup = styled.div`
  margin-bottom: var(--space-6);
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  font-size: var(--font-size-lg);
  color: var(--text-color);
  margin-bottom: var(--space-3);
`;

const TitleInput = styled.input`
  width: 100%;
  background: var(--background-secondary);
  color: var(--text-color);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--space-4) var(--space-6);
  font-size: var(--font-size-xl);
  font-weight: 600;
  transition: all var(--transition-normal);
  
  &::placeholder {
    color: var(--text-color-muted);
  }
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(66, 85, 255, 0.1);
  }
`;

const CardsSection = styled.div`
  margin-bottom: var(--space-8);
`;

const SectionTitle = styled.h2`
  font-size: var(--font-size-2xl);
  font-weight: 600;
  margin-bottom: var(--space-6);
  color: var(--text-color);
  display: flex;
  align-items: center;
  gap: var(--space-3);
  
  &::before {
    content: '📚';
    font-size: var(--font-size-xl);
  }
`;

const CardInputContainer = styled.div`
  background: var(--surface-color);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
  margin-bottom: var(--space-4);
  overflow: hidden;
  transition: all var(--transition-normal);
  
  &:hover {
    border-color: var(--border-color-hover);
  }
`;

const CardHeader = styled.div`
  background: var(--card-background-color);
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CardNumber = styled.span`
  font-weight: 600;
  color: var(--text-color-secondary);
  font-size: var(--font-size-sm);
`;

const CardInputRow = styled.div`
  padding: var(--space-6);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: var(--space-4);
  }
`;

const InputColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
`;

const InputLabel = styled.span`
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--text-color-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const CardInput = styled.textarea`
  width: 100%;
  background: var(--background-color);
  color: var(--text-color);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  font-size: var(--font-size-base);
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
  transition: all var(--transition-normal);
  
  &::placeholder {
    color: var(--text-color-muted);
  }
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(66, 85, 255, 0.1);
  }
`;

const AddCardButton = styled.button`
  width: 100%;
  background: transparent;
  border: 2px dashed var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  color: var(--text-color-secondary);
  font-size: var(--font-size-lg);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-normal);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  
  &:hover {
    border-color: var(--primary-color);
    color: var(--primary-color);
    background: rgba(66, 85, 255, 0.05);
  }
  
  &::before {
    content: '+';
    font-size: var(--font-size-2xl);
    font-weight: 300;
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-6) 0;
  border-top: 1px solid var(--border-color);
  margin-top: var(--space-6);
  
  @media (max-width: 640px) {
    flex-direction: column;
    gap: var(--space-4);
  }
`;

const CardCount = styled.div`
  color: var(--text-color-secondary);
  font-size: var(--font-size-sm);
  
  strong {
    color: var(--text-color);
    font-weight: 600;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: var(--space-3);
  
  @media (max-width: 640px) {
    width: 100%;
    justify-content: center;
  }
`;

const CreateSetPage = () => {
  const [title, setTitle] = useState('');
  const [cards, setCards] = useState([{ term: '', definition: '' }]);
  const [isCreating, setIsCreating] = useState(false);
  const { addStudySet } = useContext(StudySetContext);
  const navigate = useNavigate();

  const handleCardChange = (index, field, value) => {
    const newCards = [...cards];
    newCards[index][field] = value;
    setCards(newCards);
  };

  const addCard = () => {
    setCards([...cards, { term: '', definition: '' }]);
  };

  const removeCard = (index) => {
    if (cards.length > 1) {
      const newCards = cards.filter((_, i) => i !== index);
      setCards(newCards);
    }
  };

  const handleCreateSet = async () => {
    if (!title.trim()) {
      alert('Please enter a title for your study set');
      return;
    }
    
    const validCards = cards.filter(card => card.term.trim() && card.definition.trim());
    if (validCards.length === 0) {
      alert('Please add at least one complete card');
      return;
    }
    
    setIsCreating(true);
    
    // Simulate loading for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newSet = addStudySet({ title: title.trim(), cards: validCards });
    navigate(`/studyset/${newSet.id}`);
  };

  const validCardCount = cards.filter(card => card.term.trim() && card.definition.trim()).length;

  return (
    <CreateSetPageContainer>
      <Header>
        <PageTitle>Create New Study Set</PageTitle>
        <PageDescription>
          Build your own flashcard set to master any subject. Add terms and definitions to get started.
        </PageDescription>
      </Header>

      <FormSection>
        <InputGroup>
          <Label htmlFor="title">Study Set Title</Label>
          <TitleInput
            id="title"
            type="text"
            placeholder="Enter a descriptive title, e.g. 'Biology - Chapter 4: Cell Structure'"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </InputGroup>
      </FormSection>

      <CardsSection>
        <SectionTitle>Flashcards</SectionTitle>
        
        {cards.map((card, index) => (
          <CardInputContainer key={index}>
            <CardHeader>
              <CardNumber>Card {index + 1}</CardNumber>
              {cards.length > 1 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => removeCard(index)}
                >
                  Remove
                </Button>
              )}
            </CardHeader>
            <CardInputRow>
              <InputColumn>
                <InputLabel>Term</InputLabel>
                <CardInput
                  placeholder="Enter the term or question"
                  value={card.term}
                  onChange={(e) => handleCardChange(index, 'term', e.target.value)}
                />
              </InputColumn>
              <InputColumn>
                <InputLabel>Definition</InputLabel>
                <CardInput
                  placeholder="Enter the definition or answer"
                  value={card.definition}
                  onChange={(e) => handleCardChange(index, 'definition', e.target.value)}
                />
              </InputColumn>
            </CardInputRow>
          </CardInputContainer>
        ))}
        
        <AddCardButton onClick={addCard}>
          Add Another Card
        </AddCardButton>
      </CardsSection>

      <Actions>
        <CardCount>
          <strong>{validCardCount}</strong> of {cards.length} cards completed
        </CardCount>
        <ActionButtons>
          <Button 
            variant="secondary" 
            onClick={() => navigate('/')}
            disabled={isCreating}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            size="lg"
            onClick={handleCreateSet}
            loading={isCreating}
            disabled={!title.trim() || validCardCount === 0}
          >
            Create Study Set
          </Button>
        </ActionButtons>
      </Actions>
    </CreateSetPageContainer>
  );
};

export default CreateSetPage;
