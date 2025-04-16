'use client';

import Link from 'next/link';
import Image from 'next/image';
import styled from 'styled-components';
import { FinancialProduct, ProductCategory, RiskLevel } from '@/types';
import { Card, Badge, Subtitle, Paragraph, PrimaryButton } from './StyledComponents';
import ProductImagePlaceholder from './ProductImagePlaceholder';

const StyledCard = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const ProductImage = styled.div`
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;
`;

const ProductContent = styled.div`
  padding: 1.25rem;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ProductTitle = styled(Subtitle)`
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
`;

const ProductDescription = styled(Paragraph)`
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: #4a5568;
  flex-grow: 1;
`;

const ProductMeta = styled.div`
  margin-bottom: 1rem;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: #4a5568;
`;

const MetaLabel = styled.span`
  font-weight: 500;
  margin-right: 0.5rem;
`;

const MetaValue = styled.span``;

const PromotedBadge = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-color: #4299e1;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  z-index: 1;
`;

const StyledButton = styled(PrimaryButton)`
  width: 100%;
`;

const getCategoryLabel = (category: ProductCategory): string => {
  const labels = {
    accounts: 'Cuenta',
    cards: 'Tarjeta',
    loans: 'Préstamo',
    investments: 'Inversión',
    insurance: 'Seguro'
  };
  return labels[category];
};

const getRiskLabel = (riskLevel: RiskLevel): { label: string; variant: 'success' | 'warning' | 'danger' } => {
  const labels = {
    low: { label: 'Bajo', variant: 'success' as const },
    medium: { label: 'Medio', variant: 'warning' as const },
    high: { label: 'Alto', variant: 'danger' as const }
  };
  return labels[riskLevel];
};

interface ProductCardProps {
  product: FinancialProduct;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { 
    id, 
    name, 
    description, 
    category, 
    interestRate, 
    annualFee, 
    minimumBalance, 
    riskLevel, 
    imageUrl, 
    isPromoted 
  } = product;

  const categoryLabel = getCategoryLabel(category);
  
  return (
    <StyledCard>
      {isPromoted && <PromotedBadge>Destacado</PromotedBadge>}
      
      <ProductImage>
        <ProductImagePlaceholder category={category} />
      </ProductImage>
      
      <ProductContent>
        <Badge style={{ marginBottom: '0.75rem' }}>{categoryLabel}</Badge>
        <ProductTitle>{name}</ProductTitle>
        <ProductDescription>{description}</ProductDescription>
        
        <ProductMeta>
          {interestRate !== undefined && (
            <MetaItem>
              <MetaLabel>Tasa de interés:</MetaLabel>
              <MetaValue>{interestRate}%</MetaValue>
            </MetaItem>
          )}
          
          {annualFee !== undefined && (
            <MetaItem>
              <MetaLabel>Cuota anual:</MetaLabel>
              <MetaValue>${annualFee}</MetaValue>
            </MetaItem>
          )}
          
          {minimumBalance !== undefined && (
            <MetaItem>
              <MetaLabel>Saldo mínimo:</MetaLabel>
              <MetaValue>${minimumBalance}</MetaValue>
            </MetaItem>
          )}
          
          {riskLevel && (
            <MetaItem>
              <MetaLabel>Nivel de riesgo:</MetaLabel>
              <Badge variant={getRiskLabel(riskLevel).variant}>
                {getRiskLabel(riskLevel).label}
              </Badge>
            </MetaItem>
          )}
        </ProductMeta>
        
        <Link href={`/product/${id}`} passHref>
          <StyledButton as="a" aria-label={`Ver detalles de ${name}`}>
            Ver detalles
          </StyledButton>
        </Link>
      </ProductContent>
    </StyledCard>
  );
};

export default ProductCard; 