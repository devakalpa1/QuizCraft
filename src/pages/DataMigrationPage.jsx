import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '../components/Button';

const MigrationContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: var(--space-8) var(--space-4);
`;

const Title = styled.h1`
  text-align: center;
  color: var(--text-color);
  margin-bottom: var(--space-6);
`;

const Section = styled.div`
  background: var(--card-background-color);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  margin-bottom: var(--space-4);
`;

const DataDisplay = styled.textarea`
  width: 100%;
  height: 200px;
  background: var(--background-color);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: var(--space-3);
  font-family: monospace;
  font-size: var(--font-size-sm);
  color: var(--text-color);
  resize: vertical;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: var(--space-3);
  margin-top: var(--space-4);
`;

const DataMigrationPage = () => {
  const [exportedData, setExportedData] = useState('');
  const [importData, setImportData] = useState('');
  const [message, setMessage] = useState('');

  const exportCurrentData = () => {
    try {
      const studySets = localStorage.getItem('quizcraft-study-sets');
      const userStats = localStorage.getItem('quizcraft-user-stats');
      const studyProgress = localStorage.getItem('quizcraft-study-progress');
      
      const data = {
        studySets: studySets ? JSON.parse(studySets) : [],
        userStats: userStats ? JSON.parse(userStats) : {},
        studyProgress: studyProgress ? JSON.parse(studyProgress) : {},
        exportDate: new Date().toISOString(),
        port: window.location.port
      };
      
      setExportedData(JSON.stringify(data, null, 2));
      setMessage(`Exported data from port ${window.location.port}`);
    } catch (error) {
      setMessage(`Error exporting data: ${error.message}`);
    }
  };

  const importDataToStorage = () => {
    try {
      const data = JSON.parse(importData);
      
      if (data.studySets) {
        localStorage.setItem('quizcraft-study-sets', JSON.stringify(data.studySets));
      }
      if (data.userStats) {
        localStorage.setItem('quizcraft-user-stats', JSON.stringify(data.userStats));
      }
      if (data.studyProgress) {
        localStorage.setItem('quizcraft-study-progress', JSON.stringify(data.studyProgress));
      }
      
      setMessage(`Successfully imported data! Refresh the page to see your flashcards.`);
      
      // Auto-refresh after 2 seconds
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      setMessage(`Error importing data: ${error.message}`);
    }
  };

  const clearCurrentData = () => {
    if (window.confirm('Are you sure you want to clear all data on this port?')) {
      localStorage.removeItem('quizcraft-study-sets');
      localStorage.removeItem('quizcraft-user-stats');
      localStorage.removeItem('quizcraft-study-progress');
      setMessage('Data cleared! Refresh the page.');
    }
  };

  const checkForData = () => {
    const studySets = localStorage.getItem('quizcraft-study-sets');
    const hasData = studySets && JSON.parse(studySets).length > 0;
    setMessage(hasData ? 
      `Found ${JSON.parse(studySets).length} study sets on port ${window.location.port}` : 
      `No study sets found on port ${window.location.port}`
    );
  };

  return (
    <MigrationContainer>
      <Title>Data Migration Tool</Title>
      
      <Section>
        <h3>Current Port: {window.location.port}</h3>
        <p>Use this tool to export data from one port and import it to another.</p>
        <ButtonGroup>
          <Button onClick={checkForData}>Check for Data</Button>
          <Button onClick={exportCurrentData}>Export Data</Button>
          <Button variant="secondary" onClick={clearCurrentData}>Clear Data</Button>
        </ButtonGroup>
        {message && (
          <div style={{ 
            marginTop: 'var(--space-3)', 
            padding: 'var(--space-3)', 
            background: 'var(--background-secondary)', 
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-color)'
          }}>
            {message}
          </div>
        )}
      </Section>

      {exportedData && (
        <Section>
          <h3>Exported Data</h3>
          <p>Copy this data and paste it in the Import section on port 5173:</p>
          <DataDisplay value={exportedData} readOnly />
          <Button 
            onClick={() => navigator.clipboard.writeText(exportedData)}
            style={{ marginTop: 'var(--space-3)' }}
          >
            Copy to Clipboard
          </Button>
        </Section>
      )}

      <Section>
        <h3>Import Data</h3>
        <p>Paste exported data here to import it to this port:</p>
        <DataDisplay 
          value={importData}
          onChange={(e) => setImportData(e.target.value)}
          placeholder="Paste exported JSON data here..."
        />
        <Button 
          onClick={importDataToStorage}
          disabled={!importData.trim()}
          style={{ marginTop: 'var(--space-3)' }}
        >
          Import Data
        </Button>
      </Section>
    </MigrationContainer>
  );
};

export default DataMigrationPage;
