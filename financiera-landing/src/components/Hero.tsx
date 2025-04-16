'use client';

import styled from 'styled-components';
import { Container, PrimaryButton, SecondaryButton, Title, Paragraph } from './StyledComponents';

const HeroSection = styled.section`
  background: linear-gradient(to right, #4299e1, #667eea);
  color: white;
  padding: 4rem 0;
  
  @media (min-width: 768px) {
    padding: 6rem 0;
  }
`;

const HeroContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  
  @media (min-width: 768px) {
    text-align: left;
    align-items: flex-start;
  }
  
  @media (min-width: 1024px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const HeroText = styled.div`
  max-width: 600px;
  
  @media (min-width: 1024px) {
    flex: 1;
    padding-right: 2rem;
  }
`;

const HeroImage = styled.div`
  margin-top: 3rem;
  width: 100%;
  max-width: 450px;
  position: relative;
  height: 300px;
  
  @media (min-width: 1024px) {
    margin-top: 0;
    flex: 1;
  }
`;

const HeroIllustration = styled.div`
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const IconContainer = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const IllustrationText = styled.div`
  font-weight: 600;
  font-size: 1.25rem;
`;

const HeroTitle = styled(Title)`
  color: white;
  font-size: 2.25rem;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  
  @media (min-width: 768px) {
    font-size: 3rem;
  }
`;

const HeroDescription = styled(Paragraph)`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.125rem;
  margin-bottom: 2rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const HeroButton = styled(PrimaryButton)`
  background-color: white;
  color: #4299e1;
  font-weight: 600;
  
  &:hover {
    background-color: #f7fafc;
  }
`;

const SecondaryHeroButton = styled(SecondaryButton)`
  color: white;
  border-color: white;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const Hero = () => {
  return (
    <HeroSection>
      <Container>
        <HeroContent>
          <HeroText>
            <HeroTitle>Soluciones financieras digitales para un futuro mejor</HeroTitle>
            <HeroDescription>
              Descubre nuestros productos financieros diseñados para ayudarte a alcanzar tus metas. 
              Seguridad, innovación y atención personalizada en cada etapa.
            </HeroDescription>
            <ButtonGroup>
              <HeroButton as="a" href="#products">
                Explorar Productos
              </HeroButton>
              <SecondaryHeroButton as="a" href="#">
                Conocer Más
              </SecondaryHeroButton>
            </ButtonGroup>
          </HeroText>
          <HeroImage>
            <HeroIllustration>
              <IconContainer>💼💰</IconContainer>
              <IllustrationText>Finanzas Inteligentes</IllustrationText>
            </HeroIllustration>
          </HeroImage>
        </HeroContent>
      </Container>
    </HeroSection>
  );
};

export default Hero; 