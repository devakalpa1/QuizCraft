import React, { createContext, useState, useEffect } from 'react';

export const StudySetContext = createContext();

export const StudySetProvider = ({ children }) => {
  const [studySets, setStudySets] = useState([]);
  const [activeSet, setActiveSet] = useState(null);
  const [studyProgress, setStudyProgress] = useState({}); // Track progress for each study set
  const [saveStatus, setSaveStatus] = useState({ show: false, saving: false, message: '' });
  const [isInitialLoad, setIsInitialLoad] = useState(true); // Flag to prevent saving during initial load
  const [userStats, setUserStats] = useState({
    totalStudySets: 0,
    totalCards: 0,
    totalStudyTime: 0,
    streakDays: 0,
    lastStudyDate: null
  });

  // Load data from localStorage on mount
  useEffect(() => {
    // Small delay to ensure component is fully mounted
    const loadData = () => {
      console.log('🔄 Loading data from localStorage...');
      const savedSets = localStorage.getItem('quizcraft-study-sets');
      const savedStats = localStorage.getItem('quizcraft-user-stats');
      const savedProgress = localStorage.getItem('quizcraft-study-progress');
      
      console.log('📚 Raw localStorage data:', savedSets);
      
      if (savedSets) {
        try {
          const parsedSets = JSON.parse(savedSets);
          console.log('✅ Parsed study sets:', parsedSets);
          console.log('🔄 Setting studySets state...');
          setStudySets(parsedSets);
        } catch (error) {
          console.error('❌ Error loading study sets:', error);
        }
      } else {
        console.log('📝 No saved study sets found in localStorage');
      }
      
      if (savedStats) {
        try {
          const parsedStats = JSON.parse(savedStats);
          setUserStats(parsedStats);
        } catch (error) {
          console.error('Error loading user stats:', error);
        }
      }

      if (savedProgress) {
        try {
          const parsedProgress = JSON.parse(savedProgress);
          setStudyProgress(parsedProgress);
        } catch (error) {
          console.error('Error loading study progress:', error);
        }
      }
      
      // Mark initial load as complete
      setTimeout(() => {
        setIsInitialLoad(false);
        console.log('🏁 Initial load complete, enabling auto-save');
      }, 200);
    };

    // Load immediately and also with a small delay as backup
    loadData();
    const timeoutId = setTimeout(loadData, 100);
    
    return () => clearTimeout(timeoutId);
  }, []);

  // Save to localStorage whenever studySets changes
  useEffect(() => {
    // Don't save during initial load to prevent overwriting loaded data
    if (isInitialLoad) {
      console.log('⏸️ Skipping save during initial load');
      return;
    }
    
    console.log('💾 Attempting to save study sets:', studySets);
    
    if (studySets.length > 0) {
      setSaveStatus({ show: false, saving: true, message: '' });
    }
    
    try {
      localStorage.setItem('quizcraft-study-sets', JSON.stringify(studySets));
      console.log('✅ Successfully saved to localStorage');
      
      // Verify the save
      const verification = localStorage.getItem('quizcraft-study-sets');
      console.log('🔍 Verification - data in localStorage:', verification);
    } catch (error) {
      console.error('❌ Error saving to localStorage:', error);
    }
    
    // Update stats
    const totalCards = studySets.reduce((sum, set) => sum + (set.cards?.length || 0), 0);
    setUserStats(prev => ({
      ...prev,
      totalStudySets: studySets.length,
      totalCards
    }));

    if (studySets.length > 0) {
      setTimeout(() => {
        setSaveStatus({ show: true, saving: false, message: 'Study sets saved!' });
      }, 500);
    }
  }, [studySets, isInitialLoad]);

  // Save stats to localStorage whenever userStats changes
  useEffect(() => {
    localStorage.setItem('quizcraft-user-stats', JSON.stringify(userStats));
  }, [userStats]);

  // Save progress to localStorage whenever studyProgress changes
  useEffect(() => {
    if (Object.keys(studyProgress).length > 0) {
      setSaveStatus({ show: false, saving: true, message: '' });
    }
    
    localStorage.setItem('quizcraft-study-progress', JSON.stringify(studyProgress));
    
    if (Object.keys(studyProgress).length > 0) {
      setTimeout(() => {
        setSaveStatus({ show: true, saving: false, message: 'Progress saved!' });
      }, 300);
    }
  }, [studyProgress]);

  const addStudySet = (set) => {
    const newSet = { 
      ...set, 
      id: Date.now(),
      createdAt: new Date().toISOString(),
      lastStudied: null,
      studyCount: 0,
      averageScore: 0,
      bestScore: 0
    };
    setStudySets(prev => [...prev, newSet]);
    return newSet;
  };

  const updateStudySet = (id, updates) => {
    setStudySets(prev => prev.map(set => 
      set.id === id ? { ...set, ...updates } : set
    ));
  };

  const deleteStudySet = (id) => {
    setStudySets(prev => prev.filter(set => set.id !== id));
    if (activeSet?.id === id) {
      setActiveSet(null);
    }
  };

  const recordStudySession = (setId, score = null, duration = 0) => {
    const now = new Date().toISOString();
    
    // Update study set stats
    setStudySets(prev => prev.map(set => {
      if (set.id === setId) {
        const newStudyCount = set.studyCount + 1;
        const newBestScore = score !== null ? Math.max(set.bestScore || 0, score) : set.bestScore;
        
        let newAverageScore = set.averageScore;
        if (score !== null) {
          newAverageScore = ((set.averageScore * (newStudyCount - 1)) + score) / newStudyCount;
        }

        return {
          ...set,
          lastStudied: now,
          studyCount: newStudyCount,
          averageScore: newAverageScore,
          bestScore: newBestScore
        };
      }
      return set;
    }));

    // Update user stats
    setUserStats(prev => {
      const today = new Date().toDateString();
      const lastStudyDate = prev.lastStudyDate ? new Date(prev.lastStudyDate).toDateString() : null;
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      
      let newStreakDays = prev.streakDays;
      if (lastStudyDate === today) {
        // Already studied today, don't change streak
        newStreakDays = prev.streakDays;
      } else if (lastStudyDate === yesterday) {
        // Studied yesterday, increment streak
        newStreakDays = prev.streakDays + 1;
      } else if (lastStudyDate === null || lastStudyDate !== yesterday) {
        // First time or streak broken, start new streak
        newStreakDays = 1;
      }

      return {
        ...prev,
        totalStudyTime: prev.totalStudyTime + duration,
        streakDays: newStreakDays,
        lastStudyDate: now
      };
    });
  };

  const getStudySetById = (id) => {
    return studySets.find(set => set.id === parseInt(id));
  };

  const updateStudyProgress = (setId, cardIndex, status) => {
    setStudyProgress(prev => ({
      ...prev,
      [setId]: {
        ...prev[setId],
        [cardIndex]: status
      }
    }));
  };

  const getStudyProgress = (setId) => {
    return studyProgress[setId] || {};
  };

  const clearStudyProgress = (setId) => {
    setStudyProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[setId];
      return newProgress;
    });
  };

  const exportData = () => {
    const data = {
      studySets,
      userStats,
      studyProgress,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    return JSON.stringify(data, null, 2);
  };

  const importData = (jsonData) => {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.studySets) setStudySets(data.studySets);
      if (data.userStats) setUserStats(data.userStats);
      if (data.studyProgress) setStudyProgress(data.studyProgress);
      
      return { success: true, message: 'Data imported successfully!' };
    } catch (error) {
      return { success: false, message: 'Invalid data format. Please check your file.' };
    }
  };

  const value = {
    studySets,
    activeSet,
    userStats,
    studyProgress,
    saveStatus,
    setActiveSet,
    addStudySet,
    updateStudySet,
    deleteStudySet,
    recordStudySession,
    getStudySetById,
    updateStudyProgress,
    getStudyProgress,
    clearStudyProgress,
    exportData,
    importData
  };

  return (
    <StudySetContext.Provider value={value}>
      {children}
    </StudySetContext.Provider>
  );
};
