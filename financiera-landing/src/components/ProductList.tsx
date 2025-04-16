'use client';

import { useState, useMemo } from 'react';
import styled from 'styled-components';
import { FinancialProduct, ProductCategory } from '@/types';
import { Grid, Container, Title } from './StyledComponents';
import ProductCard from './ProductCard';
import ProductFilter from './ProductFilter';

const ProductSection = styled.section`
  padding: 3rem 0;
`;

const ProductGrid = styled(Grid)`
  margin-top: 2rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 0;
  width: 100%;
  
  h3 {
    margin-bottom: 1rem;
  }
  
  p {
    color: #718096;
  }
`;

interface ProductListProps {
  products: FinancialProduct[];
}

const ProductList = ({ products }: ProductListProps) => {
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>('all');
  
  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') {
      return products;
    }
    return products.filter(product => product.category === activeCategory);
  }, [products, activeCategory]);
  
  return (
    <ProductSection id="products">
      <Container>
        <Title>Nuestros Productos</Title>
        
        <ProductFilter 
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />
        
        {filteredProducts.length > 0 ? (
          <ProductGrid>
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </ProductGrid>
        ) : (
          <EmptyState>
            <h3>No se encontraron productos</h3>
            <p>Intenta seleccionar otra categoría o vuelve más tarde.</p>
          </EmptyState>
        )}
      </Container>
    </ProductSection>
  );
};

export default ProductList; 