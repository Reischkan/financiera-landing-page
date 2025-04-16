'use client';

import Image from 'next/image';
import styled from 'styled-components';
import { FinancialProduct, ProductCategory, RiskLevel } from '@/types';
import { 
  Container, 
  Title, 
  Subtitle, 
  Paragraph, 
  Badge, 
  SecondaryButton, 
  Divider 
} from './StyledComponents';
import RiskChart from './RiskChart';
import ProductImagePlaceholder from './ProductImagePlaceholder';

const DetailSection = styled.section`
  padding: 3rem 0;
`;

const BreadcrumbNav = styled.nav`
  margin-bottom: 2rem;
`;

const Breadcrumb = styled.ol`
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  padding: 0;
  margin: 0;
`;

const BreadcrumbItem = styled.li`
  display: flex;
  align-items: center;
  
  &:not(:last-child)::after {
    content: '/';
    margin: 0 0.5rem;
    color: #a0aec0;
  }
`;

const BreadcrumbLink = styled.a`
  color: #4299e1;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
  
  &.active {
    color: #4a5568;
    pointer-events: none;
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const ProductImage = styled.div`
  position: relative;
  width: 100%;
  height: 300px;
  border-radius: 0.5rem;
  overflow: hidden;
  
  @media (min-width: 768px) {
    height: 400px;
  }
`;

const ProductInfo = styled.div``;

const ProductTitle = styled(Title)`
  margin-bottom: 1rem;
`;

const ProductDescription = styled(Paragraph)`
  margin-bottom: 2rem;
`;

const ProductMeta = styled.div`
  margin-bottom: 2rem;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 1rem;
`;

const MetaLabel = styled.span`
  font-weight: 500;
  width: 150px;
`;

const MetaValue = styled.span``;

const BenefitsList = styled.ul`
  padding-left: 1.5rem;
  margin-bottom: 2rem;
`;

const BenefitItem = styled.li`
  margin-bottom: 0.75rem;
`;

const ChartContainer = styled.div`
  margin: 2rem 0;
`;

const BackButton = styled(SecondaryButton)`
  margin-top: 2rem;
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

interface ProductDetailProps {
  product: FinancialProduct;
  onBackClick?: () => void;
}

const ProductDetail = ({ product, onBackClick }: ProductDetailProps) => {
  const { 
    name, 
    description, 
    category, 
    interestRate, 
    annualFee, 
    minimumBalance, 
    riskLevel, 
    benefits, 
    imageUrl 
  } = product;
  
  const categoryLabel = getCategoryLabel(category);
  
  return (
    <DetailSection>
      <Container>
        <BreadcrumbNav aria-label="Breadcrumb">
          <Breadcrumb>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href="/#products">Productos</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink className="active" aria-current="page">{name}</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </BreadcrumbNav>
        
        <Badge style={{ marginBottom: '1rem' }}>{categoryLabel}</Badge>
        
        <ProductGrid>
          <ProductImage>
            <ProductImagePlaceholder category={category} />
          </ProductImage>
          
          <ProductInfo>
            <ProductTitle>{name}</ProductTitle>
            <ProductDescription>{description}</ProductDescription>
            
            <Subtitle>Características principales</Subtitle>
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
            
            {riskLevel && (
              <ChartContainer>
                <Subtitle>Perfil de riesgo</Subtitle>
                <RiskChart riskLevel={riskLevel} />
              </ChartContainer>
            )}
            
            <Divider />
            
            <Subtitle>Beneficios</Subtitle>
            <BenefitsList>
              {benefits.map((benefit, index) => (
                <BenefitItem key={index}>{benefit}</BenefitItem>
              ))}
            </BenefitsList>
            
            <BackButton onClick={onBackClick || (() => window.history.back())}>
              Volver al catálogo
            </BackButton>
          </ProductInfo>
        </ProductGrid>
      </Container>
    </DetailSection>
  );
};

export default ProductDetail; 