'use client';

import { useRouter } from 'next/navigation';
import ProductDetail from './ProductDetail';
import { FinancialProduct } from '@/types';

interface ClientProductDetailProps {
  product: FinancialProduct;
}

export default function ClientProductDetail({ product }: ClientProductDetailProps) {
  const router = useRouter();
  
  const handleBackClick = () => {
    router.push('/#products');
  };
  
  return (
    <ProductDetail product={product} onBackClick={handleBackClick} />
  );
} 