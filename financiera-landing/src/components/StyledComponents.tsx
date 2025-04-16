import styled from 'styled-components';

// Typography components
export const Title = styled.h1`
  font-weight: 700;
  font-size: 2.25rem;
  line-height: 2.5rem;
  color: #1a202c;
  margin-bottom: 1rem;
`;

export const Subtitle = styled.h2`
  font-weight: 600;
  font-size: 1.5rem;
  line-height: 2rem;
  color: #2d3748;
  margin-bottom: 0.75rem;
`;

export const SectionTitle = styled.h3`
  font-weight: 600;
  font-size: 1.25rem;
  line-height: 1.75rem;
  color: #2d3748;
  margin-bottom: 0.5rem;
`;

export const Paragraph = styled.p`
  font-size: 1rem;
  line-height: 1.5rem;
  color: #4a5568;
  margin-bottom: 1rem;
`;

// Card components
export const Card = styled.div`
  background-color: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
`;

export const CardHeader = styled.div`
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
`;

export const CardBody = styled.div`
  padding: 1.5rem;
`;

export const CardFooter = styled.div`
  padding: 1rem 1.5rem;
  background-color: #f7fafc;
  border-top: 1px solid #e2e8f0;
`;

// Button components
export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  font-weight: 500;
  border-radius: 0.375rem;
  transition: background-color 0.2s ease, color 0.2s ease;
  cursor: pointer;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;

export const PrimaryButton = styled(Button)`
  background-color: #4299e1;
  color: white;
  border: none;

  &:hover:not(:disabled) {
    background-color: #3182ce;
  }
`;

export const SecondaryButton = styled(Button)`
  background-color: transparent;
  color: #4299e1;
  border: 1px solid #4299e1;

  &:hover:not(:disabled) {
    background-color: rgba(66, 153, 225, 0.1);
  }
`;

// Badge component for categories, risk levels, etc.
export const Badge = styled.span<{ variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' }>`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1;
  border-radius: 9999px;
  white-space: nowrap;
  
  ${({ variant = 'primary' }) => {
    switch (variant) {
      case 'success':
        return `
          background-color: #c6f6d5;
          color: #22543d;
        `;
      case 'warning':
        return `
          background-color: #feebc8;
          color: #744210;
        `;
      case 'danger':
        return `
          background-color: #fed7d7;
          color: #822727;
        `;
      case 'info':
        return `
          background-color: #bee3f8;
          color: #2a4365;
        `;
      default:
        return `
          background-color: #e9d8fd;
          color: #44337a;
        `;
    }
  }}
`;

// Container with max-width for content
export const Container = styled.div`
  width: 100%;
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
  
  @media (min-width: 640px) {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
  
  @media (min-width: 1024px) {
    padding-left: 2rem;
    padding-right: 2rem;
  }
`;

// Flex container
export const Flex = styled.div<{ direction?: string; align?: string; justify?: string; gap?: string }>`
  display: flex;
  flex-direction: ${props => props.direction || 'row'};
  align-items: ${props => props.align || 'stretch'};
  justify-content: ${props => props.justify || 'flex-start'};
  gap: ${props => props.gap || '0'};
`;

// Grid container
export const Grid = styled.div<{ columns?: string; gap?: string }>`
  display: grid;
  grid-template-columns: ${props => props.columns || 'repeat(1, 1fr)'};
  gap: ${props => props.gap || '1rem'};
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: ${props => props.columns || 'repeat(4, 1fr)'};
  }
`;

// Section divider
export const Divider = styled.hr`
  border: 0;
  height: 1px;
  background-color: #e2e8f0;
  margin: 2rem 0;
`;

// Image container with aspect ratio
export const ImageContainer = styled.div<{ aspectRatio?: string }>`
  position: relative;
  width: 100%;
  padding-top: ${props => props.aspectRatio || '56.25%'}; /* Default 16:9 aspect ratio */
  overflow: hidden;
  
  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

// Accessibility skip link (hidden until focused)
export const SkipLink = styled.a`
  position: absolute;
  left: -9999px;
  top: auto;
  width: 1px;
  height: 1px;
  overflow: hidden;
  
  &:focus {
    position: fixed;
    top: 0;
    left: 0;
    width: auto;
    height: auto;
    padding: 0.5rem 1rem;
    background-color: #fff;
    border: 2px solid #4299e1;
    color: #4299e1;
    font-weight: 600;
    z-index: 9999;
  }
`; 