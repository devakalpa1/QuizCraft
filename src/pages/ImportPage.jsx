import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Papa from 'papaparse';
import { StudySetContext } from '../context/StudySetContext';
import Button from '../components/Button';

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

const ImportPage = () => {
  const [textData, setTextData] = useState('');
  const [fileData, setFileData] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [previewCards, setPreviewCards] = useState([]);
  const { addStudySet } = useContext(StudySetContext);
  const navigate = useNavigate();

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
          Import your existing flashcards from a CSV file or paste them directly. We'll automatically create a new study set for you.
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
          disabled={!textData.trim() && !fileData}
        >
          Import Study Set
        </Button>
      </Actions>
    </ImportPageContainer>
  );
};

export default ImportPage;
