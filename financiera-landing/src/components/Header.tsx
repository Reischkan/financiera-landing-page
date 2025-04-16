'use client';

import { useState } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { Container, Flex } from './StyledComponents';

const HeaderWrapper = styled.header`
  background-color: white;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 10;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #4299e1;
`;

const NavMenu = styled.nav`
  display: none;
  
  @media (min-width: 768px) {
    display: flex;
  }
`;

const MobileMenuButton = styled.button`
  display: block;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  
  @media (min-width: 768px) {
    display: none;
  }
`;

const MobileMenu = styled.div<{ isOpen: boolean }>`
  display: ${props => props.isOpen ? 'block' : 'none'};
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  
  @media (min-width: 768px) {
    display: none;
  }
`;

const NavItem = styled.a`
  padding: 0.75rem 1rem;
  color: #4a5568;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s ease;
  
  &:hover {
    color: #4299e1;
  }
`;

const MobileNavItem = styled(NavItem)`
  display: block;
  padding: 0.75rem 0;
`;

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <HeaderWrapper>
      <Container>
        <Flex align="center" justify="space-between" style={{ height: '4rem' }}>
          <Link href="/" passHref>
            <Logo as="a" aria-label="FinBank">FinBank</Logo>
          </Link>
          
          <NavMenu>
            <Link href="/" passHref>
              <NavItem>Inicio</NavItem>
            </Link>
            <Link href="/#products" passHref>
              <NavItem>Productos</NavItem>
            </Link>
            <Link href="#" passHref>
              <NavItem>Nosotros</NavItem>
            </Link>
            <Link href="#" passHref>
              <NavItem>Contacto</NavItem>
            </Link>
          </NavMenu>
          
          <MobileMenuButton 
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={isMobileMenuOpen}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              {isMobileMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </>
              )}
            </svg>
          </MobileMenuButton>
        </Flex>
        
        <MobileMenu isOpen={isMobileMenuOpen}>
          <Link href="/" passHref>
            <MobileNavItem>Inicio</MobileNavItem>
          </Link>
          <Link href="/#products" passHref>
            <MobileNavItem>Productos</MobileNavItem>
          </Link>
          <Link href="#" passHref>
            <MobileNavItem>Nosotros</MobileNavItem>
          </Link>
          <Link href="#" passHref>
            <MobileNavItem>Contacto</MobileNavItem>
          </Link>
        </MobileMenu>
      </Container>
    </HeaderWrapper>
  );
};

export default Header; 