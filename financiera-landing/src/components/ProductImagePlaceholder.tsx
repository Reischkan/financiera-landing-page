'use client';

import styled from 'styled-components';
import { ProductCategory } from '@/types';

const PlaceholderContainer = styled.div<{ color: string }>`
  width: 100%;
  height: 100%;
  background-color: ${props => props.color};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  padding: 1rem;
  text-align: center;
`;

const IconContainer = styled.div`
  margin-bottom: 1rem;
  font-size: 3rem;
`;

const PlaceholderText = styled.div`
  font-weight: 500;
  font-size: 1.25rem;
`;

interface ProductImagePlaceholderProps {
  category: ProductCategory;
}

const getCategoryData = (category: ProductCategory): { icon: string; color: string; label: string } => {
  const categoryData = {
    accounts: {
      icon: '💰',
      color: '#4299e1',
      label: 'Cuenta'
    },
    cards: {
      icon: '💳',
      color: '#805ad5',
      label: 'Tarjeta'
    },
    loans: {
      icon: '🏦',
      color: '#38a169',
      label: 'Préstamo'
    },
    investments: {
      icon: '📈',
      color: '#dd6b20',
      label: 'Inversión'
    },
    insurance: {
      icon: '🛡️',
      color: '#2b6cb0',
      label: 'Seguro'
    }
  };
  
  return categoryData[category];
};

const ProductImagePlaceholder = ({ category }: ProductImagePlaceholderProps) => {
  const { icon, color, label } = getCategoryData(category);
  
  return (
    <PlaceholderContainer color={color}>
      <IconContainer>{icon}</IconContainer>
      <PlaceholderText>{label}</PlaceholderText>
    </PlaceholderContainer>
  );
};

export default ProductImagePlaceholder; 