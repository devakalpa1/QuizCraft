import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { StudySetProvider, StudySetContext } from './context/StudySetContext';
import Header from './components/Header';
import Main from './components/Main';
import HomePage from './pages/HomePage';
import StudySetPage from './pages/StudySetPage';
import ImportPage from './pages/ImportPage';
import CreateSetPage from './pages/CreateSetPage';
import TestModePage from './pages/TestModePage';
import SaveIndicator from './components/SaveIndicator';
import styled from 'styled-components';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    var(--background-color) 0%,
    var(--background-secondary) 50%,
    var(--background-color) 100%
  );
  color: var(--text-color);
  position: relative;
  
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(66, 85, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(124, 58, 237, 0.1) 0%, transparent 50%);
    pointer-events: none;
    z-index: -1;
  }
`;

const MainContent = styled.div`
  position: relative;
  z-index: 1;
`;

const AppContent = () => {
  const { saveStatus } = useContext(StudySetContext);
  
  return (
    <AppContainer>
      <Router>
        <Header />
        <MainContent>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/studyset/:id" element={<StudySetPage />} />
            <Route path="/import" element={<ImportPage />} />
            <Route path="/create" element={<CreateSetPage />} />
            <Route path="/test/:id" element={<TestModePage />} />
          </Routes>
        </MainContent>
        <SaveIndicator 
          show={saveStatus.show}
          saving={saveStatus.saving}
          message={saveStatus.message}
        />
      </Router>
    </AppContainer>
  );
};

function App() {
  return (
    <StudySetProvider>
      <AppContent />
    </StudySetProvider>
  );
}

export default App;
