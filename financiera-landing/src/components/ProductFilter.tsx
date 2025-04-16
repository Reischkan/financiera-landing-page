'use client';

import styled from 'styled-components';
import { ProductCategory, ProductFilterProps } from '@/types';

const FilterContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  margin-bottom: 2rem;
  padding-bottom: 0.5rem;
  -webkit-overflow-scrolling: touch;
  
  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }
  
  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
  
  @media (min-width: 768px) {
    justify-content: center;
    overflow-x: visible;
  }
`;

const FilterButton = styled.button<{ isActive: boolean }>`
  padding: 0.75rem 1.25rem;
  margin-right: 0.5rem;
  border: none;
  background-color: ${props => props.isActive ? '#4299e1' : '#edf2f7'};
  color: ${props => props.isActive ? 'white' : '#4a5568'};
  font-weight: 500;
  border-radius: 9999px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.isActive ? '#3182ce' : '#e2e8f0'};
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
  }
  
  &:last-child {
    margin-right: 0;
  }
`;

const ProductFilter = ({ activeCategory, setActiveCategory }: ProductFilterProps) => {
  const categories: { value: ProductCategory | 'all'; label: string }[] = [
    { value: 'all', label: 'Todos' },
    { value: 'accounts', label: 'Cuentas' },
    { value: 'cards', label: 'Tarjetas' },
    { value: 'loans', label: 'Préstamos' },
    { value: 'investments', label: 'Inversiones' },
    { value: 'insurance', label: 'Seguros' },
  ];
  
  return (
    <FilterContainer>
      {categories.map(category => (
        <FilterButton
          key={category.value}
          isActive={activeCategory === category.value}
          onClick={() => setActiveCategory(category.value)}
          aria-label={`Filtrar por ${category.label}`}
          aria-pressed={activeCategory === category.value}
        >
          {category.label}
        </FilterButton>
      ))}
    </FilterContainer>
  );
};

export default ProductFilter; 