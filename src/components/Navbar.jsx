import React from 'react';
import styled from 'styled-components';
import Button from './Button';

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #1a1a2e;
`;

const NavItems = styled.div`
  display: flex;
  gap: 1rem;
`;

const Navbar = () => {
  return (
    <Nav>
      <h2>Flashcard Set</h2>
      <NavItems>
        <Button>Get a hint</Button>
        {/* Other nav items can go here */}
      </NavItems>
    </Nav>
  );
};

export default Navbar;
