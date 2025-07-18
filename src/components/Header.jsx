import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Button from './Button';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-4) var(--space-8);
  background: var(--card-background-color);
  border-bottom: 1px solid var(--border-color);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: var(--shadow-md);
  
  @media (max-width: 768px) {
    padding: var(--space-3) var(--space-4);
  }
`;

const Logo = styled(Link)`
  font-size: var(--font-size-2xl);
  font-weight: 800;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: all var(--transition-normal);
  
  &:hover {
    transform: scale(1.05);
  }
  
  @media (max-width: 768px) {
    font-size: var(--font-size-xl);
  }
`;

const NavItems = styled.div`
  display: flex;
  gap: var(--space-3);
  align-items: center;
  
  @media (max-width: 640px) {
    gap: var(--space-2);
  }
`;

const NavLink = styled(Link)`
  color: var(--text-color-secondary);
  font-weight: 500;
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  transition: all var(--transition-normal);
  
  &:hover {
    color: var(--text-color);
    background: rgba(255, 255, 255, 0.05);
  }
  
  @media (max-width: 640px) {
    padding: var(--space-1) var(--space-2);
    font-size: var(--font-size-sm);
  }
`;

const Header = () => {
  const navigate = useNavigate();
  
  return (
    <HeaderContainer className="fade-in">
      <Logo to="/">QuizCraft</Logo>
      <NavItems>
        <NavLink to="/import">Import</NavLink>
        <Button 
          size="sm" 
          variant="primary"
          onClick={() => navigate('/create')}
        >
          Create Set
        </Button>
      </NavItems>
    </HeaderContainer>
  );
};

export default Header;
