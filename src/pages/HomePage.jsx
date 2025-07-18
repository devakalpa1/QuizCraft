import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { StudySetContext } from '../context/StudySetContext';
import Button from '../components/Button';

const floatAnimation = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const HomePageContainer = styled.div`
  min-height: calc(100vh - 80px);
  padding: var(--space-8) var(--space-4);
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(
    135deg,
    var(--background-color) 0%,
    var(--background-secondary) 50%,
    var(--background-color) 100%
  );
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle,
      rgba(66, 85, 255, 0.1) 0%,
      transparent 50%
    );
    animation: ${floatAnimation} 10s ease-in-out infinite;
    z-index: 0;
  }
`;

const HeroSection = styled.section`
  text-align: center;
  margin-bottom: var(--space-16);
  position: relative;
  z-index: 1;
  max-width: 800px;
  
  @media (max-width: 768px) {
    margin-bottom: var(--space-12);
  }
`;

const HeroTitle = styled.h1`
  font-size: clamp(2.5rem, 8vw, 4.5rem);
  font-weight: 800;
  margin-bottom: var(--space-6);
  background: linear-gradient(
    135deg,
    var(--text-color) 0%,
    var(--primary-color) 50%,
    var(--secondary-color) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.1;
  animation: slideUp 0.8s ease-out;
`;

const HeroSubtitle = styled.p`
  font-size: var(--font-size-xl);
  color: var(--text-color-secondary);
  margin-bottom: var(--space-8);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
  animation: slideUp 0.8s ease-out 0.2s both;
  
  @media (max-width: 768px) {
    font-size: var(--font-size-lg);
  }
`;

const CTAContainer = styled.div`
  display: flex;
  gap: var(--space-4);
  justify-content: center;
  flex-wrap: wrap;
  animation: slideUp 0.8s ease-out 0.4s both;
  
  @media (max-width: 640px) {
    flex-direction: column;
    align-items: center;
  }
`;

const DataManagementSection = styled.section`
  width: 100%;
  max-width: 800px;
  text-align: center;
  margin: var(--space-12) 0;
  padding: var(--space-8);
  background: var(--card-background-color);
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-color);
  position: relative;
  z-index: 1;
`;

const BackupSectionTitle = styled.h2`
  font-size: var(--font-size-2xl);
  font-weight: 700;
  margin-bottom: var(--space-4);
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const SectionDescription = styled.p`
  font-size: var(--font-size-lg);
  color: var(--text-color-secondary);
  margin-bottom: var(--space-6);
  line-height: 1.6;
`;

const BackupControls = styled.div`
  display: flex;
  gap: var(--space-4);
  justify-content: center;
  flex-wrap: wrap;
  
  @media (max-width: 640px) {
    flex-direction: column;
    align-items: center;
  }
`;

const StatsSection = styled.section`
  width: 100%;
  max-width: 1200px;
  position: relative;
  z-index: 1;
  margin-bottom: var(--space-12);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-6);
  margin-bottom: var(--space-8);
`;

const StatCard = styled.div`
  background: var(--card-background-color);
  padding: var(--space-6);
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-color);
  text-align: center;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: all var(--transition-normal);
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
    border-color: var(--border-color-hover);
  }
`;

const StatNumber = styled.div`
  font-size: var(--font-size-3xl);
  font-weight: 800;
  margin-bottom: var(--space-2);
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const StatLabel = styled.div`
  font-size: var(--font-size-sm);
  color: var(--text-color-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 500;
`;

const StatIcon = styled.div`
  font-size: 2rem;
  margin-bottom: var(--space-3);
`;

const RecentsContainer = styled.section`
  width: 100%;
  max-width: 1200px;
  position: relative;
  z-index: 1;
`;

const SectionTitle = styled.h2`
  font-size: var(--font-size-3xl);
  font-weight: 700;
  margin-bottom: var(--space-8);
  text-align: center;
  color: var(--text-color);
`;

const StudySetGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--space-6);
  margin-bottom: var(--space-8);
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: var(--space-4);
  }
`;

const StudySetCard = styled(Link)`
  background: var(--card-background-color);
  padding: var(--space-6);
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-color);
  transition: all var(--transition-normal);
  display: block;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  
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
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-xl), var(--shadow-glow);
    border-color: var(--primary-color);
    
    &::before {
      opacity: 0.1;
    }
  }
  
  * {
    position: relative;
    z-index: 1;
  }
`;

const CardTitle = styled.h3`
  font-size: var(--font-size-xl);
  font-weight: 600;
  margin-bottom: var(--space-3);
  color: var(--text-color);
`;

const CardMeta = styled.div`
  color: var(--text-color-secondary);
  font-size: var(--font-size-sm);
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-2);
`;

const CardStats = styled.div`
  display: flex;
  gap: var(--space-4);
  font-size: var(--font-size-xs);
  color: var(--text-color-muted);
`;

const EmptyState = styled.div`
  text-align: center;
  padding: var(--space-16) var(--space-4);
  color: var(--text-color-secondary);
  
  h3 {
    font-size: var(--font-size-2xl);
    margin-bottom: var(--space-4);
    color: var(--text-color);
  }
  
  p {
    font-size: var(--font-size-lg);
    margin-bottom: var(--space-8);
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-6);
  margin: var(--space-16) 0;
  max-width: 1000px;
`;

const FeatureCard = styled.div`
  background: var(--card-background-color);
  padding: var(--space-6);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
  text-align: center;
  transition: all var(--transition-normal);
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
    border-color: var(--border-color-hover);
  }
`;

const FeatureIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: var(--space-4);
`;

const FeatureTitle = styled.h3`
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: var(--space-2);
  color: var(--text-color);
`;

const FeatureDescription = styled.p`
  color: var(--text-color-secondary);
  font-size: var(--font-size-sm);
  line-height: 1.5;
`;

const HomePage = () => {
  const { studySets, userStats, exportData, importData } = useContext(StudySetContext);
  const navigate = useNavigate();
  
  const handleExportData = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quizcraft-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = importData(e.target.result);
      if (result.success) {
        alert('Data imported successfully! Your study sets and progress have been restored.');
        window.location.reload(); // Refresh to show imported data
      } else {
        alert(`Import failed: ${result.message}`);
      }
    };
    reader.readAsText(file);
  };
  
  // Sort study sets by last studied date for "recent" display
  const recentStudySets = [...studySets]
    .sort((a, b) => {
      const aDate = a.lastStudied ? new Date(a.lastStudied) : new Date(a.createdAt);
      const bDate = b.lastStudied ? new Date(b.lastStudied) : new Date(b.createdAt);
      return bDate - aDate;
    })
    .slice(0, 6);

  const formatStudyTime = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m`;
  };

  return (
    <HomePageContainer>
      <HeroSection>
        <HeroTitle>Master Any Subject with Smart Flashcards</HeroTitle>
        <HeroSubtitle>
          Transform your learning with AI-powered study sessions, progress tracking, and adaptive reviews that help you retain information longer.
        </HeroSubtitle>
        <CTAContainer>
          <Button 
            size="xl" 
            variant="primary"
            onClick={() => navigate('/create')}
          >
            Create Your First Set
          </Button>
          <Button 
            size="xl" 
            variant="secondary"
            onClick={() => navigate('/import')}
          >
            Import Existing Cards
          </Button>
        </CTAContainer>
      </HeroSection>

      {/* Data Management Section */}
      <DataManagementSection>
        <BackupSectionTitle>Backup & Restore</BackupSectionTitle>
        <SectionDescription>
          Keep your study progress safe! Export your data to back it up or import from a previous backup.
        </SectionDescription>
        <BackupControls>
          <Button 
            variant="secondary" 
            onClick={handleExportData}
          >
            📱 Export Data
          </Button>
          <input
            type="file"
            accept=".json"
            onChange={handleImportData}
            style={{ display: 'none' }}
            id="import-file"
          />
          <Button 
            variant="secondary"
            onClick={() => document.getElementById('import-file').click()}
          >
            📂 Import Data
          </Button>
        </BackupControls>
      </DataManagementSection>

      {studySets.length > 0 && (
        <StatsSection>
          <StatsGrid>
            <StatCard>
              <StatIcon>📚</StatIcon>
              <StatNumber>{userStats.totalStudySets}</StatNumber>
              <StatLabel>Study Sets</StatLabel>
            </StatCard>
            <StatCard>
              <StatIcon>🎯</StatIcon>
              <StatNumber>{userStats.totalCards}</StatNumber>
              <StatLabel>Total Cards</StatLabel>
            </StatCard>
            <StatCard>
              <StatIcon>⏱️</StatIcon>
              <StatNumber>{formatStudyTime(userStats.totalStudyTime)}</StatNumber>
              <StatLabel>Study Time</StatLabel>
            </StatCard>
            <StatCard>
              <StatIcon>🔥</StatIcon>
              <StatNumber>{userStats.streakDays}</StatNumber>
              <StatLabel>Day Streak</StatLabel>
            </StatCard>
          </StatsGrid>
        </StatsSection>
      )}

      {studySets.length === 0 ? (
        <EmptyState>
          <h3>Ready to start learning?</h3>
          <p>Create your first study set or import cards to begin your learning journey.</p>
          <FeatureGrid>
            <FeatureCard>
              <FeatureIcon>🧠</FeatureIcon>
              <FeatureTitle>Smart Learning</FeatureTitle>
              <FeatureDescription>
                Adaptive algorithms help you focus on what you need to learn most
              </FeatureDescription>
            </FeatureCard>
            <FeatureCard>
              <FeatureIcon>📊</FeatureIcon>
              <FeatureTitle>Progress Tracking</FeatureTitle>
              <FeatureDescription>
                Monitor your learning progress with detailed analytics and insights
              </FeatureDescription>
            </FeatureCard>
            <FeatureCard>
              <FeatureIcon>⚡</FeatureIcon>
              <FeatureTitle>Quick Import</FeatureTitle>
              <FeatureDescription>
                Import your existing flashcards from CSV files or paste them directly
              </FeatureDescription>
            </FeatureCard>
          </FeatureGrid>
          <Button 
            size="lg" 
            variant="primary"
            onClick={() => navigate('/create')}
          >
            Get Started Now
          </Button>
        </EmptyState>
      ) : (
        <RecentsContainer>
          <SectionTitle>Your Study Sets</SectionTitle>
          <StudySetGrid>
            {recentStudySets.map((set) => (
              <StudySetCard key={set.id} to={`/studyset/${set.id}`} className="hover-lift">
                <CardTitle>{set.title}</CardTitle>
                <CardMeta>
                  <span>{set.cards?.length || 0} cards</span>
                  <span>→</span>
                </CardMeta>
                <CardStats>
                  {set.studyCount > 0 && <span>Studied {set.studyCount} times</span>}
                  {set.averageScore > 0 && <span>{Math.round(set.averageScore)}% avg score</span>}
                  {set.lastStudied && (
                    <span>
                      Last studied {new Date(set.lastStudied).toLocaleDateString()}
                    </span>
                  )}
                </CardStats>
              </StudySetCard>
            ))}
          </StudySetGrid>
          <CTAContainer>
            <Button 
              variant="primary"
              onClick={() => navigate('/create')}
            >
              Create New Set
            </Button>
          </CTAContainer>
        </RecentsContainer>
      )}
    </HomePageContainer>
  );
};

export default HomePage;
