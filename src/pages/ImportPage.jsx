import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Papa from 'papaparse';
import { StudySetContext } from '../context/StudySetContext';
import Button from '../components/Button';
import aiService from '../services/aiService';

const ImportPageContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: var(--space-8) var(--space-4);
  animation: fadeIn 0.6s ease-out;
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

const Description = styled.p`
  font-size: var(--font-size-lg);
  color: var(--text-color-secondary);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const ImportSection = styled.div`
  background: var(--card-background-color);
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-color);
  padding: var(--space-8);
  margin-bottom: var(--space-6);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
`;

const SectionTitle = styled.h2`
  font-size: var(--font-size-2xl);
  font-weight: 600;
  margin-bottom: var(--space-4);
  color: var(--text-color);
  display: flex;
  align-items: center;
  gap: var(--space-3);
`;

const SectionDescription = styled.p`
  color: var(--text-color-secondary);
  margin-bottom: var(--space-6);
  line-height: 1.5;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 200px;
  background: var(--background-secondary);
  color: var(--text-color);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  font-size: var(--font-size-base);
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  resize: vertical;
  transition: all var(--transition-normal);
  line-height: 1.5;
  
  &::placeholder {
    color: var(--text-color-muted);
    font-family: inherit;
  }
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(66, 85, 255, 0.1);
  }
`;

const FileUploadArea = styled.div`
  border: 2px dashed var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--space-8);
  text-align: center;
  transition: all var(--transition-normal);
  cursor: pointer;
  position: relative;
  
  &:hover, &.dragover {
    border-color: var(--primary-color);
    background: rgba(66, 85, 255, 0.05);
  }
  
  &.has-file {
    border-color: var(--success-color);
    background: rgba(34, 197, 94, 0.05);
  }
`;

const FileUploadIcon = styled.div`
  font-size: 3rem;
  margin-bottom: var(--space-4);
  color: var(--text-color-secondary);
`;

const FileUploadText = styled.div`
  font-size: var(--font-size-lg);
  font-weight: 500;
  margin-bottom: var(--space-2);
  color: var(--text-color);
`;

const FileUploadSubtext = styled.div`
  font-size: var(--font-size-sm);
  color: var(--text-color-secondary);
  margin-bottom: var(--space-4);
`;

const HiddenFileInput = styled.input`
  position: absolute;
  left: -9999px;
  opacity: 0;
`;

const SelectedFile = styled.div`
  background: var(--surface-color);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  margin-top: var(--space-4);
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid var(--border-color);
`;

const FileName = styled.span`
  color: var(--text-color);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: var(--space-2);
  
  &::before {
    content: '📄';
    font-size: var(--font-size-lg);
  }
`;

const FormatExample = styled.div`
  background: var(--background-secondary);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  margin: var(--space-4) 0;
  border-left: 4px solid var(--primary-color);
`;

const ExampleTitle = styled.div`
  font-weight: 600;
  margin-bottom: var(--space-2);
  color: var(--text-color);
`;

const ExampleText = styled.pre`
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: var(--font-size-sm);
  color: var(--text-color-secondary);
  margin: 0;
  line-height: 1.4;
`;

const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--space-8);
  
  @media (max-width: 640px) {
    flex-direction: column;
    gap: var(--space-4);
  }
`;

const PreviewContainer = styled.div`
  margin-top: var(--space-6);
  padding: var(--space-4);
  background: var(--background-secondary);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
`;

const PreviewTitle = styled.h3`
  margin-bottom: var(--space-3);
  color: var(--text-color);
`;

const PreviewCount = styled.div`
  font-size: var(--font-size-sm);
  color: var(--text-color-secondary);
  margin-bottom: var(--space-3);
`;

const AISection = styled.div`
  background: linear-gradient(135deg, var(--card-background-color) 0%, rgba(66, 85, 255, 0.05) 100%);
  border-radius: var(--radius-xl);
  border: 2px solid var(--primary-color);
  padding: var(--space-8);
  margin-bottom: var(--space-6);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  position: relative;
  
  &::before {
    content: '✨';
    position: absolute;
    top: var(--space-4);
    right: var(--space-4);
    font-size: var(--font-size-2xl);
  }
`;

const AIToggle = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
`;

const AILabel = styled.label`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  cursor: pointer;
  font-weight: 500;
  color: var(--text-color);
`;

const AICheckbox = styled.input`
  width: 18px;
  height: 18px;
  accent-color: var(--primary-color);
`;

const AIOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-4);
  margin-top: var(--space-6);
`;

const AIOptionCard = styled.div`
  background: var(--surface-color);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: all var(--transition-normal);
  
  &:hover {
    border-color: var(--primary-color);
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }
  
  &.selected {
    border-color: var(--primary-color);
    background: rgba(66, 85, 255, 0.05);
  }
`;

const OptionIcon = styled.div`
  font-size: var(--font-size-2xl);
  margin-bottom: var(--space-2);
`;

const OptionTitle = styled.h4`
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: var(--space-1);
  color: var(--text-color);
`;

const OptionDescription = styled.p`
  font-size: var(--font-size-sm);
  color: var(--text-color-secondary);
  line-height: 1.4;
`;

const ConfigSection = styled.div`
  background: var(--background-secondary);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  margin-top: var(--space-4);
  border: 1px solid var(--border-color);
`;

const ConfigGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-4);
  margin-top: var(--space-4);
`;

const ConfigItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
`;

const ConfigLabel = styled.label`
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--text-color);
`;

const ConfigSelect = styled.select`
  background: var(--card-background-color);
  color: var(--text-color);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: var(--space-2) var(--space-3);
  font-size: var(--font-size-sm);
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const ConfigInput = styled.input`
  background: var(--card-background-color);
  color: var(--text-color);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: var(--space-2) var(--space-3);
  font-size: var(--font-size-sm);
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid var(--border-color);
  border-top: 2px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: var(--space-2);
  
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
  padding: var(--space-3);
  margin-top: var(--space-3);
  font-size: var(--font-size-sm);
`;

const SuccessMessage = styled.div`
  background: rgba(34, 197, 94, 0.1);
  color: var(--success-color);
  border: 1px solid var(--success-color);
  border-radius: var(--radius-md);
  padding: var(--space-3);
  margin-top: var(--space-3);
  font-size: var(--font-size-sm);
`;

const ImportPage = () => {
  const [textData, setTextData] = useState('');
  const [fileData, setFileData] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [previewCards, setPreviewCards] = useState([]);
  
  // AI-related state
  const [useAI, setUseAI] = useState(false);
  const [aiMode, setAiMode] = useState('document'); // 'document' or 'text'
  const [aiDocument, setAiDocument] = useState(null);
  const [aiDocumentName, setAiDocumentName] = useState('');
  const [aiText, setAiText] = useState('');
  const [aiConfig, setAiConfig] = useState({
    numCards: 15,
    difficulty: 'medium',
    subject: 'general',
    includeStudyGuide: false
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState('');
  const [aiSuccess, setAiSuccess] = useState('');
  const [isAiAvailable, setIsAiAvailable] = useState(false);
  
  const { addStudySet } = useContext(StudySetContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if AI service is available
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
  }, []);

  const handleFileChange = (file) => {
    setFileData(file);
    setFileName(file.name);
    
    // Preview the file contents
    Papa.parse(file, {
      header: false,
      preview: 5, // Show first 5 rows
      complete: (results) => {
        const cards = results.data
          .filter(row => row[0] && row[1])
          .map(row => ({ term: row[0], definition: row[1] }));
        setPreviewCards(cards);
      }
    });
  };

  const handleAiDocumentChange = (file) => {
    setAiDocument(file);
    setAiDocumentName(file.name);
    setAiError('');
    setAiSuccess('');
  };

  const handleGenerateFromAI = async () => {
    if (!isAiAvailable) {
      setAiError('AI service is not available. Please check your API key configuration.');
      return;
    }

    if (aiMode === 'document' && !aiDocument) {
      setAiError('Please select a document to generate flashcards from.');
      return;
    }

    if (aiMode === 'text' && !aiText.trim()) {
      setAiError('Please enter some text to generate flashcards from.');
      return;
    }

    setIsGenerating(true);
    setAiError('');
    setAiSuccess('');

    try {
      let generatedCards;
      
      if (aiMode === 'document') {
        generatedCards = await aiService.generateFlashcardsFromDocument(aiDocument, {
          count: aiConfig.numCards,
          difficulty: aiConfig.difficulty,
          subject: aiConfig.subject
        });
      } else {
        generatedCards = await aiService.generateFlashcardsFromText(aiText, {
          count: aiConfig.numCards,
          difficulty: aiConfig.difficulty,
          subject: aiConfig.subject
        });
      }

      if (generatedCards && generatedCards.length > 0) {
        setPreviewCards(generatedCards.slice(0, 10)); // Show first 10 for preview
        setAiSuccess(`Successfully generated ${generatedCards.length} flashcards using AI!`);
        
        // Store generated cards for import
        setTextData(generatedCards.map(card => `${card.term},${card.definition}`).join('\n'));
      } else {
        setAiError('No flashcards could be generated from the provided content.');
      }
    } catch (error) {
      console.error('AI generation error:', error);
      setAiError(error.message || 'Failed to generate flashcards. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleTextChange = (value) => {
    setTextData(value);
    
    // Preview text data
    if (value.trim()) {
      Papa.parse(value, {
        header: false,
        complete: (results) => {
          const cards = results.data
            .filter(row => row[0] && row[1])
            .map(row => ({ term: row[0], definition: row[1] }));
          setPreviewCards(cards.slice(0, 5)); // Show first 5
        }
      });
    } else {
      setPreviewCards([]);
    }
  };

  const handleImport = async () => {
    if (useAI && previewCards.length > 0) {
      // Import AI-generated cards
      setIsImporting(true);
      
      try {
        const title = aiDocumentName 
          ? aiDocumentName.replace(/\.[^/.]+$/, "") + " (AI Generated)"
          : 'AI Generated Study Set';
        
        const newSet = addStudySet({ title, cards: previewCards });
        navigate(`/studyset/${newSet.id}`);
      } catch (error) {
        console.error('Error importing AI-generated cards:', error);
        alert('An error occurred while importing the flashcards.');
        setIsImporting(false);
      }
      return;
    }

    // Traditional CSV import
    const dataToParse = fileData || textData;

    if (!dataToParse) {
      alert('Please provide data to import');
      return;
    }

    setIsImporting(true);

    Papa.parse(dataToParse, {
      header: false,
      complete: (results) => {
        const cards = results.data
          .filter(row => row[0] && row[1])
          .map(row => ({ term: row[0].trim(), definition: row[1].trim() }));
        
        if (cards.length > 0) {
          const title = fileName 
            ? fileName.replace(/\.[^/.]+$/, "") // Remove file extension
            : 'Imported Study Set';
          
          const newSet = addStudySet({ title, cards });
          navigate(`/studyset/${newSet.id}`);
        } else {
          alert('No valid data found to import. Please check your format.');
          setIsImporting(false);
        }
      },
      error: (error) => {
        console.error('Error parsing data:', error);
        alert('An error occurred while parsing the data. Please check your format.');
        setIsImporting(false);
      }
    });
  };

  return (
    <ImportPageContainer>
      <Header>
        <Title>Import Study Set</Title>
        <Description>
          Import your existing flashcards from a CSV file, paste them directly, or use AI to automatically generate flashcards from documents, PDFs, and text content.
        </Description>
      </Header>

      <ImportSection>
        <SectionTitle>
          <span>📝</span>
          Paste Your Data
        </SectionTitle>
        <SectionDescription>
          Copy and paste your flashcard data in CSV format (Term, Definition - one pair per line)
        </SectionDescription>
        
        <TextArea
          value={textData}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder="Photosynthesis,The process by which plants convert light into energy&#10;Mitochondria,The powerhouse of the cell&#10;DNA,Deoxyribonucleic acid that carries genetic information"
        />

        <FormatExample>
          <ExampleTitle>Expected Format:</ExampleTitle>
          <ExampleText>{`Term 1,Definition 1
Term 2,Definition 2
Term 3,Definition 3`}</ExampleText>
        </FormatExample>
      </ImportSection>

      <ImportSection>
        <SectionTitle>
          <span>📁</span>
          Upload CSV File
        </SectionTitle>
        <SectionDescription>
          Upload a CSV file with your flashcard data. The first column should contain terms, the second column should contain definitions.
        </SectionDescription>

        <FileUploadArea 
          className={fileName ? 'has-file' : ''}
          onClick={() => document.getElementById('file-input').click()}
        >
          <FileUploadIcon>
            {fileName ? '✅' : '📁'}
          </FileUploadIcon>
          <FileUploadText>
            {fileName ? 'File Selected' : 'Click to select a CSV file'}
          </FileUploadText>
          <FileUploadSubtext>
            {fileName ? 'Click to choose a different file' : 'Or drag and drop your file here'}
          </FileUploadSubtext>
          
          {fileName && (
            <SelectedFile onClick={(e) => e.stopPropagation()}>
              <FileName>{fileName}</FileName>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setFileData(null);
                  setFileName('');
                  setPreviewCards([]);
                }}
              >
                Remove
              </Button>
            </SelectedFile>
          )}
        </FileUploadArea>

        <HiddenFileInput
          id="file-input"
          type="file"
          accept=".csv,.txt"
          onChange={handleFileInputChange}
        />
      </ImportSection>

      {/* AI-Powered Import Section */}
      <AISection>
        <SectionTitle>
          <span>🤖</span>
          AI-Powered Import
        </SectionTitle>
        <SectionDescription>
          Use AI to automatically generate flashcards from documents, PDFs, text, or study materials. 
          Just upload your content and let AI create optimized flashcards for you!
        </SectionDescription>

        <AIToggle>
          <AILabel>
            <AICheckbox
              type="checkbox"
              checked={useAI}
              onChange={(e) => {
                setUseAI(e.target.checked);
                if (e.target.checked) {
                  setTextData('');
                  setFileData(null);
                  setFileName('');
                  setPreviewCards([]);
                }
              }}
            />
            Enable AI-powered flashcard generation
          </AILabel>
          {!isAiAvailable && (
            <ErrorMessage>
              AI service unavailable. Please configure your Gemini API key in the .env file.
            </ErrorMessage>
          )}
        </AIToggle>

        {useAI && isAiAvailable && (
          <>
            <AIOptions>
              <AIOptionCard 
                className={aiMode === 'document' ? 'selected' : ''}
                onClick={() => setAiMode('document')}
              >
                <OptionIcon>📄</OptionIcon>
                <OptionTitle>Document Upload</OptionTitle>
                <OptionDescription>
                  Upload PDF, Word documents, or text files. AI will extract key concepts and create flashcards.
                </OptionDescription>
              </AIOptionCard>

              <AIOptionCard 
                className={aiMode === 'text' ? 'selected' : ''}
                onClick={() => setAiMode('text')}
              >
                <OptionIcon>✍️</OptionIcon>
                <OptionTitle>Text Content</OptionTitle>
                <OptionDescription>
                  Paste study notes, articles, or any text content. AI will identify important concepts.
                </OptionDescription>
              </AIOptionCard>
            </AIOptions>

            {aiMode === 'document' && (
              <ConfigSection>
                <SectionTitle style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--space-3)' }}>
                  <span>📁</span>
                  Upload Document
                </SectionTitle>
                
                <FileUploadArea 
                  className={aiDocumentName ? 'has-file' : ''}
                  onClick={() => document.getElementById('ai-file-input').click()}
                >
                  <FileUploadIcon>
                    {aiDocumentName ? '✅' : '📁'}
                  </FileUploadIcon>
                  <FileUploadText>
                    {aiDocumentName ? 'Document Selected' : 'Click to select a document'}
                  </FileUploadText>
                  <FileUploadSubtext>
                    {aiDocumentName ? 'Click to choose a different file' : 'Supports PDF, Word docs, and text files'}
                  </FileUploadSubtext>
                  
                  {aiDocumentName && (
                    <SelectedFile onClick={(e) => e.stopPropagation()}>
                      <FileName>{aiDocumentName}</FileName>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setAiDocument(null);
                          setAiDocumentName('');
                          setPreviewCards([]);
                        }}
                      >
                        Remove
                      </Button>
                    </SelectedFile>
                  )}
                </FileUploadArea>

                <HiddenFileInput
                  id="ai-file-input"
                  type="file"
                  accept=".pdf,.doc,.docx,.txt,.rtf"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) handleAiDocumentChange(file);
                  }}
                />
              </ConfigSection>
            )}

            {aiMode === 'text' && (
              <ConfigSection>
                <SectionTitle style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--space-3)' }}>
                  <span>✍️</span>
                  Enter Text Content
                </SectionTitle>
                
                <TextArea
                  value={aiText}
                  onChange={(e) => setAiText(e.target.value)}
                  placeholder="Paste your study notes, article content, or any educational material here. The AI will analyze it and create relevant flashcards..."
                  style={{ height: '250px' }}
                />
              </ConfigSection>
            )}

            <ConfigSection>
              <SectionTitle style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--space-3)' }}>
                <span>⚙️</span>
                AI Configuration
              </SectionTitle>
              
              <ConfigGrid>
                <ConfigItem>
                  <ConfigLabel>Number of Cards</ConfigLabel>
                  <ConfigInput
                    type="number"
                    min="5"
                    max="50"
                    value={aiConfig.numCards}
                    onChange={(e) => setAiConfig({...aiConfig, numCards: parseInt(e.target.value)})}
                  />
                </ConfigItem>

                <ConfigItem>
                  <ConfigLabel>Difficulty Level</ConfigLabel>
                  <ConfigSelect
                    value={aiConfig.difficulty}
                    onChange={(e) => setAiConfig({...aiConfig, difficulty: e.target.value})}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </ConfigSelect>
                </ConfigItem>

                <ConfigItem>
                  <ConfigLabel>Subject Area</ConfigLabel>
                  <ConfigInput
                    type="text"
                    value={aiConfig.subject}
                    onChange={(e) => setAiConfig({...aiConfig, subject: e.target.value})}
                    placeholder="e.g., Biology, History, Programming"
                  />
                </ConfigItem>
              </ConfigGrid>

              <div style={{ marginTop: 'var(--space-4)', textAlign: 'center' }}>
                <Button
                  variant="primary"
                  onClick={handleGenerateFromAI}
                  disabled={isGenerating || (aiMode === 'document' && !aiDocument) || (aiMode === 'text' && !aiText.trim())}
                >
                  {isGenerating && <LoadingSpinner />}
                  {isGenerating ? 'Generating Flashcards...' : '✨ Generate Flashcards with AI'}
                </Button>
              </div>

              {aiError && <ErrorMessage>{aiError}</ErrorMessage>}
              {aiSuccess && <SuccessMessage>{aiSuccess}</SuccessMessage>}
            </ConfigSection>
          </>
        )}
      </AISection>

      {previewCards.length > 0 && (
        <PreviewContainer>
          <PreviewTitle>Preview</PreviewTitle>
          <PreviewCount>
            {previewCards.length} card{previewCards.length !== 1 ? 's' : ''} detected
            {previewCards.length === 5 ? ' (showing first 5)' : ''}
          </PreviewCount>
          {previewCards.map((card, index) => (
            <div key={index} style={{ 
              padding: 'var(--space-3)', 
              marginBottom: 'var(--space-2)', 
              background: 'var(--card-background-color)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)'
            }}>
              <strong>{card.term}</strong> → {card.definition}
            </div>
          ))}
        </PreviewContainer>
      )}

      <Actions>
        <Button 
          variant="secondary"
          onClick={() => navigate('/')}
          disabled={isImporting}
        >
          Cancel
        </Button>
        <Button 
          variant="primary"
          size="lg"
          onClick={handleImport}
          loading={isImporting}
          disabled={
            isImporting || 
            (useAI ? previewCards.length === 0 : (!textData.trim() && !fileData))
          }
        >
          {useAI ? 'Import AI Generated Cards' : 'Import Study Set'}
        </Button>
      </Actions>
    </ImportPageContainer>
  );
};

export default ImportPage;
